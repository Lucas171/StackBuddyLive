'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <img
        src="/logo2.png"
        alt="StackBuddy logo"
        className="h-20 w-20 mb-6"
      />
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        StackBuddy doesn’t know that page.
      </p>
      <button
        onClick={() => router.push('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </button>
    </div>
  )
}
