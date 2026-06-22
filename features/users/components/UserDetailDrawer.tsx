'use client';

import { useEffect, useState } from 'react';
import { fetchUserDetail } from '../api';
import type { UserProfile, UserCourseEnrollment, UserProductPurchase } from '@/types/users';

interface Props {
  user: UserProfile | null;
  onClose: () => void;
}

export default function UserDetailDrawer({ user, onClose }: Props) {
  const [enrollments, setEnrollments] = useState<UserCourseEnrollment[]>([]);
  const [purchases, setPurchases] = useState<UserProductPurchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    fetchUserDetail(user.id)
        .then(({ enrollments, purchases }) => {
        setEnrollments(enrollments);
        setPurchases(purchases);
        })
        .catch(() => {
        // handle error silently
        })
        .finally(() => {
        setLoading(false);
        });
    }, [user]);

  if (!user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
              {user.full_name?.[0] ?? user.email?.[0] ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.full_name ?? 'No name'}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mt-1 inline-block capitalize">
                {user.role}
              </span>
            </div>
          </div>

          {/* Login Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Login Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Joined</span>
                <span className="text-gray-800">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login</span>
                <span className="text-gray-800">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User ID</span>
                <span className="text-gray-400 text-xs font-mono truncate max-w-[200px]">
                  {user.id}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Courses */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  Courses Purchased ({enrollments.length})
                </h3>
                {enrollments.length === 0 ? (
                  <p className="text-sm text-gray-400">No courses purchased.</p>
                ) : (
                  <div className="space-y-2">
                    {enrollments.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded bg-blue-200 flex items-center justify-center text-blue-700 text-xs">
                          📚
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {e.course?.title ?? 'Unknown Course'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(e.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  Products Purchased ({purchases.length})
                </h3>
                {purchases.length === 0 ? (
                  <p className="text-sm text-gray-400">No products purchased.</p>
                ) : (
                  <div className="space-y-2">
                    {purchases.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded bg-green-200 flex items-center justify-center text-green-700 text-xs">
                          📦
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            {p.product?.name ?? 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(p.purchased_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-green-700">
                          ${p.product?.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}