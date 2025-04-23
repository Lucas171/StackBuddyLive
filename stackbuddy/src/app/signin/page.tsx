'use client'

import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import StackBuddyLoader from '@/components/stackBuddyLoader'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true) // ⏳ Wait for auth check

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push(`/main/${user.uid}`)
      } else {
        setLoading(false) // ✅ show form only if no user
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const token = await user.getIdToken()
      document.cookie = `__session=${token}; path=/`

      router.push(`/main/${user.uid}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <StackBuddyLoader />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md p-6 rounded w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Sign In to StackBuddy</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push('/signup')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
