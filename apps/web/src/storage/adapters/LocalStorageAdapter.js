import { createDirectory, assertDirectoryInput, assertDirectoryEntity } from "../domain/directory.js";
import { createFile, assertFileInput, assertFileEntity } from "../domain/file.js";
import { StorageAdapter } from "../StorageAdapter.js";

const KEYS = {
  FILES: "LSA-files",
  DIRECTORIES: "LSA-directories",
  PATH_INDEX: "LSA-pathIndex",
  SESSION_ID: "LSA-sessionId"
};

export class LocalStorageAdapter extends StorageAdapter {
  constructor() {
    super();
  }

  // --- ID generation ---
  _nextId() {
    // let sessionId = sessionStorage.getItem(KEYS.SESSION_ID);
    // if (!sessionId) {
    //   sessionId = crypto.randomUUID();
    //   sessionStorage.setItem(KEYS.SESSION_ID, sessionId);
    // }
    return /*`${sessionId}-*/`${crypto.randomUUID()}`;
  }

  // --- Internal localStorage helpers ---
  _read(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error(`Failed to parse localStorage key "${key}":`, err);
      return {};
    }
  }

  _write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to write localStorage key "${key}":`, err);
      throw err;
    }
  }

  _getFiles() {
    return this._read(KEYS.FILES);
  }

  _getDirectories() {
    return this._read(KEYS.DIRECTORIES);
  }

  _getFile(id) {
    const files = this._getFiles();
    return files[id] ?? null;
  }

  _getDirectory(id) {
    const dirs = this._getDirectories();
    return dirs[id] ?? null;
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
      updatedAt: now
    });

    const dirs = this._getDirectories();
    dirs[_id] = newDir;
    this._write(KEYS.DIRECTORIES, dirs);

    return newDir;
  }

  async saveDirectory(dir) {
    assertDirectoryEntity(dir);
    const dirs = this._getDirectories();
    if (!dirs[dir._id]) throw new Error(`Directory with id ${dir._id} does not exist`);

    const updatedDir = {
      ...dir,
      updatedAt: new Date()
    };

    dirs[dir._id] = updatedDir;
    this._write(KEYS.DIRECTORIES, dirs);

    return dir;
  }

  async deleteDirectory(id) {
    const dirs = this._getDirectories();

    if (!dirs[id]) {
      throw new Error(`Directory with id ${id} does not exist`);
    }

    // collect child directories first
    const childDirs = Object.values(dirs)
      .filter((dir) => dir.parentId === id);

    // recursively delete children
    for (const child of childDirs) {
      await this.deleteDirectory(child._id);
    }

    // refresh state AFTER recursion
    const updatedDirs = this._getDirectories();
    const files = this._getFiles();

    // delete files belonging to this directory
    for (const file of Object.values(files)) {
      if (file.parentId === id) {
        delete files[file._id];
      }
    }

    // delete this directory
    delete updatedDirs[id];

    this._write(KEYS.FILES, files);
    this._write(KEYS.DIRECTORIES, updatedDirs);

    return true;
  }

  async getDirectory(id) {
    return this._getDirectory(id);
  }

  async getAllDirectories() {
    const dirs = this._getDirectories();
    return Object.values(dirs);
  }

  // --- Files ---

  async createFile(file) {
    assertFileInput(file);
    const _id = this._nextId();
    const now = new Date();

    const newFile = createFile({
      ...file,
      _id,
      createdAt: now,
      updatedAt: now
    });

    const files = this._getFiles();
    files[_id] = newFile;
    this._write(KEYS.FILES, files);

    return newFile;
  }

  async saveFile(file) {
    assertFileEntity(file);
    const files = this._getFiles();
    if (!files[file._id]) throw new Error(`File with id ${file._id} does not exist`);

    const updatedFile = {
      ...file,
      updatedAt: new Date()
    };
    files[file._id] = updatedFile;
    this._write(KEYS.FILES, files);

    return updatedFile;
  }

  async deleteFile(id) {
    const files = this._getFiles();
    if (!files[id]) throw new Error(`File with id ${id} does not exist`);

    delete files[id];
    this._write(KEYS.FILES, files);

    return true;
  }

  async getFile(id) {
    return this._getFile(id);
  }

  async getAllFiles() {
    const files = this._getFiles();
    return Object.values(files);
  }
}