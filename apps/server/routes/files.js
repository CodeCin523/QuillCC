const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const resolveWorkspace =
  require("../middleware/resolveDefaultWorkspace");
const {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
} = require('../controllers/fileController');

router.use(auth);

router.get('/', resolveWorkspace, listFiles);
router.post('/', resolveWorkspace, createFile);
router.get('/:fileId', resolveWorkspace, getFile);
router.patch('/:fileId', resolveWorkspace, updateFile);
router.delete('/:fileId', resolveWorkspace, deleteFile);

module.exports = router;