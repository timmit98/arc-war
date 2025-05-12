'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../utils/supabase/client'

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Error fetching user:', userError)
          setError(`Error fetching user: ${userError.message}`)
          return
        }

        if (!user) {
          setError('No user found')
          return
        }

        const response = await fetch(`/api/users/${user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user profile')
        }
        const profile = await response.json()

        if (profile) {
          setDisplayName(profile.displayname || '')
          setProfileImageUrl(profile.profileimageurl || '')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleProfileUpdate = async () => {
    try {
      const supabase = await createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('User not found')
        return
      }

      let profileImageUrl
      if (profileImage) {
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(`public/${user.id}.jpg`, profileImage, {
            upsert: true,
          })

        if (error) {
          console.error(error)
          return
        }

        profileImageUrl = supabase.storage
          .from('avatars')
          .getPublicUrl(`public/${user.id}.jpg`).data.publicUrl
      }

      // Update user profile through your API
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayname: displayName,
          profileimageurl: profileImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(`Error updating profile: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handlePasswordChange = async (newPassword: string) => {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) console.error(error)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className='bg-storm-grey-dark flex flex-col lg:flex-row'>
        <div className='bg-storm-grey-dark h-screen flex flex-col w-full lg:w-[40%] justify-center items-center space-y-5 m-t-[30%]'>
        <h2 className='text-text-light text-2xl font-bold'>Edit Profile</h2>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-lightblue mb-4">
          <img
            src={profileImageUrl || '/default-avatar.jpg'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className='text-text-light text-l'>Display Name</p>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className='block text-text-light rounded-md p-2 border-2'
        />
        </div>
        <div>
          <p className='text-text-light text-l'>Profile Image</p>
          <input
              type="file"
              onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
              className='text-text-light rounded-md p-2 border-2 file:bg-darkblue file:rounded-md file:text-text-light hover:cursor-pointer hover:file:cursor-pointer'
          />
        </div>
        <button className='bg-lightblue text-text-light rounded-md p-2 flex items-center justify-center' onClick={handleProfileUpdate}>Save Profile</button>
        </div>
        <div className='relative min-h-screen md:w-[65%]'>
            <img
            src="/background.png"
            alt="Background image"
            className="absolute inset-0 w-full h-full object-cover"
            />
        </div>
    </div>
  )
}
