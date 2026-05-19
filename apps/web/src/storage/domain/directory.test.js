import { describe, it, expect } from "vitest";

import {
  createDirectory,
  assertDirectoryInput,
  assertDirectoryEntity
} from "./directory.js";

describe("directory domain", () => {

  describe("createDirectory", () => {

    it("creates a directory with provided values", () => {
      const now = new Date();

      const dir = createDirectory({
        _id: "dir-1",
        name: "Documents",
        parentId: "parent-1",
        createdAt: now,
        updatedAt: now
      });

      expect(dir).toEqual({
        _id: "dir-1",
        name: "Documents",
        parentId: "parent-1",
        createdAt: now,
        updatedAt: now
      });
    });

    it("applies default values", () => {
      const dir = createDirectory({
        name: "Root"
      });

      expect(dir._id).toBe("");
      expect(dir.name).toBe("Root");
      expect(dir.parentId).toBeNull();

      expect(dir.createdAt).toBeInstanceOf(Date);
      expect(dir.updatedAt).toBeInstanceOf(Date);
    });

  });

  describe("assertDirectoryInput", () => {

    it("accepts valid input", () => {
      expect(() => {
        assertDirectoryInput({
          name: "Documents",
          parentId: null
        });
      }).not.toThrow();
    });

    it("throws if input is not an object", () => {
      expect(() => assertDirectoryInput(null))
        .toThrow("Directory input must be an object");

      expect(() => assertDirectoryInput("bad"))
        .toThrow("Directory input must be an object");
    });

    it("throws if name is missing", () => {
      expect(() => {
        assertDirectoryInput({
          parentId: null
        });
      }).toThrow("Directory.name is required");
    });

    it("throws if name is empty", () => {
      expect(() => {
        assertDirectoryInput({
          name: "   ",
          parentId: null
        });
      }).toThrow("Directory.name is required");
    });

    it("throws if parentId is invalid", () => {
      expect(() => {
        assertDirectoryInput({
          name: "Docs",
          parentId: 123
        });
      }).toThrow("Directory.parentId must be string or null");
    });

    it("throws if _id is included", () => {
      expect(() => {
        assertDirectoryInput({
          _id: "dir-1",
          name: "Docs",
          parentId: null
        });
      }).toThrow("Directory input must NOT include _id");
    });

    it("throws if createdAt is included", () => {
      expect(() => {
        assertDirectoryInput({
          name: "Docs",
          parentId: null,
          createdAt: new Date()
        });
      }).toThrow("Directory input must NOT include createdAt");
    });

    it("throws if updatedAt is included", () => {
      expect(() => {
        assertDirectoryInput({
          name: "Docs",
          parentId: null,
          updatedAt: new Date()
        });
      }).toThrow("Directory input must NOT include updatedAt");
    });

  });

  describe("assertDirectoryEntity", () => {

    it("accepts a valid directory entity", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1",
          name: "Docs",
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).not.toThrow();
    });

    it("throws if entity is not an object", () => {
      expect(() => assertDirectoryEntity(null))
        .toThrow("Directory must be an object");
    });

    it("throws if required fields are missing", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1"
        });
      }).toThrow("Directory missing field: name");
    });

    it("throws if _id is invalid", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: 123,
          name: "Docs",
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("Directory._id must be string");
    });

    it("throws if name is invalid", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1",
          name: 123,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("Directory.name must be string");
    });

    it("throws if parentId is invalid", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1",
          name: "Docs",
          parentId: 123,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }).toThrow("Directory.parentId must be string or null");
    });

    it("throws if createdAt is invalid", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1",
          name: "Docs",
          parentId: null,
          createdAt: "bad-date",
          updatedAt: new Date()
        });
      }).toThrow("Directory.createdAt invalid");
    });

    it("throws if updatedAt is invalid", () => {
      expect(() => {
        assertDirectoryEntity({
          _id: "dir-1",
          name: "Docs",
          parentId: null,
          createdAt: new Date(),
          updatedAt: "bad-date"
        });
      }).toThrow("Directory.updatedAt invalid");
    });

  });

});