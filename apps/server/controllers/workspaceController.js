const Workspace = require('../models/Workspace');
const Directory = require('../models/Directory');

// GET /api/workspaces
const listWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ ownerId: req.user._id });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/workspaces
const createWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const workspace = new Workspace({ name, ownerId: req.user._id });
    await workspace.save();

    // Create root directory
    const rootDir = new Directory({
      name: 'root',
      workspaceId: workspace._id,
      parentId: null,
      creatorId: req.user._id,
    });
    await rootDir.save();

    workspace.rootDirectoryId = rootDir._id;
    await workspace.save();

    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/workspaces/:workspaceId
const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/workspaces/:workspaceId
const updateWorkspace = async (req, res) => {
  const { name } = req.body;
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      { name },
      { new: true }
    );
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/workspaces/:workspaceId
const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    await Directory.deleteMany({ workspaceId: workspace._id });
    await workspace.remove();

    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
};