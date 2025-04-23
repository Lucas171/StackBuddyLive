'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import StackBuddyLoader from '@/components/stackBuddyLoader'

export default function MainPage() {
  const { userid } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userid) {
      setLoading(false)
    }
  }, [userid])

  if (loading) return <StackBuddyLoader />

  return (
    <div className="p-6">
      <div>{userid}</div>
    </div>
  )
}
