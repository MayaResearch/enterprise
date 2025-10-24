import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface User {
  id: string;
  email: string;
  fullName?: string;
  isAdmin: boolean;
  permissionGranted: boolean;
  createdAt: string | Date;
}

const AdminManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = async (userId: string, currentPermission: boolean): Promise<void> => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissionGranted: !currentPermission,
        }),
      });

      if (response.ok) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, permissionGranted: !currentPermission } : user
          )
        );
      } else {
        console.error('Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Header Skeleton */}
          <div className="mb-6 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-2 text-left"><Skeleton className="h-4 w-32" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-24" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-20" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-24" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-20" /></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2"><Skeleton className="h-4 w-48" /></td>
                    <td className="p-2"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-2"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-2"><Skeleton className="h-6 w-11 rounded-full" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen w-full px-4 py-8">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl text-foreground font-semibold mb-2">
            Admin Management
          </h1>
          <p className="text-sm text-subtle font-medium">
            Manage user permissions and platform access
          </p>
        </header>

        <main className="flex flex-col">
          <section className="mt-7">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors">
                    <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9 pl-0">
                      <p className="text-xs text-subtle font-normal uppercase">
                        Email
                      </p>
                    </th>
                    <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                      <p className="text-xs text-subtle font-normal uppercase">
                        Full Name
                      </p>
                    </th>
                    <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                      <p className="text-xs text-subtle font-normal uppercase">
                        Admin
                      </p>
                    </th>
                    <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                      <p className="text-xs text-subtle font-normal uppercase">
                        Created
                      </p>
                    </th>
                    <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9 pr-0">
                      <p className="text-xs text-subtle font-normal uppercase">
                        Permission Granted
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="px-2 align-middle py-4 pl-0">
                        <p className="text-sm font-medium">{user.email}</p>
                      </td>
                      <td className="px-2 align-middle py-4">
                        <p className="text-sm text-muted-foreground">
                          {user.fullName || '-'}
                        </p>
                      </td>
                      <td className="px-2 align-middle py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-2 align-middle py-4">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                      <td className="px-2 align-middle py-4 pr-0">
                        <Switch
                          checked={user.permissionGranted}
                          onCheckedChange={() => handleTogglePermission(user.id, user.permissionGranted)}
                          disabled={updatingUserId === user.id}
                          aria-label="Toggle permission"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminManagement;

