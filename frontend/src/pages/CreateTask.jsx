import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function CreateTask() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: ''
  });

  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, []);

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      return alert('Task title is required');
    }

    try {
      setSaving(true);

      await API.post('/tasks', {
        title: taskForm.title,
        description: taskForm.description,
        project: projectId
      });

      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to create task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar user={user} />

      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Create New Task
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Add and organize tasks efficiently for your project workflow.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      title: e.target.value
                    }))
                  }
                  placeholder="Enter task title..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>

                <textarea
                  rows={6}
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      description: e.target.value
                    }))
                  }
                  placeholder="Enter task description..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCreateTask}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 px-6 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? 'Creating Task...' : ' Create Task'}
                </button>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}