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
import {
  loadUsers,
  createUser,
  deleteUser,
  clearError,
  clearSuccess,
  setShowCreateUserModal,
  loadStorageBackends,
  setCurrentBackend as setCurrentBackendSettings,
  updateBackendConfig as updateBackendConfigSettings,
  toggleBackend as toggleBackendSettings
} from '@/store/slices/settings.slice'

const Settings = () => {
  const dispatch = useAppDispatch()
  const { currentBackend, backends, error: storageError } = useAppSelector((state) => state.storage)
  const { user } = useAppSelector((state) => state.user)
  const { 
    users, 
    storageBackends,
    isLoading, 
    error, 
    success, 
    isCreatingUser, 
    showCreateUserModal,
    isUpdatingBackend
  } = useAppSelector((state) => state.settings)
  
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

  // User management state
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: ''
  })

  // Load storage backends from API
  useEffect(() => {
    dispatch(loadStorageBackends())
  }, [dispatch])

  // Load users on component mount
  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(loadUsers())
    }
  }, [dispatch, user])

  // Clear errors and success messages
  useEffect(() => {
    dispatch(clearError())
    dispatch(clearSuccess())
  }, [dispatch])

  const handleBackendChange = async (backend: 'LOCAL' | 'S3' | 'R2') => {
    await dispatch(setCurrentBackendSettings(backend))
  }

  const handleS3ConfigUpdate = async (field: string, value: string) => {
    const newConfig = { ...s3Config, [field]: value }
    setS3Config(newConfig)
    
    await dispatch(updateBackendConfigSettings({ backendType: 'S3', config: newConfig }))
  }

  const handleR2ConfigUpdate = async (field: string, value: string) => {
    const newConfig = { ...r2Config, [field]: value }
    setR2Config(newConfig)
    
    await dispatch(updateBackendConfigSettings({ backendType: 'R2', config: newConfig }))
  }

  const handleToggleBackend = async (backend: 'LOCAL' | 'S3' | 'R2') => {
    await dispatch(toggleBackendSettings(backend))
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      return;
    }

    const result = await dispatch(createUser(newUser))
    
    if (createUser.fulfilled.match(result)) {
      setNewUser({ email: '', password: '', name: '' })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    await dispatch(deleteUser(userId))
  }

  const handleOpenCreateUserModal = () => {
    dispatch(setShowCreateUserModal(true))
  }

  const handleCloseCreateUserModal = () => {
    dispatch(setShowCreateUserModal(false))
    setNewUser({ email: '', password: '', name: '' })
  }

  return (
    <Container size="lg" p="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack gap="xs">
          <Title order={1}>Settings</Title>
          <Text c="dimmed">Manage your platform configuration</Text>
        </Stack>

        {/* Success Alert - Keep this for immediate feedback */}
        {success && (
          <Alert icon={<IconInfoCircle size={16} />} title="Success" color="green">
            {success}
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
              disabled={isUpdatingBackend}
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
                  onClick={handleOpenCreateUserModal}
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
          opened={showCreateUserModal}
          onClose={handleCloseCreateUserModal}
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
              <Button variant="light" onClick={handleCloseCreateUserModal}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUser}
                loading={isCreatingUser}
                disabled={isCreatingUser}
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