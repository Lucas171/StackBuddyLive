import React from 'react'

export default function SmallAnalysesCard() {
  return (
    <div>
         <p className="font-medium">{analysis.name || 'Untitled Project'}</p>
         <p className="text-xs text-gray-500">
                {new Date(analysis.createdAt).toLocaleString()}
              </p>
          
        
          
        
    </div>
   
  )
}
