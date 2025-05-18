import React from 'react';

interface ProfileCardProps {
  user: {
    name: string;
    surname: string;
    email: string;
    role: string;
  } | null;
}

function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {user ? (
        <div>
          <div className="mb-2"><span className="font-semibold">Name:</span> {user.name}</div>
          <div className="mb-2"><span className="font-semibold">Surname:</span> {user.surname}</div>
          <div className="mb-2"><span className="font-semibold">Email:</span> {user.email}</div>
          <div className="mb-2"><span className="font-semibold">Role:</span> {user.role}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default ProfileCard;
