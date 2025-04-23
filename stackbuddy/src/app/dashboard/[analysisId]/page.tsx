'use client'

import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
export default function DashboardAnalysisPage() {
  const { analysisId } = useParams()

  return (
    <>
    {/* <Navbar/> */}
    <div className="p-6">
      <h1 className="text-2xl font-bold">Analysis ID: {analysisId}</h1>
      {/* You can now use analysisId to fetch and display data */}
    </div>
    </>
    
  )
}
