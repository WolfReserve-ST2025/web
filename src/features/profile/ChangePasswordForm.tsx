import React, { useState } from 'react';
import axios from '../../api/axios';

function ChangePasswordForm() {
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg('New passwords do not match.');
      setTimeout(() => setPwMsg(null), 2000);
      return;
    }
    try {
      await axios.put('/users/update-password', {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg('Password updated!');
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPwMsg('Failed to update password.');
    }
    setTimeout(() => setPwMsg(null), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      <div className="mb-4">
        <label className="block mb-1">Old Password</label>
        <input
          name="oldPassword"
          type="password"
          value={pwForm.oldPassword}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">New Password</label>
        <input
          name="newPassword"
          type="password"
          value={pwForm.newPassword}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm New Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={pwForm.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Change Password
      </button>
      {pwMsg && <div className="mt-2 text-sm">{pwMsg}</div>}
    </form>
  );
}

export default ChangePasswordForm;
