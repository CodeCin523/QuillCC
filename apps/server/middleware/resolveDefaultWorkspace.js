const Workspace = require("../models/Workspace");

async function resolveDefaultWorkspace(
  req,
  res,
  next,
) {
  try {
    const { workspaceId } = req.params;

    // Only handle "default"
    if (workspaceId !== "default") {
      return next();
    }

    // Must be authenticated
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Find oldest workspace
    const workspace = await Workspace.findOne({
      ownerId: userId,
    }).sort({
      createdAt: 1,
    });

    if (!workspace) {
      return res.status(404).json({
        message: "No workspace found",
      });
    }

    // Replace param
    req.params.workspaceId =
      workspace._id.toString();

    next();
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message:
        "Failed to resolve default workspace",
    });
  }
}

module.exports = resolveDefaultWorkspace;