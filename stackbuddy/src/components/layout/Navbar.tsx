'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()

  const isDashboard = pathname?.startsWith('/dashboard')  || pathname?.startsWith('/main')
  const isSettings = pathname?.startsWith('/settings')
  const isSignIn = pathname?.startsWith('/signin')

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/signin')
  }

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <span
        className="flex items-center space-x-2 text-xl font-semibold text-gray-800 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <img
          src="/logo2.png"
          alt="StackBuddy logo"
          className="h-8 w-8 mr-2"
        />
        StackBuddy
      </span>

      <div className="space-x-4">
  {isDashboard || isSettings ? (
    <>
      {!isSettings && (
        <button
          onClick={() => router.push('/settings')}
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          Settings
        </button>
      )}
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-600 transition"
      >
        Log Out
      </button>
    </>
  ) : isSignIn ? (
    <button
      onClick={() => router.push('/signup')}
      className="text-sm text-gray-500 hover:text-gray-800 transition"
    >
      Sign Up
    </button>
  ) : (
    <button
      onClick={() => router.push('/signin')}
      className="text-sm text-gray-500 hover:text-gray-800 transition"
    >
      Log In
    </button>
  )}
</div>
    </nav>
  )
}
