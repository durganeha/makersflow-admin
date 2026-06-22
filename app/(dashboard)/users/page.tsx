'use client';

import { useState } from 'react';
import UsersTable from '@/features/users/components/UsersTable';
import UserDetailDrawer from '@/features/users/components/UserDetailDrawer';
import type { UserProfile } from '@/types/users';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your platform users, view their courses and purchases in real time.
        </p>
      </div>

      <UsersTable onSelectUser={setSelectedUser} />

      <UserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}