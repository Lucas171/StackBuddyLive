'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '@/components/layout/Navbar'
import StackBuddyLoader from '@/components/stackBuddyLoader'

export default function Home() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        router.push(`/main/${user.uid}`)
      } else {
        setCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (checkingAuth) return <StackBuddyLoader />

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center px-6 py-12">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Build Smarter with <span className="text-blue-600">StackBuddy</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Instantly analyze your codebase, detect your stack, and get smart suggestions from your personal AI dev lead.
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/demo')}
              className="bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-100 transition"
            >
              See Demo
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Get Started Free
            </button>
          </div>
        </div>

        <div className="mt-16 w-full max-w-5xl border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          1 free analysis. No credit card required.
        </div>
      </main>
    </main>
  )
}
