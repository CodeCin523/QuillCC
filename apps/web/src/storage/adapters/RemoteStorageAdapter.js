import { StorageAdapter } from "../StorageAdapter.js";
import { SERVER_URL } from "../../shared/domain/url.js";

import {
  createDirectory,
  assertDirectoryInput,
  assertDirectoryEntity,
} from "../domain/directory.js";

import {
  createFile,
  assertFileInput,
  assertFileEntity,
} from "../domain/file.js";

export class RemoteStorageAdapter extends StorageAdapter {
  constructor(token) {
    super();

    this.token = token;

    // Promise used to avoid race conditions
    this.ready = this.initialize();
  }

  async initialize() {
    try {
      // Check if default workspace resolves
      await this.request("/api/workspaces/");
    } catch (err) {
      // No workspace exists yet
      if (
        err.message.includes("No workspace found") ||
        err.message.includes("404")
      ) {
        await this.request("/api/workspaces", {
          method: "POST",
          body: {
            name: "Default Workspace",
          },
        });
      } else {
        throw err;
      }
    }
  }

  async request(
    endpoint,
    { method = "GET", body = null } = {},
  ) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };

    const res = await fetch(
      `${SERVER_URL}${endpoint}`,
      {
        method,
        headers,
        body: body
          ? JSON.stringify(body)
          : null,
      },
    );

    if (!res.ok) {
      let message = "API Error";

      try {
        const err = await res.json();
        message = err.message || message;
      } catch {}

      throw new Error(message);
    }

    return res.json();
  }

  async ensureReady() {
    await this.ready;
  }

  // --- Directories ---

  async createDirectory(dirInput) {
    await this.ensureReady();

    assertDirectoryInput(dirInput);

    const data = await this.request(
      `/api/workspaces/default/directories`,
      {
        method: "POST",
        body: createDirectory(dirInput),
      },
    );

    assertDirectoryEntity(data);

    return createDirectory(data);
  }

  async saveDirectory(dir) {
    await this.ensureReady();

    assertDirectoryEntity(dir);

    const data = await this.request(
      `/api/workspaces/default/directories/${dir._id}`,
      {
        method: "PATCH",
        body: dir,
      },
    );

    assertDirectoryEntity(data);

    return createDirectory(data);
  }

  async getDirectory(id) {
    await this.ensureReady();

    const data = await this.request(
      `/api/workspaces/default/directories/${id}`,
    );

    assertDirectoryEntity(data);

    return createDirectory(data);
  }

  async getAllDirectories() {
    await this.ensureReady();

    const directories = await this.request(
      `/api/workspaces/default/directories/`,
    );

    return directories.map((d) => {
      assertDirectoryEntity(d);
      return createDirectory(d);
    });
  }

  async deleteDirectory(id) {
    await this.ensureReady();

    await this.request(
      `/api/workspaces/default/directories/${id}`,
      {
        method: "DELETE",
      },
    );

    return true;
  }

  // --- Files ---

  async createFile(fileInput) {
    await this.ensureReady();

    assertFileInput(fileInput);

    const data = await this.request(
      `/api/workspaces/default/files`,
      {
        method: "POST",
        body: createFile(fileInput),
      },
    );

    assertFileEntity(data);

    return createFile(data);
  }

  async saveFile(file) {
    await this.ensureReady();

    assertFileEntity(file);

    const data = await this.request(
      `/api/workspaces/default/files/${file._id}`,
      {
        method: "PATCH",
        body: file,
      },
    );

    assertFileEntity(data);

    return createFile(data);
  }

  async getFile(id) {
    await this.ensureReady();

    const data = await this.request(
      `/api/workspaces/default/files/${id}`,
    );

    assertFileEntity(data);

    return createFile(data);
  }

  async getAllFiles() {
    await this.ensureReady();

    const files = await this.request(
      `/api/workspaces/default/files`,
    );

    return files.map((f) => {
      assertFileEntity(f);
      return createFile(f);
    });
  }

  async deleteFile(id) {
    await this.ensureReady();

    await this.request(
      `/api/workspaces/default/files/${id}`,
      {
        method: "DELETE",
      },
    );

    return true;
  }
}