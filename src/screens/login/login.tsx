import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Alert,
  Group,
  Checkbox,
  Center
} from '@mantine/core'
import { IconInfoCircle, IconLock, IconMail } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser, clearError } from '@/store/slices/user.slice'

interface LoginData {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.user)

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  })

  // Validation state
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const updateLoginData = (field: keyof LoginData, value: string | boolean) => {
    setLoginData(prev => ({ ...prev, [field]: value }))
    // Clear validation errors on change
    if (field === 'email') setEmailError(null)
    if (field === 'password') setPasswordError(null)
  }

  const validate = () => {
    let valid = true
    if (!loginData.email) {
      setEmailError('Email is required')
      valid = false
    } else if (!loginData.email.includes('@')) {
      setEmailError('Please enter a valid email address')
      valid = false
    }
    if (!loginData.password) {
      setPasswordError('Password is required')
      valid = false
    }
    return valid
  }

  const handleLogin = async () => {
    if (!validate()) return
    // Dispatch login action
    const result = await dispatch(loginUser({
      email: loginData.email,
      password: loginData.password
    }))
    // If login successful, navigate to home
    if (loginUser.fulfilled.match(result)) {
      navigate('/')
    }
  }

  const isFormValid = () => {
    return loginData.email.trim() !== '' && loginData.password.trim() !== ''
  }

  // Only show error if it's not from profile fetch (i.e., not "No token provided" or "Invalid token")
  const showError = error && !['No token provided', 'Invalid token'].includes(error)

  return (
    <Center h="100vh">
      <Container size="sm" p="xl">
        <Card p="xl" radius="lg">
          <Stack gap="lg">
            {/* Header */}
            <Stack gap={0} align="center">
              <Title order={1} size="2rem" fw={700}>
                Welcome Back
              </Title>
              <Text c="dimmed" ta="center" size="md">
                Sign in to your Cloudyverse account
              </Text>
            </Stack>

            <Divider my="xs" />

            {/* Error Alert */}
            {showError && (
              <Alert icon={<IconInfoCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => updateLoginData('email', e.target.value)}
                leftSection={<IconMail size={16} />}
                required
                error={emailError}
                size="md"
                autoComplete="email"
              />
              
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => updateLoginData('password', e.target.value)}
                leftSection={<IconLock size={16} />}
                required
                error={passwordError}
                size="md"
                autoComplete="current-password"
              />

              <Group justify="space-between" mt="xs">
                <Checkbox
                  label="Remember me"
                  checked={loginData.rememberMe}
                  onChange={(e) => updateLoginData('rememberMe', e.currentTarget.checked)}
                  size="md"
                />
                <Button variant="subtle" size="sm" color="accent">
                  Forgot password?
                </Button>
              </Group>

              <Button
                onClick={handleLogin}
                loading={isLoading}
                disabled={!isFormValid()}
                size="md"
                fullWidth
                mt="md"
                fw={600}
                fz="lg"
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Center>
  )
}

export default Login 