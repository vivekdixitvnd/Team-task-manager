const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createProject,
  getProjects,
  updateProjectStatus
} = require('../controllers/projectController');

router.post('/', auth, role('admin'), createProject);
router.get('/', auth, getProjects);
router.patch('/:id/status', auth, updateProjectStatus);

module.exports = router;