import React, { useState } from 'react';
import axios from '../../api/axios';
import { User } from '../auth/useCurrentUser';

interface Props {
  user: User | null;
  onUserUpdate: (data: Partial<User>) => void;
}

function EditProfileForm({ user, onUserUpdate }: Props) {
  const [editData, setEditData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
  });
  const [editMsg, setEditMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/users/update', editData);
      setEditMsg('Profile updated!');
      onUserUpdate(editData);
    } catch {
      setEditMsg('Failed to update profile.');
    }
    setTimeout(() => setEditMsg(null), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          name="name"
          value={editData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Surname</label>
        <input
          name="surname"
          value={editData.surname}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={editData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
      {editMsg && <div className="mt-2 text-sm">{editMsg}</div>}
    </form>
  );
}

export default EditProfileForm;
