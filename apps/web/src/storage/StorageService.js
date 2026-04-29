export class StorageService {
  constructor(adapter) {
    this.adapter = adapter;
  }

  // ------------------------
  // READ (safe wrappers)
  // ------------------------

  async getFile(id) {
    return this.adapter.getFileById(id);
  }

  async getDirectory(id) {
    return this.adapter.getDirectoryById(id);
  }

  // ------------------------
  // MOVE
  // ------------------------

  async moveFile(fileId, newParentId) {
    const file = await this.adapter.getFileById(fileId);
    if (!file) throw new Error("File not found");

    const updated = {
      ...file,
      parentId: newParentId,
      updatedAt: Date.now(),
    };

    return this.adapter.saveFile(updated);
  }

  async moveDirectory(dirId, newParentId) {
    const dir = await this.adapter.getDirectoryById(dirId);
    if (!dir) throw new Error("Directory not found");

    const updated = {
      ...dir,
      parentId: newParentId,
      updatedAt: Date.now(),
    };

    return this.adapter.saveDirectory(updated);
  }

  // ------------------------
  // RENAME
  // ------------------------

  async renameFile(fileId, newName) {
    const file = await this.adapter.getFileById(fileId);
    if (!file) throw new Error("File not found");

    return this.adapter.saveFile({
      ...file,
      name: newName,
      updatedAt: Date.now(),
    });
  }

  async renameDirectory(dirId, newName) {
    const dir = await this.adapter.getDirectoryById(dirId);
    if (!dir) throw new Error("Directory not found");

    return this.adapter.saveDirectory({
      ...dir,
      name: newName,
      updatedAt: Date.now(),
    });
  }

  // ------------------------
  // DELETE
  // ------------------------

  async deleteFile(fileId) {
    return this.adapter.deleteFile(fileId);
  }

  async deleteDirectory(dirId) {
    // NOTE: you may later add recursive delete logic here
    return this.adapter.deleteDirectory(dirId);
  }

  // ------------------------
  // PATH / LOOKUP (future index layer hook)
  // ------------------------

  async resolvePath(path) {
    // intentionally NOT implemented yet
    throw new Error("Not implemented (depends on index layer)");
  }
}