const Workspace = require('../models/Workspace');
const Directory = require('../models/Directory');

async function createDefaultWorkspace(userId, username = 'My') {
  // Check if user already has a workspace
  const existingWorkspace = await Workspace.findOne({
    ownerId: userId,
  });

  if (existingWorkspace) {
    return existingWorkspace;
  }

  // Create workspace
  const workspace = new Workspace({
    name: `${username}'s Workspace`,
    ownerId: userId,
  });

  await workspace.save();

  // Create root directory
  const rootDir = new Directory({
    name: 'root',
    workspaceId: workspace._id,
    parentId: null,
    creatorId: userId,
  });

  await rootDir.save();

  workspace.rootDirectoryId = rootDir._id;

  await workspace.save();

  return workspace;
}

module.exports = createDefaultWorkspace;