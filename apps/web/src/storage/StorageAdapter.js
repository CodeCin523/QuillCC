class StorageAdapter {
  // --- Directories ---
  async getDirectoryById(id) {
    throw new Error("Not implemented")
  }

  async listDirectories(parentId) {
    throw new Error("Not implemented")
  }

  // --- Files ---
  async getFileById(id) {
    throw new Error("Not implemented")
  }

  async listFiles(parentId) {
    throw new Error("Not implemented")
  }

  // --- Mutations ---
  async saveDirectory(dir) {
    throw new Error("Not implemented")
  }

  async saveFile(file) {
    throw new Error("Not implemented")
  }

  async deleteDirectory(id) {
    throw new Error("Not implemented")
  }

  async deleteFile(id) {
    throw new Error("Not implemented")
  }
}