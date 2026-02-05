import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key, X, UserCircle, Shield, User as UserIcon } from 'lucide-react';
import type { User } from '../../lib/usersApi';
import { fetchUsers, createUser, updateUser, deleteUser, changeUserPassword } from '../../lib/usersApi';

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'user' as 'admin' | 'user'
    });
    const [newPassword, setNewPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createUser(formData);
            await loadUsers();
            setShowCreateModal(false);
            setFormData({ email: '', password: '', full_name: '', role: 'user' });
        } catch (error: any) {
            alert(error.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setSubmitting(true);
        try {
            await updateUser(selectedUser.id, {
                email: formData.email,
                full_name: formData.full_name,
                role: formData.role
            });
            await loadUsers();
            setShowEditModal(false);
            setSelectedUser(null);
        } catch (error: any) {
            alert(error.message || 'Failed to update user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setSubmitting(true);
        try {
            await changeUserPassword(selectedUser.id, newPassword);
            alert('Password changed successfully');
            setShowPasswordModal(false);
            setSelectedUser(null);
            setNewPassword('');
        } catch (error: any) {
            alert(error.message || 'Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete user "${user.full_name}"?`)) return;

        try {
            await deleteUser(user.id);
            await loadUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            password: '',
            full_name: user.full_name,
            role: user.role
        });
        setShowEditModal(true);
    };

    const openPasswordModal = (user: User) => {
        setSelectedUser(user);
        setNewPassword('');
        setShowPasswordModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Users Management</h1>
                    <p className="text-gray-600">Manage application users and their roles</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ email: '', password: '', full_name: '', role: 'user' });
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 bg-ocean-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                >
                    <Plus size={20} />
                    <span>Add User</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-ocean-100 rounded-full flex items-center justify-center">
                                            <UserCircle className="text-ocean-600" size={24} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role === 'admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="text-ocean-600 hover:text-ocean-900 p-2 hover:bg-ocean-50 rounded transition-colors"
                                            title="Edit user"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => openPasswordModal(user)}
                                            className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded transition-colors"
                                            title="Change password"
                                        >
                                            <Key size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-4">Change password for: <strong>{selectedUser.full_name}</strong></p>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
