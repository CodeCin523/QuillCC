import { describe, it, expect, beforeEach } from "vitest";
import { StorageService } from "../StorageService";

// Mock with ID generation
class MockStorageAdapter {
  constructor() {
    this.directories = {};
    this.files = {};
    this._id = 1;
  }

  _generateId() {
    return String(this._id++);
  }

  async saveDirectory(dir) {
    const id = dir.id ?? this._generateId();
    const newDir = { ...dir, id };
    this.directories[id] = newDir;
    return newDir;
  }

  async saveFile(file) {
    const id = file.id ?? this._generateId();
    const newFile = { ...file, id };
    this.files[id] = newFile;
    return newFile;
  }

  async getAllDirectories() {
    return this.directories;
  }

  async getAllFiles() {
    return this.files;
  }

  async getDirectoryById(id) {
    return this.directories[id];
  }

  async getFileById(id) {
    return this.files[id];
  }
}

describe("StorageService", () => {
  let adapter;
  let service;

  beforeEach(() => {
    adapter = new MockStorageAdapter();
    service = new StorageService(adapter);
  });

  // ------------------------
  // BUILD INDEX
  // ------------------------

  it("builds correct paths", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    const file = await adapter.saveFile({
      name: "a.jpg",
      parentId: photos.id,
      type: "file"
    });

    const { byPath } = await service.buildIndex();

    expect(byPath["/photos"]).toBe(photos.id);
    expect(byPath["/photos/a.jpg"]).toBe(file.id);
  });

  // ------------------------
  // LIST DIRECTORIES
  // ------------------------

  it("lists root directories", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    const docs = await adapter.saveDirectory({
      name: "docs",
      parentId: null,
      type: "directory"
    });

    const result = await service.listDirectories();

    expect(result).toEqual(
      expect.arrayContaining(["/photos", "/docs"])
    );
  });

  it("lists child directories", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    await adapter.saveDirectory({
      name: "vacation",
      parentId: photos.id,
      type: "directory"
    });

    const result = await service.listDirectories(photos.id);

    expect(result).toEqual(["/photos/vacation"]);
  });

  it("falls back to root if parentId is invalid", async () => {
    await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    const result = await service.listDirectories("invalid");

    expect(result).toEqual(["/photos"]);
  });

  // ------------------------
  // LIST FILES
  // ------------------------

  it("lists files in a directory (non-recursive)", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    await adapter.saveFile({
      name: "a.jpg",
      parentId: photos.id,
      type: "file"
    });

    await adapter.saveFile({
      name: "b.jpg",
      parentId: null,
      type: "file"
    });

    const result = await service.listFiles(photos.id);

    expect(result).toEqual(["/photos/a.jpg"]);
  });

  it("lists files recursively", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    const vacation = await adapter.saveDirectory({
      name: "vacation",
      parentId: photos.id,
      type: "directory"
    });

    await adapter.saveFile({
      name: "a.jpg",
      parentId: vacation.id,
      type: "file"
    });

    const result = await service.listFiles(photos.id, { recursive: true });

    expect(result).toEqual(["/photos/vacation/a.jpg"]);
  });

  it("lists all files when recursive at root", async () => {
    await adapter.saveFile({
      name: "root.txt",
      parentId: null,
      type: "file"
    });

    const docs = await adapter.saveDirectory({
      name: "docs",
      parentId: null,
      type: "directory"
    });

    await adapter.saveFile({
      name: "doc.txt",
      parentId: docs.id,
      type: "file"
    });

    const result = await service.listFiles(null, { recursive: true });

    expect(result).toEqual(
      expect.arrayContaining(["/root.txt", "/docs/doc.txt"])
    );
  });

  // ------------------------
  // MOVE
  // ------------------------

  it("moves a file", async () => {
    const photos = await adapter.saveDirectory({
      name: "photos",
      parentId: null,
      type: "directory"
    });

    const docs = await adapter.saveDirectory({
      name: "docs",
      parentId: null,
      type: "directory"
    });

    const file = await adapter.saveFile({
      name: "a.jpg",
      parentId: photos.id,
      type: "file"
    });

    await service.moveFile(file.id, docs.id);

    const updated = await adapter.getFileById(file.id);

    expect(updated.parentId).toBe(docs.id);
  });

  it("throws when moving missing file", async () => {
    await expect(service.moveFile("missing", "whatever"))
      .rejects.toThrow("File not found");
  });

  // ------------------------
  // RENAME
  // ------------------------

  it("renames a file", async () => {
    const file = await adapter.saveFile({
      name: "old.txt",
      parentId: null,
      type: "file"
    });

    await service.renameFile(file.id, "new.txt");

    const updated = await adapter.getFileById(file.id);

    expect(updated.name).toBe("new.txt");
  });

  it("throws when renaming missing directory", async () => {
    await expect(service.renameDirectory("missing", "new"))
      .rejects.toThrow("Directory not found");
  });
});