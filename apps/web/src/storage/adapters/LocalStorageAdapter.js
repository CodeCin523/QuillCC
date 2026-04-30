import { createDirectory, assertDirectoryInput, assertDirectoryEntity } from "../../domain/directory.js"
import { createFile, assertFileInput, assertFileEntity } from "../../domain/file.js"
import { StorageAdapter } from "../StorageAdapter.js"

const KEYS = {
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
    const sessionId = sessionStorage.getItem(KEYS.SESSION_ID) ?? crypto.randomUUID();
    sessionStorage.setItem(KEYS.SESSION_ID, sessionId);

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
    assertDirectoryInput(dir);

    const _id = this._nextId();
    const now = new Date();

    const newDir = createDirectory({
      ...dir,
      _id,
      createdAt: now,
      updatedAt: now,
    });

    const dirs = this._getDirectories();
    dirs[_id] = newDir;
    this._write(KEY.DIRECTORIES, dirs);

    return newDir;
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
    // validate input (no id, no timestamps)
    assertFileInput(file);

    // system fields
    const _id = this._nextId();
    const now = new Date();

    // build domain entity
    const newFile = createFile({
      ...file,
      _id,
      createdAt: now,
      updatedAt: now,
    });

    // persist
    const files = this._getFiles();
    files[_id] = newFile;
    this._write(KEY.FILES, files);

    return newFile;
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