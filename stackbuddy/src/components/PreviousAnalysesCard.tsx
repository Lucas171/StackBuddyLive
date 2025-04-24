// PreviousAnalysesPanel.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from 'firebase/database'
import SmallAnalysesCard from './SmallAnalysesCard'

interface PreviousAnalysesPanelProps {
    userid: string;
    onSelectAnalysis: (analysis: any) => void;
    selectedId?: string | null;
    setHasAnalyses: (val: boolean) => void; 
  }
  

export default function PreviousAnalysesPanel({ userid, onSelectAnalysis, selectedId, setHasAnalyses }: PreviousAnalysesPanelProps) {
  const [analyses, setAnalyses] = useState<{ id: string; [key: string]: any }[]>([])

  useEffect(() => {
    if (!userid) return
    const db = getDatabase()
    const userRef = ref(db, `users/${userid}/analyses`)
    
    const unsubscribe = onValue(userRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const loaded = Object.entries(data).map(([id, value]) => ({
          id,
          ...(typeof value === 'object' && value !== null ? value : {}),
        }))
        setAnalyses(loaded.reverse())
        setHasAnalyses(true)
      } else {
        setAnalyses([])
        setHasAnalyses(false)
      }
    })

    return () => unsubscribe()
  }, [userid])

  return (
    <div className="space-y-3">
      {analyses.length === 0 ? (
        <p className="text-gray-500 text-sm">No previous analyses yet.</p>
      ) : (
        analyses.map((analysis) => (
          <SmallAnalysesCard
            key={analysis.id}
            analysis={{
              name: analysis.name || '',
              description: analysis.description || '',
              score: analysis.score || 0,
              createdAt: analysis.createdAt || "No date"
            }}
            selected={selectedId === analysis.id}
            onClick={() => onSelectAnalysis(analysis)}
          />
        ))
      )}
    </div>
  )
}
