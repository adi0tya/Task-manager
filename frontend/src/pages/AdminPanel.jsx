import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';

const Tabs = ({ active, onChange }) => (
  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
    {['Users', 'Tasks'].map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
          active === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('Users');
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [taskPagination, setTaskPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [taskFilter, setTaskFilter] = useState('');

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers({ page, limit: 10 });
      setUsers(res.data.data.users);
      setUserPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (taskFilter) params.status = taskFilter;
      const res = await adminAPI.getAllTasks(params);
      setTasks(res.data.data.tasks);
      setTaskPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Users') fetchUsers(1);
    else fetchTasks(1);
  }, [activeTab, taskFilter]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their tasks?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted.');
      fetchUsers(userPagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const roleBadge = (role) =>
    role === 'admin'
      ? 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800'
      : 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all users and tasks in the system.</p>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} />

      {/* Users Tab */}
      {activeTab === 'Users' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">{userPagination.total} total users</p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card animate-pulse h-16 bg-gray-100" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-400 text-sm">No users found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user._id} className="card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <span className={roleBadge(user.role)}>{user.role}</span>
                      </div>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-400 hidden sm:block">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {userPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchUsers(userPagination.page - 1)}
                disabled={userPagination.page === 1}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {userPagination.page} of {userPagination.totalPages}
              </span>
              <button
                onClick={() => fetchUsers(userPagination.page + 1)}
                disabled={userPagination.page === userPagination.totalPages}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'Tasks' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['', 'pending', 'in-progress', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setTaskFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  taskFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {s === '' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">{taskPagination.total} total tasks</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse h-32 bg-gray-100" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-400 text-sm">No tasks found.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} showOwner={true} />
              ))}
            </div>
          )}

          {taskPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchTasks(taskPagination.page - 1)}
                disabled={taskPagination.page === 1}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {taskPagination.page} of {taskPagination.totalPages}
              </span>
              <button
                onClick={() => fetchTasks(taskPagination.page + 1)}
                disabled={taskPagination.page === taskPagination.totalPages}
                className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
