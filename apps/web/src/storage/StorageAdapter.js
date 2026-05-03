export class StorageAdapter {
  // --- Directories ---
  async createDirectory(dir) {
    throw new Error("Not implemented")
  }
  async deleteDirectory(id) {
    throw new Error("Not implemented")
  }

  async saveDirectory(dir) {
    throw new Error("Not implemented")
  }

  async getDirectory(id) {
    throw new Error("Not implemented")
  }
  async getAllDirectories() {
    throw new Error("Not implemented")
  }

  // --- Files ---
  async createFile(file) {
    throw new Error("Not implemented")
  }
  async deleteFile(id) {
    throw new Error("Not implemented")
  }

  async saveFile(file) {
    throw new Error("Not implemented")
  }

  async getFile(id) {
    throw new Error("Not implemented")
  }
  async getAllFiles() {
    throw new Error("Not implemented")
  }
}