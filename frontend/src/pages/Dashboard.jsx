import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        API.get('/projects'),
        API.get('/tasks')
      ]);

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load dashboard');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const done = tasks.filter((t) => t.status === 'done').length;

    const projectTaskMap = projects.reduce((map, project) => {
      map[project._id] = { project, tasks: [] };
      return map;
    }, {});

    tasks.forEach((task) => {
      const projectId = task.project?._id || task.project;

      if (projectTaskMap[projectId]) {
        projectTaskMap[projectId].tasks.push(task);
      }
    });

    const projectSummaries = Object.values(projectTaskMap).map(
      ({ project, tasks }) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        deadline: project.deadline,
        members: project.members,
        status: project.status,
        totalTasks: tasks.length,
        todo: tasks.filter((t) => t.status === 'todo').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        done: tasks.filter((t) => t.status === 'done').length
      })
    );

    return {
      totalProjects: projectSummaries.length,
      completedProjects: projectSummaries.filter(
        (p) => p.status === 'completed'
      ).length,
      ongoingProjects: projectSummaries.filter(
        (p) => p.status === 'ongoing'
      ).length,
      planningProjects: projectSummaries.filter(
        (p) => p.status === 'planning'
      ).length,
      totalTasks,
      todo,
      inProgress,
      done,
      projectSummaries
    };
  }, [projects, tasks]);

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      setSaving(true);
      await API.put(`/tasks/${taskId}`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProjectStatus = async (projectId, status) => {
    try {
      setSaving(true);
      await API.patch(`/projects/${projectId}/status`, { status });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update project');
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    {
      title: 'Projects',
      value: stats.totalProjects,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Planning',
      value: stats.planningProjects,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      title: 'Ongoing',
      value: stats.ongoingProjects,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      title: 'Completed',
      value: stats.completedProjects,
      color: 'from-emerald-500 to-green-500'
    },
    {
      title: 'Tasks',
      value: stats.totalTasks,
      color: 'from-slate-500 to-gray-700'
    },
    {
      title: 'Todo',
      value: stats.todo,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      color: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Done',
      value: stats.done,
      color: 'from-green-500 to-lime-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-300">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-300 px-6 py-5 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar user={user} />

      <div className="p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Welcome back,
              <span className="text-blue-400 font-semibold ml-2">
                {user?.name || 'User'}
              </span>
            </p>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/create-project')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
            >
              + Create Project
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.color} p-[1px] rounded-3xl`}
            >
              <div className="bg-slate-900 rounded-3xl p-6 h-full backdrop-blur">
                <p className="text-slate-400 text-sm">{card.title}</p>

                <h2 className="text-4xl font-bold mt-3">{card.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Projects Overview</h2>
          </div>

          <div className="space-y-6">
            {stats.projectSummaries.length === 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
                No projects found.
              </div>
            )}

            {stats.projectSummaries.map((projectSummary) => {
              const projectTasks = tasks.filter(
                (task) =>
                  (task.project?._id || task.project) === projectSummary.id
              );

              const isExpanded = expandedProjects[projectSummary.id];

              return (
                <div
                  key={projectSummary.id}
                  className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-2xl hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                 
                    <div>
                      <h3 className="text-2xl font-bold">
                        {projectSummary.title}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3 items-center">
                        <select
                          value={projectSummary.status}
                          disabled={saving}
                          onChange={(e) =>
                            handleUpdateProjectStatus(
                              projectSummary.id,
                              e.target.value
                            )
                          }
                          className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl outline-none"
                        >
                          <option value="planning">Planning</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {projectSummary.deadline && (
                          <div className="bg-slate-800 px-4 py-2 rounded-xl text-sm text-slate-300">
                            Deadline:{' '}
                            {new Date(
                              projectSummary.deadline
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {projectSummary.members?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {projectSummary.members.map((member) => (
                            <span
                              key={member._id}
                              className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-sm"
                            >
                              {member.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="bg-blue-500/10 text-blue-300 px-4 py-2 rounded-xl">
                        Total {projectSummary.totalTasks}
                      </div>

                      <div className="bg-yellow-500/10 text-yellow-300 px-4 py-2 rounded-xl">
                        Todo {projectSummary.todo}
                      </div>

                      <div className="bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-xl">
                        Progress {projectSummary.inProgress}
                      </div>

                      <div className="bg-green-500/10 text-green-300 px-4 py-2 rounded-xl">
                        Done {projectSummary.done}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedProjects((prev) => ({
                        ...prev,
                        [projectSummary.id]: !prev[projectSummary.id]
                      }))
                    }
                    className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {isExpanded ? 'Hide Details ▲' : 'Show Details ▼'}
                  </button>

                  {isExpanded && (
                    <div className="mt-6 border-t border-slate-800 pt-6">
                      {projectSummary.description && (
                        <div className="bg-slate-800 rounded-2xl p-5 mb-6 text-slate-300">
                          <h4 className="text-lg font-semibold mb-2">
                            Project Description
                          </h4>
                          <p>{projectSummary.description}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {projectTasks.length === 0 ? (
                          <div className="bg-slate-800 rounded-2xl p-5 text-slate-400">
                            No tasks available.
                          </div>
                        ) : (
                          projectTasks.map((task) => (
                            <div
                              key={task._id}
                              className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-semibold">
                                    {task.title}
                                  </h4>

                                  <p className="text-slate-400 text-sm mt-1">
                                    {task.description || 'No description'}
                                  </p>
                                </div>

                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    handleUpdateTaskStatus(
                                      task._id,
                                      e.target.value
                                    )
                                  }
                                  className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-white outline-none"
                                >
                                  <option value="todo">Todo</option>
                                  <option value="in-progress">
                                    In Progress
                                  </option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/create-task/${projectSummary.id}`)
                        }
                        className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 transition-all duration-300 px-5 py-3 rounded-xl font-semibold"
                      >
                        + Create Task
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;