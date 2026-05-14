import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import ProjectCreateForm from '../components/ProjectCreateForm';

export default function CreateProject() {
  const navigate = useNavigate();

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    deadline: '',
    members: []
  });

  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectForm.title.trim()) {
      return alert('Project title is required');
    }

    try {
      setSaving(true);

      await API.post('/projects', projectForm);

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar user={user} />

      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>
        <div className="absolute top-60 right-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Create New Project
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Organize your workflow, manage team members and track progress efficiently.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <ProjectCreateForm
              projectForm={projectForm}
              setProjectForm={setProjectForm}
              handleCreateProject={handleCreateProject}
              saving={saving}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
}