'use client'

import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { getDatabase, ref, set, get, update } from 'firebase/database'
import StackBuddyLoader from '@/components/stackBuddyLoader'
import sha256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        router.push(`/main/${user.uid}`)
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const db = getDatabase()

      const emailHash = sha256(email.trim().toLowerCase()).toString(encHex)
      const trackerRef = ref(db, `emailTracker/${emailHash}`)
      const snapshot = await get(trackerRef)

      if (snapshot.exists()) {
        await update(trackerRef, {
          totalSignups: (snapshot.val().totalSignups || 1) + 1,
          lastSeen: Date.now(),
        })
      } else {
        await set(trackerRef, {
          emailHash,
          firstSeen: Date.now(),
          totalSignups: 1,
          analysesUsed: 0
        })
      }

      const token = await user.getIdToken()
      document.cookie = `__session=${token}; path=/`

      await set(ref(db, 'users/' + user.uid), {
        name: user.email,
        analyses: [],
        plan: 1
      })

      router.push(`/main/${user.uid}`)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <StackBuddyLoader />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 overflow-y-scroll scrollbar-hide">
      <div className="bg-white shadow-md p-6 rounded w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">Create an Account</h2>

        <input
          className="border px-3 py-2 w-full rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border px-3 py-2 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/signin')}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
