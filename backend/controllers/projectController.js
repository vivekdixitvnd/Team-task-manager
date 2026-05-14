const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline, members } = req.body;

    const project = await Project.create({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      members: members || [],
      status: 'planning',
      createdBy: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('members', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is admin or project member
    if (req.user.role !== 'admin' && !project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    project.status = status;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};