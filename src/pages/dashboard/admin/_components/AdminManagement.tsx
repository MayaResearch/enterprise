import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  
  // Confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'admin' | 'permission' | null;
    user: User | null;
  }>({
    open: false,
    type: null,
    user: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const url = forceRefresh ? '/api/admin/users?refresh=true' : '/api/admin/users';
      const response = await fetch(url);
      
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
      setIsRefreshing(false);
    }
  };

  const handleHardRefresh = (): void => {
    fetchUsers(true);
  };

  const openConfirmDialog = (type: 'admin' | 'permission', user: User): void => {
    setConfirmDialog({
      open: true,
      type,
      user,
    });
  };

  const closeConfirmDialog = (): void => {
    setConfirmDialog({
      open: false,
      type: null,
      user: null,
    });
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
        // Fetch fresh data from database to ensure consistency
        await fetchUsers(true);
      } else {
        alert('Failed to update permission');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      alert('Failed to update permission');
    } finally {
      setUpdatingUserId(null);
      closeConfirmDialog();
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdmin: boolean): Promise<void> => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAdmin: !currentAdmin,
        }),
      });

      if (response.ok) {
        // Fetch fresh data from database to ensure consistency
        await fetchUsers(true);
      } else {
        alert('Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
    } finally {
      setUpdatingUserId(null);
      closeConfirmDialog();
    }
  };

  const handleConfirm = (): void => {
    if (!confirmDialog.user) return;

    if (confirmDialog.type === 'admin') {
      handleToggleAdmin(confirmDialog.user.id, confirmDialog.user.isAdmin);
    } else if (confirmDialog.type === 'permission') {
      handleTogglePermission(confirmDialog.user.id, confirmDialog.user.permissionGranted);
    }
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Header Skeleton */}
          <header className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
          </header>

          <main className="flex flex-col">
            <section className="mt-7">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors">
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9 pl-0">
                        <Skeleton className="h-3 w-16" />
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                        <Skeleton className="h-3 w-20" />
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                        <Skeleton className="h-3 w-14" />
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9">
                        <Skeleton className="h-3 w-16" />
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground h-9 pr-0">
                        <Skeleton className="h-3 w-32" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                        <td className="px-2 align-middle py-4 pl-0">
                          <Skeleton className="h-4 w-48" />
                        </td>
                        <td className="px-2 align-middle py-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-2 align-middle py-4">
                          <Skeleton className="h-6 w-11 rounded-full" />
                        </td>
                        <td className="px-2 align-middle py-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-2 align-middle py-4 pr-0">
                          <Skeleton className="h-6 w-11 rounded-full" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen w-full px-4 py-8">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl text-foreground font-semibold mb-2">
                Admin Management
              </h1>
              <p className="text-sm text-subtle font-medium">
                Manage user permissions and platform access
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleHardRefresh}
                disabled={isRefreshing}
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 text-foreground shadow-none disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 h-10 px-4 rounded-full gap-2"
              >
                {isRefreshing ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    height={16}
                    width={16}
                    className="animate-spin"
                  >
                    <path d="M146.498 47C146.498 56.9411 138.439 65 128.498 65C118.557 65 110.498 56.9411 110.498 47C110.498 37.0589 118.557 29 128.498 29C138.439 29 146.498 37.0589 146.498 47Z" />
                    <path d="M203.831 91.9468C196.059 98.145 184.734 96.8689 178.535 89.0967C172.337 81.3244 173.613 69.9991 181.386 63.8009C189.158 57.6027 200.483 58.8787 206.681 66.651C212.88 74.4233 211.603 85.7486 203.831 91.9468Z" />
                    <path d="M204.437 164.795C194.745 162.583 188.681 152.933 190.894 143.241C193.106 133.549 202.756 127.486 212.448 129.698C222.14 131.91 228.203 141.56 225.991 151.252C223.779 160.944 214.129 167.008 204.437 164.795Z" />
                    <path d="M147.859 210.689C143.546 201.733 147.31 190.975 156.267 186.662C165.223 182.349 175.981 186.113 180.294 195.07C184.607 204.026 180.843 214.784 171.887 219.097C162.93 223.41 152.172 219.646 147.859 210.689Z" />
                    <path d="M76.7023 195.07C81.0156 186.113 91.773 182.349 100.73 186.662C109.686 190.975 113.45 201.733 109.137 210.689C104.824 219.646 94.0665 223.41 85.1098 219.097C76.1532 214.784 72.389 204.026 76.7023 195.07Z" />
                    <path d="M44.5487 129.698C54.2406 127.486 63.8907 133.549 66.1028 143.241C68.3149 152.933 62.2514 162.583 52.5595 164.795C42.8676 167.008 33.2175 160.944 31.0054 151.252C28.7933 141.56 34.8568 131.91 44.5487 129.698Z" />
                    <path d="M75.6108 63.8009C83.3831 69.9991 84.6592 81.3244 78.461 89.0967C72.2628 96.8689 60.9375 98.145 53.1652 91.9468C45.3929 85.7486 44.1168 74.4233 50.315 66.651C56.5132 58.8787 67.8385 57.6027 75.6108 63.8009Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                )}
                {isRefreshing ? 'Refreshing...' : 'Hard Refresh'}
              </button>
            </div>
          </div>
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
                        <Switch
                          checked={user.isAdmin}
                          onCheckedChange={() => openConfirmDialog('admin', user)}
                          disabled={updatingUserId === user.id}
                          aria-label="Toggle admin"
                        />
                      </td>
                      <td className="px-2 align-middle py-4">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </p>
                      </td>
                      <td className="px-2 align-middle py-4 pr-0">
                        <Switch
                          checked={user.permissionGranted}
                          onCheckedChange={() => openConfirmDialog('permission', user)}
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

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onOpenChange={closeConfirmDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {confirmDialog.type === 'admin' ? 'Update Admin Status' : 'Update Permission'}
              </DialogTitle>
              <DialogDescription>
                {confirmDialog.type === 'admin' ? (
                  <>
                    Are you sure you want to {confirmDialog.user?.isAdmin ? 'remove admin access from' : 'grant admin access to'}{' '}
                    <span className="font-medium text-foreground">{confirmDialog.user?.email}</span>?
                    {!confirmDialog.user?.isAdmin && (
                      <span className="block mt-2 text-sm text-amber-600">
                        This will give the user full administrative privileges.
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    Are you sure you want to {confirmDialog.user?.permissionGranted ? 'revoke platform access from' : 'grant platform access to'}{' '}
                    <span className="font-medium text-foreground">{confirmDialog.user?.email}</span>?
                    {!confirmDialog.user?.permissionGranted && (
                      <span className="block mt-2 text-sm text-green-600">
                        This will allow the user to create API keys and generate speech.
                      </span>
                    )}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-2">
              <button
                type="button"
                onClick={closeConfirmDialog}
                disabled={updatingUserId === confirmDialog.user?.id}
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 text-foreground shadow-none disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 h-10 px-4 rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={updatingUserId === confirmDialog.user?.id}
                className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-foreground hover:bg-gray-800 active:bg-gray-900 text-background disabled:bg-gray-200 disabled:text-gray-400 h-10 px-4 rounded-full"
              >
                {updatingUserId === confirmDialog.user?.id ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    height={16}
                    width={16}
                    className="animate-spin absolute"
                  >
                    <path d="M146.498 47C146.498 56.9411 138.439 65 128.498 65C118.557 65 110.498 56.9411 110.498 47C110.498 37.0589 118.557 29 128.498 29C138.439 29 146.498 37.0589 146.498 47Z" />
                    <path d="M203.831 91.9468C196.059 98.145 184.734 96.8689 178.535 89.0967C172.337 81.3244 173.613 69.9991 181.386 63.8009C189.158 57.6027 200.483 58.8787 206.681 66.651C212.88 74.4233 211.603 85.7486 203.831 91.9468Z" />
                    <path d="M204.437 164.795C194.745 162.583 188.681 152.933 190.894 143.241C193.106 133.549 202.756 127.486 212.448 129.698C222.14 131.91 228.203 141.56 225.991 151.252C223.779 160.944 214.129 167.008 204.437 164.795Z" />
                    <path d="M147.859 210.689C143.546 201.733 147.31 190.975 156.267 186.662C165.223 182.349 175.981 186.113 180.294 195.07C184.607 204.026 180.843 214.784 171.887 219.097C162.93 223.41 152.172 219.646 147.859 210.689Z" />
                    <path d="M76.7023 195.07C81.0156 186.113 91.773 182.349 100.73 186.662C109.686 190.975 113.45 201.733 109.137 210.689C104.824 219.646 94.0665 223.41 85.1098 219.097C76.1532 214.784 72.389 204.026 76.7023 195.07Z" />
                    <path d="M44.5487 129.698C54.2406 127.486 63.8907 133.549 66.1028 143.241C68.3149 152.933 62.2514 162.583 52.5595 164.795C42.8676 167.008 33.2175 160.944 31.0054 151.252C28.7933 141.56 34.8568 131.91 44.5487 129.698Z" />
                    <path d="M75.6108 63.8009C83.3831 69.9991 84.6592 81.3244 78.461 89.0967C72.2628 96.8689 60.9375 98.145 53.1652 91.9468C45.3929 85.7486 44.1168 74.4233 50.315 66.651C56.5132 58.8787 67.8385 57.6027 75.6108 63.8009Z" />
                  </svg>
                ) : null}
                <span className={updatingUserId === confirmDialog.user?.id ? 'invisible' : ''}>
                  Confirm
                </span>
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminManagement;

