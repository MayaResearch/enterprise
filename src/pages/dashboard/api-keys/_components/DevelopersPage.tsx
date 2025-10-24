import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApiKey {
  id: string;
  label: string;
  key?: string; // Full key only shown once during creation
  keyPreview: string;
  keyHash: string;
  rateLimit?: number;
  credits?: string;
  createdAt: Date | string;
  lastUsedAt?: Date | string;
  expiresAt?: Date | string;
  isActive: boolean;
}

interface ToggleConfirmation {
  keyId: string;
  keyLabel: string;
  newState: boolean;
}

const DevelopersPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggleDialogOpen, setToggleDialogOpen] = useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [pendingToggle, setPendingToggle] = useState<ToggleConfirmation | null>(null);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState<boolean>(false);

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/keys');
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      } else {
        console.error('Failed to fetch API keys');
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = (): void => {
    setCreateDialogOpen(true);
  };

  const handleConfirmCreate = async (): Promise<void> => {
    if (!newKeyName.trim()) return;

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: newKeyName.trim() }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setCreatedKey(newKey.key); // Save the full key to show once
        setApiKeys(prevKeys => [...prevKeys, newKey]);
        setShowKeyDialog(true); // Show the key in a dialog
      } else {
        console.error('Failed to create API key');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    }
    
    setCreateDialogOpen(false);
    setNewKeyName('');
  };

  const handleCancelCreate = (): void => {
    setCreateDialogOpen(false);
    setNewKeyName('');
  };

  const handleToggleRequest = (keyId: string, keyLabel: string, checked: boolean): void => {
    setPendingToggle({ keyId, keyLabel, newState: checked });
    setToggleDialogOpen(true);
  };

  const handleConfirmToggle = async (): Promise<void> => {
    if (!pendingToggle) return;

    try {
      const response = await fetch(`/api/keys/${pendingToggle.keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: pendingToggle.newState }),
      });

      if (response.ok) {
        setApiKeys(prevKeys => 
          prevKeys.map(key => 
            key.id === pendingToggle.keyId ? { ...key, isActive: pendingToggle.newState } : key
          )
        );
      } else {
        console.error('Failed to toggle API key');
      }
    } catch (error) {
      console.error('Error toggling API key:', error);
    }

    setToggleDialogOpen(false);
    setPendingToggle(null);
  };

  const handleCancelToggle = (): void => {
    setToggleDialogOpen(false);
    setPendingToggle(null);
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Header Skeleton */}
          <div className="mb-6 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-3 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
            <div className="ml-auto">
              <Skeleton className="h-10 w-36" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-2 text-left"><Skeleton className="h-4 w-20" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-16" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-24" /></th>
                  <th className="p-2 text-left"><Skeleton className="h-4 w-20" /></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-2">
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no keys
  if (apiKeys.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={64}
            height={64}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-6 text-gray-400"
          >
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="m21 2-9.6 9.6" />
            <path d="m15.5 7.5 3 3L22 7l-3-3" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#262626' }}>
            No API Keys Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Create your first API key to start using the Maya API
          </p>
          <button
            type="button"
            onClick={handleCreateKey}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 text-white h-10 px-6 rounded-full"
            style={{ backgroundColor: '#262626' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Create API Key
          </button>
          
          {/* Create Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
                  Create API Key
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Enter a name for your new API key. This will help you identify it later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="key-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    API Key Name
                  </label>
                  <Input
                    id="key-name"
                    type="text"
                    placeholder="e.g., Production Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newKeyName.trim()) {
                        handleConfirmCreate();
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                <button
                  onClick={handleCancelCreate}
                  className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 text-foreground h-9 px-3 rounded-full inline-flex"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreate}
                  disabled={!newKeyName.trim()}
                  className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 text-background disabled:bg-gray-400 disabled:text-gray-100 h-9 px-3 rounded-full inline-flex"
                  style={{ backgroundColor: !newKeyName.trim() ? undefined : '#262626' }}
                  onMouseEnter={(e) => !newKeyName.trim() ? null : (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                  onMouseLeave={(e) => !newKeyName.trim() ? null : (e.currentTarget.style.backgroundColor = '#262626')}
                >
                  Create
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Show newly created key */}
          <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
            <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
                  API Key Created
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Please save this key securely. You won't be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
                  {createdKey}
                </div>
                <button
                  onClick={() => createdKey && copyToClipboard(createdKey)}
                  className="w-full inline-flex items-center justify-center h-9 px-3 rounded-full border border-gray-200 hover:bg-gray-50 text-sm font-medium"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowKeyDialog(false);
                    setCreatedKey(null);
                  }}
                  className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 text-white h-9 px-3 rounded-full inline-flex"
                  style={{ backgroundColor: '#262626' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
                >
                  Done
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Show table with API keys
  return (
    <div className="flex justify-center items-center min-h-screen w-full px-4 py-8">
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between gap-4 border-b pb-4 mb-8">
          <div>
            <h1
              data-testid="page-title"
              className="text-2xl text-foreground font-semibold"
            >
              API Keys
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              target="_blank"
              className="chakra-link css-spn4bz"
              href="https://elevenlabs.io/pricing/api"
              rel="noopener noreferrer"
            >
              <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 radix-state-open:bg-gray-alpha-50 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 radix-state-open:border-gray-alpha-300 h-7 px-2 rounded-full text-xm">
                API Pricing
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right w-3.5 h-3.5 text-[inherit] opacity-100 -mr-[2px] ml-[4px]"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </button>
            </a>
            <a
              target="_blank"
              className="chakra-link css-spn4bz"
              href="https://elevenlabs.io/docs/introduction"
              rel="noopener noreferrer"
            >
              <button className="relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 radix-state-open:bg-gray-alpha-50 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 radix-state-open:border-gray-alpha-300 h-7 px-2 rounded-full text-xm">
                Documentation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-up-right w-3.5 h-3.5 text-[inherit] opacity-100 -mr-[2px] ml-[4px]"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </button>
            </a>
          </div>
        </header>
        <main className="flex flex-col">
            <section className="flex flex-wrap xs:flex-nowrap justify-between items-end gap-6">
              <p className="text-sm text-subtle font-medium max-w-[600px]">
                An API key lets you connect to our API and use its features. You can
                create multiple keys with different access levels.
              </p>
            <button
              type="button"
              onClick={handleCreateKey}
              data-loading="false"
              className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent text-background shadow-none disabled:bg-gray-400 disabled:text-gray-100 h-10 px-4 rounded-full"
              style={{ backgroundColor: '#262626' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus w-5 h-5 text-[inherit] opacity-100 -ml-[7px] mr-[6px]"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Key
              </button>
            </section>
            <section className="mt-7">
              <div className="relative w-full overflow-auto no-scrollbar overflow-x-scroll">
                <table className="w-full caption-bottom text-sm max-w-full">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-unset">
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-9 lg:w-[43%] pl-0">
                        <p className="text-xs text-subtle font-normal uppercase">
                          Name
                        </p>
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-9 lg:w-[27%]">
                        <p className="text-xs text-subtle font-normal uppercase">
                          Key
                        </p>
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-9 lg:w-[14%]">
                        <p className="text-xs text-subtle font-normal uppercase">
                          Created
                        </p>
                      </th>
                      <th className="px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] h-9 lg:w-[8%]">
                        <p className="text-xs text-subtle font-normal uppercase">
                          Enabled
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {apiKeys.map((apiKey) => (
                      <tr key={apiKey.id} className="transition-colors data-[state=selected]:bg-muted border-b-0 hover:bg-unset">
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] max-w-sm pl-0">
                          <div className="flex items-center gap-2 mr-4 min-w-[20rem]">
                            <div className="min-w-0 flex-shrink">
                              <p className="text-sm text-foreground font-normal truncate">
                                {apiKey.label}
                              </p>
                            </div>
                            <div data-state="closed" className="w-fit">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-info h-4 w-4 text-gray-700"
                              >
                                <circle cx={12} cy={12} r={10} />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <p className="text-sm font-normal font-mono text-gray-alpha-700">
                            <span className="align-text-bottom whitespace-nowrap">
                              •••••••••••••••••••••
                              <span className="inline-block">{apiKey.keyPreview}</span>
                            </span>
                          </p>
                        </td>
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] min-w-[8rem]">
                          <span data-state="closed">{formatDate(apiKey.createdAt)}</span>
                        </td>
                        <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                          <Switch 
                            checked={apiKey.isActive}
                            onCheckedChange={(checked) => handleToggleRequest(apiKey.id, apiKey.label, checked)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
        </main>

        {/* Create API Key Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
              Create API Key
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Enter a name for your new API key. This will help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="key-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                API Key Name
              </label>
              <Input
                id="key-name"
                type="text"
                placeholder="e.g., Production Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newKeyName.trim()) {
                    handleConfirmCreate();
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
            <button
              onClick={handleCancelCreate}
              className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 radix-state-open:bg-gray-alpha-50 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 radix-state-open:border-gray-alpha-300 h-9 px-3 rounded-full inline-flex"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmCreate}
              disabled={!newKeyName.trim()}
              className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent text-background shadow-none disabled:bg-gray-400 disabled:text-gray-100 h-9 px-3 rounded-full inline-flex"
              style={{ backgroundColor: !newKeyName.trim() ? undefined : '#262626' }}
              onMouseEnter={(e) => !newKeyName.trim() ? null : (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => !newKeyName.trim() ? null : (e.currentTarget.style.backgroundColor = '#262626')}
            >
              Create
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Toggle Confirmation Dialog */}
      <Dialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
              {pendingToggle?.newState ? 'Enable' : 'Disable'} API Key
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to {pendingToggle?.newState ? 'enable' : 'disable'} the API key "{pendingToggle?.keyLabel}"? 
              {!pendingToggle?.newState && " It will no longer work until it's enabled again."}
            </DialogDescription>
          </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            onClick={handleCancelToggle}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent bg-background border border-gray-alpha-200 hover:bg-gray-alpha-50 active:bg-gray-alpha-100 radix-state-open:bg-gray-alpha-50 hover:border-gray-alpha-300 text-foreground shadow-none active:border-gray-alpha-300 disabled:bg-background disabled:text-gray-300 disabled:border-gray-alpha-200 radix-state-open:border-gray-alpha-300 h-9 px-3 rounded-full inline-flex"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmToggle}
            className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 focus-ring disabled:pointer-events-auto data-[loading='true']:!text-transparent text-background shadow-none disabled:bg-gray-400 disabled:text-gray-100 h-9 px-3 rounded-full inline-flex"
            style={{ backgroundColor: '#262626' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
          >
            {pendingToggle?.newState ? 'Enable' : 'Disable'}
          </button>
        </div>
        </DialogContent>
      </Dialog>

      {/* Show newly created key */}
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
              API Key Created
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Please save this key securely. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm break-all">
              {createdKey}
            </div>
            <button
              onClick={() => createdKey && copyToClipboard(createdKey)}
              className="w-full inline-flex items-center justify-center h-9 px-3 rounded-full border border-gray-200 hover:bg-gray-50 text-sm font-medium"
            >
              Copy to Clipboard
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowKeyDialog(false);
                setCreatedKey(null);
              }}
              className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 text-white h-9 px-3 rounded-full inline-flex"
              style={{ backgroundColor: '#262626' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default DevelopersPage;

