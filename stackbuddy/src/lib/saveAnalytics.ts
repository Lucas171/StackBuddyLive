import { getDatabase, ref, push } from 'firebase/database'

export const saveAnalysis = async (userId: string, result: any) => {
  const db = getDatabase()
  const userAnalysesRef = ref(db, `users/${userId}/analyses`)

  

  await push(userAnalysesRef, {
    createdAt: Date.now(),
    suggestions: result.suggestions,
    filesScanned: result.filesScanned,
    score: result.score,
    fileHash: result.fileHash || null,
    name: result.name || 'Untitled Project',
    description: result.description || '',
  })
}
