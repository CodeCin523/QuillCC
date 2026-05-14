const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Directory', default: null },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  type: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);