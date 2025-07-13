import { useState, useEffect } from 'react'
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Select,
  TextInput,
  Divider,
  Alert,
  Switch,
  Group,
  Badge,
  Button,
  Modal,
  Table,
  ActionIcon
} from '@mantine/core'
import { IconInfoCircle, IconCloud, IconUsers, IconPlus, IconTrash } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  setCurrentBackend, 
  updateBackendConfig, 
  toggleBackend
} from '@/store/slices/storage.slice'

const Settings = () => {
  const dispatch = useAppDispatch()
  const { currentBackend, backends, error } = useAppSelector((state) => state.storage)
  const { user } = useAppSelector((state) => state.user)
  
  const [s3Config, setS3Config] = useState({
    bucket: '',
    region: '',
    accessKeyId: '',
    secretAccessKey: ''
  })
  
  const [r2Config, setR2Config] = useState({
    bucket: '',
    accountId: '',
    accessKeyId: '',
    secretAccessKey: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  
  // User management state
  const [users, setUsers] = useState<any[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [creatingUser, setCreatingUser] = useState(false)

  // Load storage backends from API
  useEffect(() => {
    const loadStorageBackends = async () => {
      try {
        const response = await fetch('http://localhost:3006/api/storage/backends', {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          // Update Redux state with backend data
          data.backends.forEach((backend: any) => {
            if (backend.isCurrent) {
              dispatch(setCurrentBackend(backend.backend))
            }
            if (backend.enabled) {
              dispatch(toggleBackend(backend.backend))
            }
            if (backend.config) {
              dispatch(updateBackendConfig({ backend: backend.backend, config: backend.config }))
            }
          })
        }
      } catch (error) {
        console.error('Failed to load storage backends:', error)
      }
    }

    loadStorageBackends()
  }, [dispatch])

  // Load users on component mount
  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers()
    }
  }, [user])

  const handleBackendChange = async (backend: 'LOCAL' | 'S3' | 'R2') => {
    setIsLoading(true)
    setApiError('')

    try {
      const response = await fetch('http://localhost:3006/api/storage/backends/current', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ backendType: backend }),
      })

      if (response.ok) {
        dispatch(setCurrentBackend(backend))
      } else {
        const data = await response.json()
        setApiError(data.error || 'Failed to change storage backend')
      }
    } catch (error) {
      setApiError('Failed to change storage backend')
    } finally {
      setIsLoading(false)
    }
  }

  const handleS3ConfigUpdate = async (field: string, value: string) => {
    const newConfig = { ...s3Config, [field]: value }
    setS3Config(newConfig)
    
    try {
      await fetch('http://localhost:3006/api/storage/backends/S3/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newConfig),
      })
      
      dispatch(updateBackendConfig({ backend: 'S3', config: newConfig }))
    } catch (error) {
      console.error('Failed to update S3 config:', error)
    }
  }

  const handleR2ConfigUpdate = async (field: string, value: string) => {
    const newConfig = { ...r2Config, [field]: value }
    setR2Config(newConfig)
    
    try {
      await fetch('http://localhost:3006/api/storage/backends/R2/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newConfig),
      })
      
      dispatch(updateBackendConfig({ backend: 'R2', config: newConfig }))
    } catch (error) {
      console.error('Failed to update R2 config:', error)
    }
  }

  const handleToggleBackend = async (backend: 'LOCAL' | 'S3' | 'R2') => {
    try {
      await fetch(`http://localhost:3006/api/storage/backends/${backend}/toggle`, {
        method: 'PUT',
        credentials: 'include',
      })
      
      dispatch(toggleBackend(backend))
    } catch (error) {
      console.error('Failed to toggle backend:', error)
    }
  }

  // User management functions
  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/platform/users', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      setApiError('Email and password are required')
      return
    }

    setCreatingUser(true)
    setApiError('')

    try {
      const response = await fetch('http://localhost:3006/api/platform/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      
      if (response.ok) {
        setShowCreateUser(false)
        setNewUser({ email: '', password: '', name: '' })
        loadUsers() // Reload users list
      } else {
        setApiError(data.error || 'Failed to create user')
      }
    } catch (error) {
      setApiError('Failed to create user')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`http://localhost:3006/api/platform/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        loadUsers() // Reload users list
      } else {
        const data = await response.json()
        setApiError(data.error || 'Failed to delete user')
      }
    } catch (error) {
      setApiError('Failed to delete user')
    }
  }

  return (
    <Container size="lg" p="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="xs">
          <Title order={1}>Settings</Title>
          <Text c="dimmed">Manage your platform configuration</Text>
        </Stack>

        {/* Error Alert */}
        {apiError && (
          <Alert icon={<IconInfoCircle size={16} />} title="Error" color="red">
            {apiError}
          </Alert>
        )}

        {/* Storage Configuration */}
        <Card withBorder>
          <Stack gap="md">
            <Group>
              <IconCloud size={20} />
              <Title order={3}>Storage Configuration</Title>
            </Group>
            
            <Select
              label="Current Storage Backend"
              value={currentBackend}
              onChange={(value) => handleBackendChange(value as 'LOCAL' | 'S3' | 'R2')}
              data={[
                { value: 'LOCAL', label: 'Local File System' },
                { value: 'S3', label: 'AWS S3' },
                { value: 'R2', label: 'Cloudflare R2' }
              ]}
              disabled={isLoading}
            />

            {/* S3 Configuration */}
            <Card withBorder p="md">
              <Stack gap="sm">
                <Group>
                  <Text fw={500}>AWS S3 Configuration</Text>
                  <Switch
                    checked={backends.find(b => b.backend === 'S3')?.enabled}
                    onChange={() => handleToggleBackend('S3')}
                    size="sm"
                  />
                </Group>
                <TextInput
                  label="Bucket Name"
                  value={s3Config.bucket}
                  onChange={(e) => handleS3ConfigUpdate('bucket', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'S3')?.enabled}
                />
                <TextInput
                  label="Region"
                  value={s3Config.region}
                  onChange={(e) => handleS3ConfigUpdate('region', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'S3')?.enabled}
                />
                <TextInput
                  label="Access Key ID"
                  value={s3Config.accessKeyId}
                  onChange={(e) => handleS3ConfigUpdate('accessKeyId', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'S3')?.enabled}
                />
                <TextInput
                  label="Secret Access Key"
                  type="password"
                  value={s3Config.secretAccessKey}
                  onChange={(e) => handleS3ConfigUpdate('secretAccessKey', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'S3')?.enabled}
                />
              </Stack>
            </Card>

            {/* R2 Configuration */}
            <Card withBorder p="md">
              <Stack gap="sm">
                <Group>
                  <Text fw={500}>Cloudflare R2 Configuration</Text>
                  <Switch
                    checked={backends.find(b => b.backend === 'R2')?.enabled}
                    onChange={() => handleToggleBackend('R2')}
                    size="sm"
                  />
                </Group>
                <TextInput
                  label="Bucket Name"
                  value={r2Config.bucket}
                  onChange={(e) => handleR2ConfigUpdate('bucket', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'R2')?.enabled}
                />
                <TextInput
                  label="Account ID"
                  value={r2Config.accountId}
                  onChange={(e) => handleR2ConfigUpdate('accountId', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'R2')?.enabled}
                />
                <TextInput
                  label="Access Key ID"
                  value={r2Config.accessKeyId}
                  onChange={(e) => handleR2ConfigUpdate('accessKeyId', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'R2')?.enabled}
                />
                <TextInput
                  label="Secret Access Key"
                  type="password"
                  value={r2Config.secretAccessKey}
                  onChange={(e) => handleR2ConfigUpdate('secretAccessKey', e.target.value)}
                  disabled={!backends.find(b => b.backend === 'R2')?.enabled}
                />
              </Stack>
            </Card>
          </Stack>
        </Card>

        {/* User Management (Admin Only) */}
        {user?.role === 'admin' && (
          <Card withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Group>
                  <IconUsers size={20} />
                  <Title order={3}>User Management</Title>
                </Group>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setShowCreateUser(true)}
                  size="sm"
                >
                  Add User
                </Button>
              </Group>

              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>{user.name || '-'}</Table.Td>
                      <Table.Td>{user.email}</Table.Td>
                      <Table.Td>
                        <Badge color={user.role === 'admin' ? 'blue' : 'gray'}>
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {new Date(user.created_at).toLocaleDateString()}
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === user?.id}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        )}

        {/* Create User Modal */}
        <Modal
          opened={showCreateUser}
          onClose={() => setShowCreateUser(false)}
          title="Create New User"
          size="md"
        >
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="Enter user name"
              value={newUser.name}
              onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextInput
              label="Email"
              placeholder="user@company.com"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setShowCreateUser(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                loading={creatingUser}
                disabled={creatingUser}
              >
                Create User
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}

export default Settings 