'use client'

import { useState } from 'react'
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (errorData.duplicate) {
          // router.push(`/dashboard/${errorData.existingId}`)
          console.log('duplicate')
        } else {
          console.error('Upload error:', errorData.message)
        }
      } else {
        // const data = await res.json()
        // await saveAnalysis(user.uid, data)
        // onComplete?.(data)
      }

    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-lg max-w-2xl w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 py-12 cursor-pointer text-center hover:border-blue-500 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const droppedFile = e.dataTransfer.files?.[0]
          if (droppedFile && droppedFile.name.endsWith('.zip') || droppedFile && droppedFile.type === 'application/zip') {
            setFile(droppedFile)
          } else {
            console.warn('Only ZIP files are supported')
          }
        }}
      >
        <input
          id="file-upload"
          type="file"
          accept=".zip"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        <svg
          className="w-12 h-12 text-blue-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16v-4m0 0V8m0 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H9.414a2 2 0 00-1.414.586l-4.586 4.586A2 2 0 003 10.586V18a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-medium">Drag & drop your code ZIP or click to upload</p>
        <p className="text-sm text-gray-400 mt-1">Only .zip files are accepted</p>
        {file && (
          <p className="text-sm text-green-600 mt-3 font-semibold">{file.name}</p>
        )}
      </label>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-6 w-full py-3 text-white font-bold rounded-lg transition bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
      >
        {loading ? 'Analyzing...' : 'Analyze Codebase'}
      </button>

      {loading && (
        <div className="w-full h-1 bg-gray-200 mt-4 rounded overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress" style={{ width: '100%' }} />
        </div>
      )}

    </div>
  )
}
