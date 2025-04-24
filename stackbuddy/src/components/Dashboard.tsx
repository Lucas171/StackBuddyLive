'use client'

interface DashboardProps {
  uid: string
  analysisId: string
}

export default function Dashboard({ uid, analysisId }: DashboardProps) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600">User ID: {uid}</p>
      <p className="text-gray-600">Analysis ID: {analysisId}</p>

      {/* Add your dashboard logic here */}
    </div>
  )
}
