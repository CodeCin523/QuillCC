const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resolveWorkspace =
  require("../middleware/resolveDefaultWorkspace");
const {
  listWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} = require('../controllers/workspaceController');

router.use(auth);

router.get('/', listWorkspaces);
router.post('/', createWorkspace);
router.get('/:workspaceId', resolveWorkspace, getWorkspace);
router.patch('/:workspaceId', resolveWorkspace, updateWorkspace);
router.delete('/:workspaceId', resolveWorkspace, deleteWorkspace);

module.exports = router;