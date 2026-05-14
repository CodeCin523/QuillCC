export function createFile(input) {
  return {
    _id: input._id,
    name: input.name,
    parentId: input.parentId ?? null,
    content: input.content ?? "",
    type: input.type ?? "text/plain",
    createdAt: input.createdAt ?? new Date(),
    updatedAt: input.updatedAt ?? new Date(),
  };
}

export function assertFileInput(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("File input must be an object");
  }

  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    throw new Error("File.name is required");
  }

  if (obj.parentId !== null && typeof obj.parentId !== "string") {
    throw new Error("File.parentId must be string or null");
  }

  if (obj.content !== undefined && typeof obj.content !== "string") {
    throw new Error("File.content must be a string");
  }

  console.log(obj);
  if (obj.type !== undefined && typeof obj.type !== "string") {
    throw new Error("File.type must be a string");
  }

  // IMPORTANT: input must NOT have system fields
  if (obj._id) throw new Error("File input must NOT include _id");
  if (obj.createdAt) throw new Error("File input must NOT include createdAt");
  if (obj.updatedAt) throw new Error("File input must NOT include updatedAt");
}

export function assertFileEntity(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("File must be an object");
  }

  const required = ["_id", "name", "parentId", "content", "type", "createdAt", "updatedAt"];

  for (const key of required) {
    if (!(key in obj)) {
      throw new Error(`File missing field: ${key}`);
    }
  }

  if (typeof obj._id !== "string") throw new Error("File._id must be string");
  if (typeof obj.name !== "string") throw new Error("File.name must be string");

  if (obj.parentId !== null && typeof obj.parentId !== "string") {
    throw new Error("File.parentId must be string or null");
  }

  if (typeof obj.content !== "string") throw new Error("File.content must be string");
  if (typeof obj.type !== "string") throw new Error("File.type must be string");

  if (isNaN(new Date(obj.createdAt))) throw new Error("File.createdAt invalid");
  if (isNaN(new Date(obj.updatedAt))) throw new Error("File.updatedAt invalid");
}