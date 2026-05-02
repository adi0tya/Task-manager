import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';

const StatCard = ({ label, value, color }) => (
  <div className="card text-center">
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await tasksAPI.getAll({ limit: 5 });
        const tasks = res.data.data.tasks;
        const total = res.data.data.pagination.total;

        // Fetch all for stats (up to 100)
        const allRes = await tasksAPI.getAll({ limit: 100 });
        const allTasks = allRes.data.data.tasks;

        setStats({
          total,
          pending: allTasks.filter((t) => t.status === 'pending').length,
          inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
          completed: allTasks.filter((t) => t.status === 'completed').length,
        });
        setRecentTasks(tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status) => {
    const map = {
      pending: 'badge-pending',
      'in-progress': 'badge-in-progress',
      completed: 'badge-completed',
    };
    return map[status] || 'badge-pending';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's an overview of your tasks.
          {isAdmin && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
              Admin
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-24 bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={stats.total} color="text-gray-900" />
          <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
          <StatCard label="In Progress" value={stats.inProgress} color="text-blue-600" />
          <StatCard label="Completed" value={stats.completed} color="text-green-600" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/tasks"
          className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">My Tasks</p>
            <p className="text-sm text-gray-500">View and manage your tasks</p>
          </div>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Admin Panel</p>
              <p className="text-sm text-gray-500">Manage all users and tasks</p>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse h-16 bg-gray-100" />
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-gray-400 text-sm">No tasks yet.</p>
            <Link to="/tasks" className="btn-primary inline-block mt-3 text-sm">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task._id} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`badge-${task.status === 'in-progress' ? 'in-progress' : task.status}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
