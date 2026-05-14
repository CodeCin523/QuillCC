const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const resolveWorkspace =
  require("../middleware/resolveDefaultWorkspace");
const {
  getTree,
  listDirectories,
  createDirectory,
  getDirectory,
  updateDirectory,
  deleteDirectory,
} = require('../controllers/directoryController');

router.use(auth);

router.get('/', resolveWorkspace, listDirectories);
router.get('/tree', resolveWorkspace, getTree);
router.post('/', resolveWorkspace, createDirectory);
router.get('/:directoryId', resolveWorkspace, getDirectory);
router.patch('/:directoryId', resolveWorkspace, updateDirectory);
router.delete('/:directoryId', resolveWorkspace, deleteDirectory);

module.exports = router;