const mongoose = require('mongoose');

const directorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Directory', default: null },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Directory', directorySchema);