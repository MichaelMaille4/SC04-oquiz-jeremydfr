// Échantillonnage (seeding)

import { prisma } from "./index.ts";

// Users
await prisma.user.createMany({
  data: [
    { firstname: "Alice", lastname: "Oclock", email: "alice@oclock.io", role: "admin", password: "$argon2id$v=19$m=65536,t=3,p=4$DXOFdkk1gmX5l0FogtI3fA$6rks8DLL/0Bcrddfj2E0DPlt3RunF2vObpLVfh8WG3U" }, // "password"
    { firstname: "Bob", lastname: "Oclock", email: "bob@oclock.io", password: "$argon2id$v=19$m=65536,t=3,p=4$DXOFdkk1gmX5l0FogtI3fA$6rks8DLL/0Bcrddfj2E0DPlt3RunF2vObpLVfh8WG3U" }, // "password"
  ]
});

// Levels
await prisma.level.createMany({
  data: [
    { name: "Facile" },
    { name: "Moyen" },
    { name: "Difficile" }
  ]
});

// Tags
await prisma.tag.createMany({ data: [
  { id: 1, name: "Sport", author_id: 1 },
  { id: 2, name: "Cuisine", author_id: 1, color: "#ff00ff" },
  { id: 3, name: "Web Dev", author_id: 1 },
  { id: 4, name: "Frontend", author_id: 1, parent_tag_id: 3 },
  { id: 5, name: "Backend", author_id: 1, parent_tag_id: 3 }
]});

console.log(`📊 Échantillonnage effectué avec succès.`);
