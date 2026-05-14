import { useEffect, useState } from 'react';
import API from '../services/api';

export default function ProjectCreateForm({
  projectForm,
  setProjectForm,
  handleCreateProject,
  saving
}) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/auth/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleMemberChange = (userId) => {
    const currentMembers = projectForm.members || [];

    const isSelected = currentMembers.includes(userId);

    if (isSelected) {
      setProjectForm((prev) => ({
        ...prev,
        members: currentMembers.filter((id) => id !== userId)
      }));
    } else {
      setProjectForm((prev) => ({
        ...prev,
        members: [...currentMembers, userId]
      }));
    }
  };

  return (
    <section id="create-project-form">
      <form onSubmit={handleCreateProject} className="space-y-7">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Project Title
          </label>

          <input
            type="text"
            value={projectForm.title}
            onChange={(e) =>
              setProjectForm((prev) => ({
                ...prev,
                title: e.target.value
              }))
            }
            placeholder="Enter project title..."
            required
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Project Description
          </label>

          <textarea
            rows={5}
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm((prev) => ({
                ...prev,
                description: e.target.value
              }))
            }
            placeholder="Describe your project..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Deadline
          </label>

          <input
            type="date"
            value={projectForm.deadline || ''}
            onChange={(e) =>
              setProjectForm((prev) => ({
                ...prev,
                deadline: e.target.value
              }))
            }
            className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Assign Members
          </label>

          {loadingUsers ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-400">
              Loading users...
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 custom-scrollbar">
              {users.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No users found.
                </p>
              ) : (
                users.map((user) => {
                  const isChecked = (
                    projectForm.members || []
                  ).includes(user._id);

                  return (
                    <label
                      key={user._id}
                      className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isChecked
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleMemberChange(user._id)}
                          className="w-5 h-5 accent-blue-500 rounded"
                        />

                        <div>
                          <p className="text-white font-medium">
                            {user.name}
                          </p>

                          <p className="text-sm text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {user.role}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] transition-all duration-300 py-4 rounded-2xl font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? 'Creating Project...' : ' Create Project'}
          </button>
        </div>
      </form>
    </section>
  );
}