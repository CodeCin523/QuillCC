import { StorageAdapter } from "../StorageAdapter.js"

const KEY = {
  FILES: "LSA-files",
  DIRECTORIES: "LSA-directories",
  PATH_INDEX: "LSA-pathIndex",
  SESSION_ID: "LSA-sessionId"
};

export class LocalStorageAdaptor extends StorageAdapter {
  constructor() {
    super();
  }

  _nextId() {
    const sessionId = sessionStorage.getItem(KEY.SESSION_ID) ?? crypto.randomUUID();
    sessionStorage.setItem(KEY.SESSION_ID, sessionId);

    return `${sessionId}-${crypto.randomUUID()}`;
  }

  _read(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  _write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  _getFiles() {
    return this._read(KEYS.FILES) ?? {};
  }
  _getDirectories() {
    return this._read(KEYS.DIRECTORIES) ?? {};
  }

  _getFile(id) {
    return this._getFiles()[id] ?? null;
  }
  _getDirectory(id) {
    return this._getDirectories()[id] ?? null;
  }

  // NEED TO BE MOVE TO SERVICE
  _buildIndex() {
    const dirs = this._getDirectories();
    const files = this._getFiles();

    const byId = {};
    const byPath = {};

    const buildPath = (node) => {
      if (!node.parentId) return `/${node.name}`;

      const parent = byId[node.parentId];
      return `${buildPath(parent)}/${node.name}`;
    };

    // 1. Register directories
    for (const dir of Object.values(dirs)) {
      byId[dir.id] = { ...dir, children: [] };
    }

    // 2. Register files
    for (const file of Object.values(files)) {
      byId[file.id] = { ...file };
    }

    // 3. Build paths
    for (const node of Object.values(byId)) {
      const path = buildPath(node);
      byPath[path] = node.id;
    }

    return { byId, byPath };
  }

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