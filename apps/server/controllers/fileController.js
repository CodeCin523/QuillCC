const File = require('../models/File');

// GET /api/workspaces/:workspaceId/files
const listFiles = async (req, res) => {
  try {
    const files = await File.find({
      workspaceId: req.params.workspaceId,
    });

    res.json(files);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// POST /api/workspaces/:workspaceId/files
const createFile = async (req, res) => {
  const { name, parentId, content, type } = req.body;
  try {
    const file = new File({
      name,
      parentId: parentId || null,
      workspaceId: req.params.workspaceId,
      content,
      type,
      creatorId: req.user._id,
    });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workspaces/:workspaceId/files/:fileId
const getFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/workspaces/:workspaceId/files/:fileId
const updateFile = async (req, res) => {
  const { name, content, parentId, type } = req.body;
  try {
    const file = await File.findByIdAndUpdate(
      req.params.fileId,
      { name, content, parentId, type },
      { returnDocument: "after" }
    );
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workspaces/:workspaceId/files/:fileId
const deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.fileId);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
};