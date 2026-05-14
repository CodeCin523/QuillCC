import { StorageAdapter } from "./StorageAdapter.js";
import { SERVER_URL } from "../../shared/domain/url.js";
import {
  createDirectory, assertDirectoryInput, assertDirectoryEntity,
  createFile, assertFileInput, assertFileEntity
} from "../utils/FileDirectoryUtils.js";

export class RemoteStorageAdapter extends StorageAdapter {
  constructor(token) {
    super();
    this.token = token;
  }

  async request(endpoint, { method = "GET", body = null } = {}) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
    };

    const res = await fetch(`${SERVER_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "API Error");
    }

    return res.json();
  }

  // --- Directories ---
  async createDirectory(dirInput) {
    assertDirectoryInput(dirInput); // validate input
    const data = await this.request(`/api/workspaces/default/directories`, {
      method: "POST",
      body: dirInput,
    });
    assertDirectoryEntity(data); // validate backend response
    return createDirectory(data);
  }

  async saveDirectory(dir) {
    assertDirectoryEntity(dir); // must have all fields
    const data = await this.request(`/api/workspaces/default/directories/${dir._id}`, {
      method: "PATCH",
      body: dir,
    });
    assertDirectoryEntity(data);
    return createDirectory(data);
  }

  async getDirectory(id) {
    const data = await this.request(`/api/workspaces/default/directories/${id}`);
    assertDirectoryEntity(data);
    return createDirectory(data);
  }

  async getAllDirectories() {
    const directories = await this.request(`/api/workspaces/default/directories/tree`);
    return directories.map(d => {
      assertDirectoryEntity(d);
      return createDirectory(d);
    });
  }

  async deleteDirectory(id) {
    await this.request(`/api/workspaces/default/directories/${id}`, { method: "DELETE" });
    return true;
  }

  // --- Files ---
  async createFile(fileInput) {
    assertFileInput(fileInput); // validate input
    const data = await this.request(`/api/workspaces/default/files`, {
      method: "POST",
      body: fileInput,
    });
    assertFileEntity(data); // validate backend response
    return createFile(data);
  }

  async saveFile(file) {
    assertFileEntity(file); // must have all fields
    const data = await this.request(`/api/workspaces/default/files/${file._id}`, {
      method: "PATCH",
      body: file,
    });
    assertFileEntity(data);
    return createFile(data);
  }

  async getFile(id) {
    const data = await this.request(`/api/workspaces/default/files/${id}`);
    assertFileEntity(data);
    return createFile(data);
  }

  async getAllFiles() {
    const files = await this.request(`/api/workspaces/default/files`);
    return files.map(f => {
      assertFileEntity(f);
      return createFile(f);
    });
  }

  async deleteFile(id) {
    await this.request(`/api/workspaces/default/files/${id}`, { method: "DELETE" });
    return true;
  }
}