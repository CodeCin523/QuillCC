export function createFile(data) {
  return {
    _id: data._id,
    name: data.name,
    parentId: data.parentId ?? null,
    content: data.content ?? "",
    type: data.type ?? "text/plain",
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}

export function assertFile(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("File must be an object");
  }

  const required = ["_id", "name", "parentId", "content", "type", "createdAt", "updatedAt"];

  for (const key of required) {
    if (!(key in obj)) {
      throw new Error(`Invalid File: missing field "${key}"`);
    }
  }

  if (typeof obj._id !== "string") throw new Error("File._id must be string");
  if (typeof obj.name !== "string") throw new Error("File.name must be string");
  if (typeof obj.content !== "string") throw new Error("File.content must be string");

  if (obj.parentId !== null && typeof obj.parentId !== "string") {
    throw new Error("File.parentId must be string or null");
  }

  if (typeof obj.type !== "string") throw new Error("File.type must be string");

  if (isNaN(new Date(obj.createdAt))) {
    throw new Error("File.createdAt is invalid date");
  }

  if (isNaN(new Date(obj.updatedAt))) {
    throw new Error("File.updatedAt is invalid date");
  }
}