const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rootDirectoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Directory' },
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);