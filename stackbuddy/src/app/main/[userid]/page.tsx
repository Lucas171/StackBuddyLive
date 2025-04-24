'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'
import { auth } from '@/lib/firebase'
import SHA256 from 'crypto-js/sha256'
import StackBuddyLoader from '@/components/stackBuddyLoader'

export default function MainPage() {
  const router = useRouter()
  const { userid } = useParams()
  const [loading, setLoading] = useState(true)
  const [hasUsedBefore, setHasUsedBefore] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/') // 🚫 Not signed in — go home
        return
      }

      if (user.uid !== userid) {
        router.push('/') // 🚫 UID mismatch — go home
        return
      }

      // ✅ UID matches — now check historical usage
      const emailHash = SHA256((user.email ?? '').trim().toLowerCase()).toString()
      const db = getDatabase()
      const historyRef = ref(db, `historicalAnalyses/${emailHash}`)
      const snapshot = await get(historyRef)

      if (snapshot.exists()) {
        console.log('🧠 User has used analysis before.')
        setHasUsedBefore(true)
      } else {
        console.log('📭 No prior analysis found.')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, userid])

    if (loading) return <StackBuddyLoader />

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Welcome, {userid}</h2>
      {hasUsedBefore && (
        <p className="text-sm text-gray-500 mt-2">
          You've used StackBuddy before – welcome back!
        </p>
      )}
    </div>
  )
}
