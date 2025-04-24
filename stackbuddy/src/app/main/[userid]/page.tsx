'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'
import { auth } from '@/lib/firebase'
import SHA256 from 'crypto-js/sha256'
import StackBuddyLoader from '@/components/stackBuddyLoader'
import PreviousAnalysesCard from '@/components/PreviousAnalysesCard'
import FileUploader from '@/components/FileUploader'
import Dashboard from '@/components/Dashboard'

export default function MainPage() {
  const router = useRouter()
  const { userid } = useParams()
  const [loading, setLoading] = useState(true)
  const [hasUsedBefore, setHasUsedBefore] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hasAnalyses, setHasAnalyses] = useState(false)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return router.push('/')
      if (user.uid !== userid) return router.push('/')

      const emailHash = SHA256((user.email ?? '').trim().toLowerCase()).toString()
      const db = getDatabase()
      const snapshot = await get(ref(db, `historicalAnalyses/${emailHash}`))

      if (snapshot.exists()) setHasUsedBefore(true)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, userid])

  if (loading) return <StackBuddyLoader />

  return (
    <div className="flex flex-row p-6 min-h-screen gap-6">
      {/* Left Side */}
      <div className="w-2/3 flex items-center justify-center">
        {selectedId ? (
          <Dashboard uid={userid as string} analysisId={selectedId} />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center space-y-6 text-center">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Upload A File To Analyze
            </h1>
            <FileUploader />
          </div>

        )}
      </div>


      {/* Right Side: Previous Analyses */}
      <div className="w-1/3 border border-gray-200 rounded-lg p-4 h-fit bg-white shadow-sm flex flex-col justify-between">
        <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-md font-semibold">Previous Analyses</h3>
          {hasAnalyses && (
  <div className="relative group">
    <p className="text-xs text-gray-400 cursor-pointer">How is score calculated?</p>
    <div className="absolute right-0 top-5 z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg w-60">
      Your score starts at 100. We subtract:<br />
      • 5 points for each <strong>Critical</strong> issue<br />
      • 3 for each <strong>Suggestion</strong><br />
      • 1 for each <strong>Minor</strong> note<br />
      The fewer the issues, the higher your score!
    </div>
  </div>
)}

        </div>

          {userid && (
            <PreviousAnalysesCard
            userid={userid as string}
            selectedId={selectedId}
            setHasAnalyses={setHasAnalyses} // 👈
            onSelectAnalysis={(analysis) => setSelectedId(analysis.id)}
          />
          )}
        </div>

        {selectedId && (
          <button
            onClick={() => setSelectedId(null)}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            New Analysis
          </button>
        )}
      </div>
    </div>
  )
}
