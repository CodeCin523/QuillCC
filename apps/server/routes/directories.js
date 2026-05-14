const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const {
  getTree,
  createDirectory,
  getDirectory,
  updateDirectory,
  deleteDirectory,
} = require('../controllers/directoryController');

router.use(auth);

router.get('/tree', getTree);
router.post('/', createDirectory);
router.get('/:directoryId', getDirectory);
router.patch('/:directoryId', updateDirectory);
router.delete('/:directoryId', deleteDirectory);

module.exports = router;