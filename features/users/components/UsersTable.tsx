'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/users';

interface Props {
  onSelectUser: (user: UserProfile) => void;
}

export default function UsersTable({ onSelectUser }: Props) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers(data ?? []);
        setLoading(false);
      });

    // Realtime subscription
    const channel = supabase
      .channel('realtime-users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUsers((prev) => [payload.new as UserProfile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === (payload.new as UserProfile).id
                  ? (payload.new as UserProfile)
                  : u
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setUsers((prev) =>
              prev.filter((u) => u.id !== (payload.old as UserProfile).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-6 py-3 text-left">User</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Joined</th>
            <th className="px-6 py-3 text-left">Last Login</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {user.full_name?.[0] ?? user.email?.[0] ?? '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {user.full_name ?? 'No name'}
                    </p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString()
                  : 'Never'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectUser(user)}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-center text-gray-400 py-12">No users found.</p>
      )}
    </div>
  );
}