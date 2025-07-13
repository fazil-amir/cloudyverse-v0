import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store/hooks'
import { loginUser } from '@/store/slices/user.slice'
import {
  Container,
  Title,
  Text,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Alert,
  ThemeIcon
} from '@mantine/core'
import { IconInfoCircle, IconCloud } from '@tabler/icons-react'

interface SetupData {
  adminEmail: string
  password: string
  adminName: string
}

function toFolderName(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/g, '') // remove non-allowed chars
    .trim()
    .replace(/ +/g, '-') // spaces to dash
}

const Setup = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [homeDirectoryError, setHomeDirectoryError] = useState<string | null>(null)

  const [setupData, setSetupData] = useState<SetupData>({
    adminEmail: '',
    password: '',
    adminName: ''
  })

  // Auto-generate home directory from admin name
  const homeDirectory = toFolderName(setupData.adminName)

  const updateSetupData = (field: keyof SetupData, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }))
    if (field === 'adminName') setNameError(null)
    if (field === 'adminEmail') setEmailError(null)
    if (field === 'password') setPasswordError(null)
    setHomeDirectoryError(null)
  }

  const validate = () => {
    let valid = true
    // Admin name: required, min 2
    if (!setupData.adminName.trim()) {
      setNameError('Admin name is required')
      valid = false
    } else if (setupData.adminName.trim().length < 2) {
      setNameError('Admin name must be at least 2 characters')
      valid = false
    }
    // Email: required, valid
    if (!setupData.adminEmail.trim()) {
      setEmailError('Admin email is required')
      valid = false
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(setupData.adminEmail.trim())) {
      setEmailError('Please enter a valid email address')
      valid = false
    }
    // Password: required, min 8
    if (!setupData.password) {
      setPasswordError('Password is required')
      valid = false
    } else if (setupData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    }
    // Home directory: required, valid format
    if (!homeDirectory) {
      setHomeDirectoryError('Home directory is required')
      valid = false
    } else if (!/^[a-z0-9-_]+$/.test(homeDirectory)) {
      setHomeDirectoryError('Home directory can only contain lowercase letters, numbers, hyphens, and underscores')
      valid = false
    } else if (homeDirectory.length < 3) {
      setHomeDirectoryError('Home directory must be at least 3 characters')
      valid = false
    }
    return valid
  }

  const handleSetup = async () => {
    if (!validate()) return
    setIsLoading(true)
    setError('')
    try {
      // Call platform setup API
      const response = await fetch('http://localhost:3006/api/platform/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: setupData.adminEmail,
          password: setupData.password,
          adminName: setupData.adminName,
          homeDirectory
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Setup failed')
      }
      // Auto-login the admin user
      const loginResult = await dispatch(loginUser({
        email: setupData.adminEmail,
        password: setupData.password
      }))
      if (loginUser.fulfilled.match(loginResult)) {
        // window.location.href = '/';
      } else {
        setError('Setup succeeded, but auto-login failed. Please try logging in manually.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container w="400px" p="xl">
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="xs" align="center">
          <ThemeIcon size="xl" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
            <IconCloud size="2rem" />
          </ThemeIcon>
          <Title order={1} size="xl" variant="gradient">
            Welcome to Cloudyverse
          </Title>
          <Text c="dimmed" ta="center">
            Let's set up your file storage platform
          </Text>
        </Stack>
        <Divider />
        {/* Info Alert */}
        <Alert icon={<IconInfoCircle size={16} />} title="Setup Information">
          This will create the first admin user and set up your shared storage folder. All users will share the same file storage area.
        </Alert>
        {/* Error Alert */}
        {error && (
          <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}
        {/* Setup Form */}
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={setupData.adminName}
            onChange={(e) => updateSetupData('adminName', e.target.value)}
            required
            error={nameError}
          />
          <TextInput
            label="Storage Folder"
            placeholder="my-storage"
            description="This will create a shared folder for your data"
            value={homeDirectory}
            disabled
            required
            error={homeDirectoryError}
          />
          <TextInput
            label="Email Address"
            placeholder="you@yourdomain.com"
            value={setupData.adminEmail}
            onChange={(e) => updateSetupData('adminEmail', e.target.value)}
            required
            error={emailError}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter a password"
            value={setupData.password}
            onChange={(e) => updateSetupData('password', e.target.value)}
            required
            error={passwordError}
          />
          <Button
            onClick={handleSetup}
            loading={isLoading}
            disabled={isLoading}
            size="md"
            fullWidth
            mt="lg"
          >
            Complete Setup
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Setup 