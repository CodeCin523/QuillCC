const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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
router.get('/:workspaceId', getWorkspace);
router.patch('/:workspaceId', updateWorkspace);
router.delete('/:workspaceId', deleteWorkspace);

module.exports = router;