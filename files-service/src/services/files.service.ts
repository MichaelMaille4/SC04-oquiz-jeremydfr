import { prisma } from "../lib/prisma.ts";

export function createFile(input: {
  size: number;
  newFilename: string;
  originalFilename: string;
  mimetype: string;
}) {
  return prisma.file.create({ data: input });
}

export function findFileById(id: number) {
  return prisma.file.findUnique({ where: { id } });
}
