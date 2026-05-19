import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { LocalStorageAdapter } from "./LocalStorageAdapter.js";

// --------------------
// localStorage mock
// --------------------
const localStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] ?? null;
    },

    setItem(key, value) {
      store[key] = String(value);
    },

    removeItem(key) {
      delete store[key];
    },

    clear() {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock;

// --------------------
// mocks
// --------------------
vi.mock("../domain/directory.js", () => ({
  createDirectory: vi.fn((data) => data),
  assertDirectoryInput: vi.fn(),
  assertDirectoryEntity: vi.fn()
}));

vi.mock("../domain/file.js", () => ({
  createFile: vi.fn((data) => data),
  assertFileInput: vi.fn(),
  assertFileEntity: vi.fn()
}));

describe("LocalStorageAdapter", () => {
  let adapter;

  const STORAGE_KEYS = [
    "LSA-files",
    "LSA-directories",
    "LSA-pathIndex",
    "LSA-sessionId"
  ];

  beforeEach(() => {
    adapter = new LocalStorageAdapter();

    localStorage.clear();

    // stable ids without depending on order
    vi.spyOn(adapter, "_nextId")
      .mockImplementation(() => crypto.randomUUID());
  });

  afterEach(() => {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

    localStorage.clear();

    vi.restoreAllMocks();
  });

  describe("Directories", () => {
    it("creates a directory", async () => {
      const dir = await adapter.createDirectory({
        name: "root",
        parentId: null
      });

      expect(dir._id).toBeTruthy();

      const stored = await adapter.getDirectory(dir._id);

      expect(stored).toBeTruthy();
      expect(stored.name).toBe("root");
    });

    it("gets all directories", async () => {
      const root = await adapter.createDirectory({
        name: "root",
        parentId: null
      });

      await adapter.createDirectory({
        name: "child",
        parentId: root._id
      });

      const dirs = await adapter.getAllDirectories();

      expect(dirs).toHaveLength(2);
    });

    it("saves a directory", async () => {
      const dir = await adapter.createDirectory({
        name: "root",
        parentId: null
      });

      dir.name = "updated-root";

      await adapter.saveDirectory(dir);

      const updated = await adapter.getDirectory(dir._id);

      expect(updated.name).toBe("updated-root");
    });

    it("deletes a directory recursively with child files", async () => {
      const parent = await adapter.createDirectory({
        name: "parent",
        parentId: null
      });

      const child = await adapter.createDirectory({
        name: "child",
        parentId: parent._id
      });

      const file = await adapter.createFile({
        name: "test.txt",
        parentId: child._id,
        content: "hello"
      });

      await adapter.deleteDirectory(parent._id);

      const deletedParent = await adapter.getDirectory(parent._id);
      const deletedChild = await adapter.getDirectory(child._id);
      const deletedFile = await adapter.getFile(file._id);

      // NOTE:
      // The adapter currently has a recursion bug where stale
      // directory references can remain in storage.
      // These assertions validate expected public behavior.
      expect(deletedParent).toBeNull();
      expect(deletedChild).toBeNull();
      expect(deletedFile).toBeNull();
    });

    it("throws when deleting non-existent directory", async () => {
      await expect(adapter.deleteDirectory("missing-dir"))
        .rejects
        .toThrow("Directory with id missing-dir does not exist");
    });
  });

  describe("Files", () => {
    it("creates a file", async () => {
      const file = await adapter.createFile({
        name: "hello.txt",
        parentId: null,
        content: "hello world"
      });

      expect(file._id).toBeTruthy();

      const stored = await adapter.getFile(file._id);

      expect(stored.name).toBe("hello.txt");
      expect(stored.content).toBe("hello world");
    });

    it("gets all files", async () => {
      await adapter.createFile({
        name: "a.txt",
        parentId: null,
        content: ""
      });

      await adapter.createFile({
        name: "b.txt",
        parentId: null,
        content: ""
      });

      const files = await adapter.getAllFiles();

      expect(files).toHaveLength(2);
    });

    it("saves a file", async () => {
      const file = await adapter.createFile({
        name: "a.txt",
        parentId: null,
        content: "old"
      });

      file.content = "new";

      await adapter.saveFile(file);

      const updated = await adapter.getFile(file._id);

      expect(updated.content).toBe("new");
    });

    it("deletes a file", async () => {
      const file = await adapter.createFile({
        name: "delete.txt",
        parentId: null,
        content: ""
      });

      await adapter.deleteFile(file._id);

      const result = await adapter.getFile(file._id);

      expect(result).toBeNull();
    });

    it("throws when deleting non-existent file", async () => {
      await expect(adapter.deleteFile("missing-file"))
        .rejects
        .toThrow("File with id missing-file does not exist");
    });
  });

  describe("localStorage corruption handling", () => {
    it("returns empty object for invalid JSON", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      localStorage.setItem("LSA-files", "{bad json");

      const result = adapter._getFiles();

      expect(result).toEqual({});
    });
  });
});