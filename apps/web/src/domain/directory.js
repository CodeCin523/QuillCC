export function createDirectory(data) {
  return {
    _id: data._id ?? "",
    name: data.name,
    parentId: data.parentId ?? null,
    createdAt: data.createdAt ?? new Date(),
    updatedAt: data.updatedAt ?? new Date(),
  };
}

export function assertDirectoryInput(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Directory input must be an object");
  }

  if (typeof obj.name !== "string" || obj.name.trim() === "") {
    throw new Error("Directory.name is required");
  }

  if (obj.parentId !== null && typeof obj.parentId !== "string") {
    throw new Error("Directory.parentId must be string or null");
  }

  // MUST NOT contain system fields
  if (obj._id) throw new Error("Directory input must NOT include _id");
  if (obj.createdAt) throw new Error("Directory input must NOT include createdAt");
  if (obj.updatedAt) throw new Error("Directory input must NOT include updatedAt");
}

export function assertDirectoryEntity(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Directory must be an object");
  }

  const required = ["_id", "name", "parentId", "createdAt", "updatedAt"];

  for (const key of required) {
    if (!(key in obj)) {
      throw new Error(`Directory missing field: ${key}`);
    }
  }

  if (typeof obj._id !== "string") throw new Error("Directory._id must be string");
  if (typeof obj.name !== "string") throw new Error("Directory.name must be string");

  if (obj.parentId !== null && typeof obj.parentId !== "string") {
    throw new Error("Directory.parentId must be string or null");
  }

  if (isNaN(new Date(obj.createdAt))) throw new Error("Directory.createdAt invalid");
  if (isNaN(new Date(obj.updatedAt))) throw new Error("Directory.updatedAt invalid");
}