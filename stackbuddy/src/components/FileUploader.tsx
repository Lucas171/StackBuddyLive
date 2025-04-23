'use client'

import { useState } from 'react'
// import { saveAnalysis } from '@/lib/saveAnalytics'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function FileUploader({ onComplete }: { onComplete?: (data: any) => void }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    const user = auth.currentUser
    if (!user) {
      console.error('No user is currently authenticated.')
      setLoading(false)
      return
    }

    try {
      const token = await user.getIdToken()

      const res = await fetch('https://stackbuddy-analyzer-production.up.railway.app/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      
      
      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.duplicate) {
          console.warn('Duplicate upload:', errorData.message)
          console.warn('Duplicate upload:', errorData.existingId)
          router.push(`/dashboard/${errorData.existingId}`);
        } else {
          console.error('Other error:', errorData.message)
        }
      } 
      
      // else {
      //   const data = await res.json()
      //   await saveAnalysis(user.uid, data)
      //   onComplete?.(data)
      // }
      
      
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded shadow max-w-md space-y-3">
      <input type="file" accept=".zip" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!file || loading}
      >
        {loading ? 'Analyzing...' : 'Upload ZIP'}
      </button>
    </div>
  )
}
