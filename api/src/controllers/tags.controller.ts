import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import z from "zod";
import { parseIdFromParams } from "./utils.ts";
import { ConflictError, ForbiddenError, NotFoundError } from "../lib/errors.ts";
import type { Tag } from "../models/index.ts";

export async function getAllTags(req: Request, res: Response) {
  // BONUS : on améliore la route avec (quelques) query params :
  // GET /api/tags  ?limit=10  &page=2  &author_id=1  &order=name:asc  

  // Query params validation and default values
  const { page, limit, order, author_id } = await z.object({
    limit: z.coerce.number().int().min(1).optional().default(20),
    page: z.coerce.number().int().min(1).optional().default(1),
    author_id: z.coerce.number().int().min(1).optional(),
    order: z.enum(["name:asc", "name:desc"]).default("name:asc").optional(),
  }).parseAsync(req.query);

  // Get tags from database
  const tags = await prisma.tag.findMany({
    ...(author_id && { where: { author_id } }),
    ...(page && { skip: (page - 1) * limit }),
    ...(limit && { take: limit }),
    orderBy: [
      (order === "name:asc") ? { name: "asc" } : {},
      (order === "name:desc") ? { name: "desc" } : {},
    ]
  });

  // Respond to client
  res.json(tags);
}

export async function getOneTag(req: Request, res: Response) {
  // Get ID from params
  const tagId = await parseIdFromParams(req.params.id);

  // Query database
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      author: { select: { id: true, firstname: true, lastname: true } },
      parent_tag: true,
      children_tags: true
    }
  });

  if (! tag) { throw new NotFoundError("Tag not found"); }

  // Respond to client
  res.json(tag);
}

export async function createTag(req: Request, res: Response) {
  // Body validation with optional properties
  const createTagBodySchema = z.object({
    name: z.string().min(1),
    color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "color property should be an hexadecimal color such as #ff00ff when provided").optional(),
    parent_tag_id: z.number().int().min(1).optional()
  });
  const { name, color, parent_tag_id } = await createTagBodySchema.parseAsync(req.body);

  // Other validations
  await assertUniqueName(name);
  await assertParentTagExistsWhenProvided(parent_tag_id);

  // Insertion
  const tag = await prisma.tag.create({ data: {
    name,
    author_id: req.userId,
    ...(color && { color }),
    ...(parent_tag_id && { parent_tag_id })
  }});

  // Respond to client
  res.status(201).json(tag);
}

export async function updateTag(req: Request, res: Response) {
  // Params and body parsing
  const tagId = await parseIdFromParams(req.params.id);

  const { name, color, parent_tag_id } = await z.object({
    name: z.string().min(1).optional(),
    color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "color property should be an hexadecimal color such as #ff00ff when provided").nullable().optional(),
    parent_tag_id: z.number().int().min(1).nullable().optional() // nullable => on peut RETIRER le parent_tag_id
  }).parseAsync(req.body);

  // Retrieve tag
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (! tag) { throw new NotFoundError("Tag not found"); }
  
  // Permissions
  assertUserCanManageTag(tag, req);
  
  // Other body validations
  if (name) { await assertUniqueName(name); }
  if (parent_tag_id) { await assertParentTagExistsWhenProvided(parent_tag_id); }
  
  // Update the tag 
  const updatedTag = await prisma.tag.update({
    where: { id: tagId },
    data: {
      // pour modifier les champs (si l'utilisateur rempli les valeurs)
      ...(name && { name }),
      ...(color && { color }),
      ...(parent_tag_id && { parent_tag_id }),
      // pour retirer le champs (si l'utilisateur choisi explicitement null)
      ...(color === null && { color }), 
      ...(parent_tag_id === null && { parent_tag_id }),
    }
  });

  // Respond to client
  res.json(updatedTag);
}

export async function deleteTag(req: Request, res: Response) {
  const tagId = await parseIdFromParams(req.params.id);

  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (! tag) { throw new NotFoundError("Tag not found"); }

  assertUserCanManageTag(tag, req);

  await prisma.tag.delete({ where: { id: tagId } });
  res.status(204).json();
}

function assertUserCanManageTag(tag: Tag, req: Request) {
  // Si l'utilisateur est administrateur, il a tous les droits sur le tag
  if (req.userRole === "admin") { return; }

  // Si l'utilisateur est author, et qu'il est le créateur du tag,  il a tous les droits sur le tag
  if (req.userRole === "author" && req.userId === tag.author_id) { return; }

  throw new ForbiddenError(`User ${req.userId} cannot manage tag ${tag.id}`);
}

async function assertUniqueName(name: string) {
  const alreadyTakenName = !! await prisma.tag.count({ where: { name }});
  if (alreadyTakenName) { throw new ConflictError("Tag name is already taken"); }
}

async function assertParentTagExistsWhenProvided(parent_tag_id?: number) {
  if (! parent_tag_id) { return; }

  const parentTag = await prisma.tag.findUnique({ where: { id: parent_tag_id } });
  if (! parentTag) { throw new NotFoundError(`Parent tag ${parent_tag_id} does not exist`); }
}
