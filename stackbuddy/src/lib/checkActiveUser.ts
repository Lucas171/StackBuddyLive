import { auth } from '@/lib/firebase'


export const checkActiveUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe()
        if (!user) {
          reject('User signed out')
        } else {
          resolve(user)
        }
      })
    })
  }
  
