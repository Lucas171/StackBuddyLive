'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import StackBuddyLoader from '@/components/stackBuddyLoader'
import { checkActiveUser } from '@/lib/checkActiveUser'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(auth.currentUser)
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (!currentUser) {
        router.push('/signin')
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleChangePassword = async () => {
    await checkActiveUser().catch(() => router.push('/signin?message=auth-expired'))

    if (!user || !currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email || '', currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setSuccess('Password updated successfully.')
      setError('')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.message)
      setSuccess('')
    }
  }

  const handleDeleteAccount = async () => {
    await checkActiveUser().catch(() => router.push('/signin'))
    if (!user) return
    try {
      await deleteUser(user)
      router.push('/signin')
    } catch (err: any) {
      setError('Account deletion failed. Try reauthenticating.')
    }
  }

  if (loading) return <StackBuddyLoader />

  return (
    <div className="relative min-h-screen overflow-x-hidden max-w-xl mx-auto px-4 py-8 pb-32">
      <div className="max-w-xl mx-auto px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Password Change */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Change Password</h2>
          <input
            type="password"
            placeholder="Current password"
            className="border w-full p-2 rounded mb-2"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="border w-full p-2 rounded mb-2"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="border w-full p-2 rounded mb-4"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleChangePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>

        {/* Account Deletion */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Delete Account</h2>
          {confirmDelete ? (
            <div className="space-y-3">
              <p className="text-red-600">Are you sure? This action cannot be undone.</p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-gray-500 underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
            >
              Delete My Account
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </div>

      <Footer />
    </div>
  )
}
