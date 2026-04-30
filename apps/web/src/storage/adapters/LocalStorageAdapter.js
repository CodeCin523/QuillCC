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