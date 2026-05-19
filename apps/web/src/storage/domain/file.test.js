// file.test.js
import { describe, it, expect } from "vitest";

import {
  createFile,
  assertFileInput,
  assertFileEntity
} from "./file.js";

describe("file domain", () => {

  describe("createFile", () => {

    it("creates a file with provided values", () => {
      const now = new Date();

      const file = createFile({
        _id: "file-1",
        name: "notes.txt",
        parentId: "dir-1",
        content: "hello world",
        type: "text/plain",
        createdAt: now,
        updatedAt: now
      });

      expect(file).toEqual({
        _id: "file-1",
        name: "notes.txt",
        parentId: "dir-1",
        content: "hello world",
        type: "text/plain",
        createdAt: now,
        updatedAt: now
      });
    });

    it("applies default values", () => {
      const file = createFile({
        _id: "file-1",
        name: "notes.txt"
      });

      expect(file._id).toBe("file-1");
      expect(file.name).toBe("notes.txt");
      expect(file.parentId).toBeNull();
      expect(file.content).toBe("");
      expect(file.type).toBe("text/plain");

      expect(file.createdAt).toBeInstanceOf(Date);
      expect(file.updatedAt).toBeInstanceOf(Date);
    });

  });

  describe("assertFileInput", () => {

    it("accepts valid input", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: null,
          content: "hello",
          type: "text/plain"
        });
      }).not.toThrow();
    });

    it("throws if input is not an object", () => {
      expect(() => assertFileInput(null))
        .toThrow("File input must be an object");

      expect(() => assertFileInput("bad"))
        .toThrow("File input must be an object");
    });

    it("throws if name is missing", () => {
      expect(() => {
        assertFileInput({
          parentId: null
        });
      }).toThrow("File.name is required");
    });

    it("throws if name is empty", () => {
      expect(() => {
        assertFileInput({
          name: "   ",
          parentId: null
        });
      }).toThrow("File.name is required");
    });

    it("throws if parentId is invalid", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: 123
        });
      }).toThrow("File.parentId must be string or null");
    });

    it("throws if content is invalid", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: null,
          content: 123
        });
      }).toThrow("File.content must be a string");
    });

    it("throws if type is invalid", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: null,
          type: 123
        });
      }).toThrow("File.type must be a string");
    });

    it("throws if _id is included", () => {
      expect(() => {
        assertFileInput({
          _id: "file-1",
          name: "notes.txt",
          parentId: null
        });
      }).toThrow("File input must NOT include _id");
    });

    it("throws if createdAt is included", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: null,
          createdAt: new Date()
        });
      }).toThrow("File input must NOT include createdAt");
    });

    it("throws if updatedAt is included", () => {
      expect(() => {
        assertFileInput({
          name: "notes.txt",
          parentId: null,
          updatedAt: new Date()
        });
      }).toThrow("File input must NOT include updatedAt");
    });

  });

  describe("assertFileEntity", () => {

    it("accepts a valid file entity", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: null,
          content: "hello",
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).not.toThrow();
    });

    it("throws if entity is not an object", () => {
      expect(() => assertFileEntity(null))
        .toThrow("File must be an object");
    });

    it("throws if required fields are missing", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1"
        });
      }).toThrow("File missing field: name");
    });

    it("throws if _id is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: 123,
          name: "notes.txt",
          parentId: null,
          content: "",
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("File._id must be string");
    });

    it("throws if name is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: 123,
          parentId: null,
          content: "",
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("File.name must be string");
    });

    it("throws if parentId is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: 123,
          content: "",
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("File.parentId must be string or null");
    });

    it("throws if content is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: null,
          content: 123,
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("File.content must be string");
    });

    it("throws if type is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: null,
          content: "",
          type: 123,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("File.type must be string");
    });

    it("throws if createdAt is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: null,
          content: "",
          type: "text/plain",
          createdAt: "bad-date",
          updatedAt: new Date()
        });
      }).toThrow("File.createdAt invalid");
    });

    it("throws if updatedAt is invalid", () => {
      expect(() => {
        assertFileEntity({
          _id: "file-1",
          name: "notes.txt",
          parentId: null,
          content: "",
          type: "text/plain",
          createdAt: new Date(),
          updatedAt: "bad-date"
        });
      }).toThrow("File.updatedAt invalid");
    });

  });

});