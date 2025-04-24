'use client'

import clsx from 'clsx'
import { format } from 'date-fns'

interface SmallAnalysesCardProps {
  analysis: {
    id?: string
    name?: string
    description?: string
    score?: number
    createdAt?: number
  }
  onClick: () => void
  selected?: boolean
}

export default function SmallAnalysesCard({ analysis, onClick, selected = false }: SmallAnalysesCardProps) {
  const score = analysis.score ?? 0

  const scoreColor = clsx(
    'text-white font-bold rounded-full w-14 h-14 flex items-center justify-center text-lg',
    {
      'bg-green-500': score >= 80,
      'bg-yellow-400': score >= 50 && score < 80,
      'bg-red-500': score < 50,
    }
  )
  console.log('Created at raw:', analysis)

  return (
    <div
      onClick={onClick}
      className={clsx(
        'flex items-center justify-between p-4 border rounded-lg shadow-sm cursor-pointer transition bg-white hover:shadow-md',
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200'
      )}
    >
      <div className="flex-1 pr-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {analysis.name || 'Untitled Project'}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {analysis.description || 'No description available.'}
        </p>
        {analysis.createdAt && (
          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(analysis.createdAt), 'PPP p')}
          </p>
        )}
      </div>

      <div className={scoreColor}>
        {score}%
      </div>
    </div>
  )
}
