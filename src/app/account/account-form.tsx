'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const router = useRouter()

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(/images/accountdetails.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      padding: 3,
    }}
  >
    <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 5, borderRadius: 2,  }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Typography variant="h4" sx={{ color: 'orange', textAlign: 'center' }}>
            Account Details
          </Typography>

          <Box>
            <label htmlFor="email">Email:</label>
            <TextField
              id="email"
              type="text"
              value={user?.email || ''}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              disabled
            />
          </Box>

          <Box>
            <label htmlFor="fullName">Full Name:</label>
            <TextField
              id="fullName"
              type="text"
              value={fullname || ''}
              onChange={(e) => setFullname(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>

          <Box>
            <label htmlFor="username">Username:</label>
            <TextField
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>

          <Box>
            <label htmlFor="website">Website:</label>
            <TextField
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Box>

          <Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => updateProfile({ fullname, username, website, avatar_url: null })}
              disabled={loading}
              fullWidth>
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </Box>

          <Box>
            <Button
              variant="outlined"
              color="success"
              onClick={() => router.push('/products')}
              fullWidth>
                GO TO DASHBOARD
            </Button>
          </Box>

          <Box>
            <form action="/auth/signout" method="post">
              <Button variant="outlined" color="secondary" type="submit" fullWidth>
                Sign out
              </Button>
            </form>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
  )
}