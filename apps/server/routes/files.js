const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { createFile, getFile, updateFile, deleteFile } = require('../controllers/fileController');

router.use(auth);

router.post('/', createFile);
router.get('/:fileId', getFile);
router.patch('/:fileId', updateFile);
router.delete('/:fileId', deleteFile);

module.exports = router;