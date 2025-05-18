import React from 'react';

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

interface AllUsersTableProps {
  users: User[];
  loading: boolean;
}

function AllUsersTable({ users, loading }: AllUsersTableProps) {
  return (
    <div className="flex-1 bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Surname</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{u.name}</td>
                <td className="py-2 px-4 border">{u.surname}</td>
                <td className="py-2 px-4 border">{u.email}</td>
                <td className="py-2 px-4 border">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllUsersTable;
