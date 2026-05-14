export default function TaskCreateForm({
  projectId,
  taskForm,
  setTaskForms,
  handleCreateTask,
  saving
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full"></div>

      <div className="relative">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-4">
            Task Manager
          </div>

          <h3 className="text-2xl font-bold text-white">
            Create New Task
          </h3>

          <p className="text-slate-400 mt-2 text-sm">
            Add a task and assign work efficiently to your project workflow.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Task Title
            </label>

            <input
              type="text"
              value={taskForm?.title || ''}
              onChange={(e) =>
                setTaskForms((prev) => ({
                  ...prev,
                  [projectId]: {
                    ...prev[projectId],
                    title: e.target.value
                  }
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
              rows={5}
              value={taskForm?.description || ''}
              onChange={(e) =>
                setTaskForms((prev) => ({
                  ...prev,
                  [projectId]: {
                    ...prev[projectId],
                    description: e.target.value
                  }
                }))
              }
              placeholder="Enter task details..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500 resize-none"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleCreateTask(projectId)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 py-4 rounded-2xl font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saving ? 'Creating Task...' : '🚀 Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
}