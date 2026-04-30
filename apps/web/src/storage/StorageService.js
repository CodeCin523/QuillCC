export class StorageService {
  constructor(adapter) {
    this.adapter = adapter;
  }

  // ------------------------
  // PATH TREE
  // ------------------------

  async buildIndex() {
    const [dirs, files] = await Promise.all([
      this.adapter.getAllDirectories(),
      this.adapter.getAllFiles(),
    ]);

    const pathById = new Map();
    const idByPath = new Map();

    const nodes = [...dirs, ...files];

    // build lookup for parent traversal
    const byId = new Map(nodes.map(n => [n._id, n]));

    const getPath = (node) => {
      const parts = [];
      let current = node;

      while (current) {
        parts.unshift(current.name);
        current = current.parentId ? byId.get(current.parentId) : null;
      }

      return "/" + parts.join("/");
    };

    for (const node of nodes) {
      const path = getPath(node);

      pathById.set(node._id, path);
      idByPath.set(path, node._id);
    }

    this.index = { pathById, idByPath };
  }

  async listDirectories(parentId = null, { recursive = false } = {}) {
    const dirs = await this.adapter.getAllDirectories();

    const byParent = new Map();

    for (const dir of dirs) {
      const key = dir.parentId ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(dir);
    }

    const result = [];

    const visit = (pid) => {
      const children = byParent.get(pid) || [];

      for (const child of children) {
        result.push(child);

        if (recursive) {
          visit(child._id);
        }
      }
    };

    visit(parentId);

    return result;
  }

  async listFiles(parentId = null, { recursive = false } = {}) {
    const files = await this.adapter.getAllFiles();
  
    const byParent = new Map();
  
    for (const file of files) {
      const key = file.parentId ?? null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(file);
    }
  
    const result = [];
  
    const visit = (pid) => {
      const children = byParent.get(pid) || [];
    
      for (const child of children) {
        result.push(child);
      
        if (recursive) {
          visit(child._id);
        }
      }
    };
  
    visit(parentId);
  
    return result;
  }

  // ------------------------
  // MOVE
  // ------------------------

  async moveFile(fileId, newParentId) {
    const file = await this.adapter.getFileById(fileId);
    if (!file) throw new Error("File not found");

    const updated = {
      ...file,
      parentId: newParentId,
      updatedAt: Date.now(),
    };

    return this.adapter.saveFile(updated);
  }

  async moveDirectory(dirId, newParentId) {
    const dir = await this.adapter.getDirectoryById(dirId);
    if (!dir) throw new Error("Directory not found");

    const updated = {
      ...dir,
      parentId: newParentId,
      updatedAt: Date.now(),
    };

    return this.adapter.saveDirectory(updated);
  }

  // ------------------------
  // RENAME
  // ------------------------

  async renameFile(fileId, newName) {
    const file = await this.adapter.getFileById(fileId);
    if (!file) throw new Error("File not found");

    return this.adapter.saveFile({
      ...file,
      name: newName,
      updatedAt: Date.now(),
    });
  }

  async renameDirectory(dirId, newName) {
    const dir = await this.adapter.getDirectoryById(dirId);
    if (!dir) throw new Error("Directory not found");

    return this.adapter.saveDirectory({
      ...dir,
      name: newName,
      updatedAt: Date.now(),
    });
  }
}