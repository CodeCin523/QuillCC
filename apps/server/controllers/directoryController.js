const Directory = require('../models/Directory');
const File = require('../models/File');

// Helper to build tree
const buildTree = async (workspaceId, parentId = null) => {
  const dirs = await Directory.find({ workspaceId, parentId });
  const tree = [];

  for (const dir of dirs) {
    const children = await buildTree(workspaceId, dir._id);
    const files = await File.find({ workspaceId, parentId: dir._id });
    tree.push({
      ...dir.toObject(),
      children: [...children, ...files],
    });
  }

  return tree;
};

const listDirectories = async (req, res) => {
  try {
    const directories = await Directory.find({
      workspaceId: req.params.workspaceId,
    });

    res.json(directories);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// GET /tree
const getTree = async (req, res) => {
  try {
    const tree = await buildTree(req.params.workspaceId);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workspaces/:workspaceId/directories
const createDirectory = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    const directory = new Directory({
      name,
      workspaceId: req.params.workspaceId,
      parentId: parentId || null,
      creatorId: req.user._id,
    });
    await directory.save();
    res.status(201).json(directory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workspaces/:workspaceId/directories/:directoryId
const getDirectory = async (req, res) => {
  try {
    const dir = await Directory.findById(req.params.directoryId);
    if (!dir) return res.status(404).json({ message: 'Directory not found' });
    res.json(dir);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/workspaces/:workspaceId/directories/:directoryId
const updateDirectory = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    const dir = await Directory.findByIdAndUpdate(
      req.params.directoryId,
      { name, parentId },
      { returnDocument: "after" }
    );
    res.json(dir);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workspaces/:workspaceId/directories/:directoryId
const deleteDirectory = async (req, res) => {
  try {
    await File.deleteMany({ parentId: req.params.directoryId });
    await Directory.deleteMany({ parentId: req.params.directoryId });
    await Directory.findByIdAndDelete(req.params.directoryId);
    res.json({ message: 'Directory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTree,
  listDirectories,
  createDirectory,
  getDirectory,
  updateDirectory,
  deleteDirectory,
};