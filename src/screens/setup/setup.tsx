import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser } from '@/store/slices/user.slice'
import { performSetup, clearError, setSetupData } from '@/store/slices/setup.slice'
import { showErrorToast } from '@/components/toast'
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

function toFolderName(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/g, '') // remove non-allowed chars
    .trim()
    .replace(/ +/g, '-') // spaces to dash
}

const Setup = () => {
  const dispatch = useAppDispatch()
  const { isLoading, error, setupData } = useAppSelector((state) => state.setup)
  
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Initialize setup data in Redux
  useEffect(() => {
    if (!setupData) {
      dispatch(setSetupData({
        adminEmail: '',
        password: '',
        adminName: '',
        homeDirectory: ''
      }))
    }
  }, [dispatch, setupData])

  // Auto-generate home directory from admin name
  const homeDirectory = setupData?.adminName ? toFolderName(setupData.adminName) : ''

  const updateSetupData = (field: 'adminEmail' | 'password' | 'adminName', value: string) => {
    dispatch(setSetupData({ [field]: value }))
    if (field === 'adminName') setNameError(null)
    if (field === 'adminEmail') setEmailError(null)
    if (field === 'password') setPasswordError(null)
  }

  const validate = () => {
    let valid = true
    // Admin name: required, min 2
    if (!setupData?.adminName?.trim()) {
      setNameError('Admin name is required')
      valid = false
    } else if (setupData.adminName.trim().length < 2) {
      setNameError('Admin name must be at least 2 characters')
      valid = false
    }
    // Email: required, valid
    if (!setupData?.adminEmail?.trim()) {
      setEmailError('Admin email is required')
      valid = false
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(setupData.adminEmail.trim())) {
      setEmailError('Please enter a valid email address')
      valid = false
    }
    // Password: required, min 8
    if (!setupData?.password) {
      setPasswordError('Password is required')
      valid = false
    } else if (setupData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    }

    return valid
  }

  const handleSetup = async () => {
    if (!validate() || !setupData) return
    
    try {
      // Perform setup with Redux action
      const setupResult = await dispatch(performSetup({
        ...setupData,
        homeDirectory
      }))
      
      if (performSetup.fulfilled.match(setupResult)) {
        // Auto-login the admin user
        const loginResult = await dispatch(loginUser({
          email: setupData.adminEmail,
          password: setupData.password
        }))
        if (loginUser.fulfilled.match(loginResult)) {
          window.location.href = '/';
        } else {
          // Setup succeeded but auto-login failed
          showErrorToast({
            title: 'Setup Complete',
            message: 'Setup succeeded, but auto-login failed. Please try logging in manually.',
          });
        }
      }
    } catch (err) {
      // Error handling is done in the Redux slice
    }
  }

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

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

        {/* Setup Form */}
        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={setupData?.adminName || ''}
            onChange={(e) => updateSetupData('adminName', e.target.value)}
            required
            error={nameError}
          />
          <TextInput
            label="Email Address"
            placeholder="you@yourdomain.com"
            value={setupData?.adminEmail || ''}
            onChange={(e) => updateSetupData('adminEmail', e.target.value)}
            required
            error={emailError}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter a password"
            value={setupData?.password || ''}
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