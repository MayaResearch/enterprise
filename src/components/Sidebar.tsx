import React, { useEffect, useState } from 'react'
import { useAuth } from '../lib/hooks/useAuth'
import { supabase } from '../lib/config/supabase'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('')
  const { user } = useAuth()

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const topNavItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/dashboard',
      icon: (
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
          className="lucide lucide-home"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    }
  ]

  const playgroundNavItems: NavItem[] = [
    {
      id: 'text-to-speech',
      label: 'Text to Speech',
      href: '/dashboard/text-to-speech',
      icon: (
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
          className="lucide lucide-volume-2"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )
    }
  ]

  const managementNavItems: NavItem[] = [
    {
      id: 'usage',
      label: 'Usage',
      href: '/dashboard/usage',
      icon: (
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
          className="lucide lucide-bar-chart3"
        >
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      )
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      href: '/dashboard/api-keys',
      icon: (
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
          className="lucide lucide-key"
        >
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="m21 2-9.6 9.6" />
          <path d="m15.5 7.5 3 3L22 7l-3-3" />
        </svg>
      )
    }
  ]

  const renderNavItem = (item: NavItem, isLast: boolean = false): React.ReactNode => {
    const isActive = currentPath === item.href
    
    return (
      <a
        key={item.id}
        href={item.href}
        title={item.label}
        className={`
          flex flex-row items-center gap-1.5 h-8 rounded-lg px-2 
          hover:bg-neutral-200/70 dark:hover:bg-neutral-700 
          text-sm select-none transition-all duration-150
          dark:text-white
          ${isLast ? '' : 'mb-1'}
          ${isActive 
            ? 'bg-neutral-200/70 dark:bg-neutral-700 [font-variation-settings:"wght"_370] [font-weight:370]' 
            : '[font-variation-settings:"wght"_370] [font-weight:370]'
          }
        `}
      >
        <div className="flex grow items-center justify-start gap-1.5">
          <span className="flex items-center flex-shrink-0">
            {item.icon}
          </span>
          <span className="truncate">
            {item.label}
          </span>
        </div>
      </a>
    )
  }

  return (
    <div className="w-54 h-full pb-3 overflow-hidden border-r border-gray-200 px-4" style={{ backgroundColor: '#fdfdfd' }}>
      <div className="flex flex-col h-full">
        {/* logo */}
        <div className="flex flex-col h-16 justify-center">
          <h1 className="text-lg font-bold text-gray-900">
            Maya Research
          </h1>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Home Navigation - with mb-[22px] */}
          <div className="mb-[22px]">
            {topNavItems.map((item) => 
              renderNavItem(item, true)
            )}
          </div>

          {/* Playground Section */}
          <p className='not-italic mb-1 font-medium text-[rgb(141,156,167)] transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto whitespace-nowrap antialiased text-sm'>
            Playground
          </p>
          
          {/* Playground Navigation Items */}
          <div className="mb-[22px]">
            {playgroundNavItems.map((item, index) => 
              renderNavItem(item, index === playgroundNavItems.length - 1)
            )}
          </div>

          {/* Management Section */}
          <p className='not-italic mb-1 font-medium text-[rgb(141,156,167)] transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto whitespace-nowrap antialiased text-sm'>
            Management
          </p>
          
          {/* Management Navigation Items */}
          {managementNavItems.map((item, index) => 
            renderNavItem(item, index === managementNavItems.length - 1)
          )}
        </div>

        {/* Feedback Button above border */}
        <div className="mt-auto pt-2 pb-4">
          <button
            onClick={() => window.open('https://forms.gle/your-feedback-form', '_blank')}
            className="flex flex-row items-center gap-1.5 w-full h-8 rounded-lg px-2 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 text-sm select-none transition-all duration-150 dark:text-white [font-variation-settings:'wght'_370] [font-weight:370]"
          >
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="truncate">Give us feedback</span>
          </button>
        </div>

        {/* User Profile & Logout Button below border */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex flex-row items-center gap-2 w-full h-10 rounded-lg px-2 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 text-sm select-none transition-all duration-150 dark:text-white"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-medium" style={{ backgroundColor: '#262626' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 flex items-center min-w-0">
              <span className="text-sm font-medium truncate w-full" style={{ color: '#262626' }}>
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
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
              className="flex-shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar