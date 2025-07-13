import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Switch,
  TextInput,
  Button,
  Group,
  Alert,
  Divider,
  Badge,
  Select,
  PasswordInput,
  LoadingOverlay
} from '@mantine/core';
import { IconCloud, IconSettings, IconCheck, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setCurrentBackend, 
  updateBackendConfig, 
  toggleBackend,
  clearError as clearStorageError,
  StorageConfig
} from '@/store/slices/storage.slice';
import {
  testStorageConnection,
  clearError,
  clearSuccess
} from '@/store/slices/settings.slice';

const StorageSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentBackend, backends: storageBackends, error: storageError } = useAppSelector((state) => state.storage);
  const { error, success, isLoading } = useAppSelector((state) => state.settings);
  
  const [backends, setBackends] = useState<StorageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBackend, setEditingBackend] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<Record<string, string | null>>({});
  const testLoading = useRef<Record<string, boolean>>({});

  useEffect(() => {
    loadBackends();
  }, []);

  // Clear errors and success messages
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
    dispatch(clearStorageError());
  }, [dispatch]);

  const loadBackends = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/storage/backends', {
        credentials: 'include'
      });
      const data = await response.json();
      setBackends(data.backends);
    } catch (error) {
      // Error handling is done in Redux
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBackend = async (backendType: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/storage/backends/${backendType}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (response.ok) {
        await loadBackends();
        dispatch(toggleBackend(backendType as 'LOCAL' | 'S3' | 'R2'));
      } else {
        // Error handling is done in Redux
      }
    } catch (error) {
      // Error handling is done in Redux
    } finally {
      setSaving(false);
    }
  };

  const handleSetCurrentBackend = async (backendType: string) => {
    try {
      setSaving(true);
      const response = await fetch('/api/storage/backends/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ backendType })
      });
      
      if (response.ok) {
        await loadBackends();
        dispatch(setCurrentBackend(backendType as 'LOCAL' | 'S3' | 'R2'));
      } else {
        // Error handling is done in Redux
      }
    } catch (error) {
      // Error handling is done in Redux
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateConfig = async (backendType: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/storage/backends/${backendType}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editConfig)
      });
      
      if (response.ok) {
        await loadBackends();
        setEditingBackend(null);
        setEditConfig({});
        dispatch(updateBackendConfig({ 
          backend: backendType as 'LOCAL' | 'S3' | 'R2', 
          config: editConfig 
        }));
      } else {
        // Error handling is done in Redux
      }
    } catch (error) {
      // Error handling is done in Redux
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (backendType: string) => {
    setTestResult((prev) => ({ ...prev, [backendType]: null }));
    testLoading.current[backendType] = true;
    
    const result = await dispatch(testStorageConnection(backendType));
    
    if (testStorageConnection.fulfilled.match(result)) {
      setTestResult((prev) => ({ ...prev, [backendType]: 'success' }));
    } else {
      setTestResult((prev) => ({ ...prev, [backendType]: 'Connection failed' }));
    }
    
    testLoading.current[backendType] = false;
  };

  const startEditing = (backend: StorageConfig) => {
    setEditingBackend(backend.backend);
    setEditConfig(backend.config || {});
  };

  const cancelEditing = () => {
    setEditingBackend(null);
    setEditConfig({});
  };

  const getBackendIcon = (backendType: string) => {
    switch (backendType) {
      case 'LOCAL':
        return '💾';
      case 'S3':
        return '☁️';
      case 'R2':
        return '⚡';
      case 'WASABI':
        return '🌊';
      default:
        return '📁';
    }
  };

  const getConfigFields = (backendType: string) => {
    switch (backendType) {
      case 'LOCAL':
        return [
          { key: 'basePath', label: 'Base Path', type: 'text', placeholder: '/path/to/project/root', required: false }
        ];
      case 'S3':
        return [
          { key: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket', required: true },
          { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', placeholder: '', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', placeholder: '', required: true }
        ];
      case 'R2':
        return [
          { key: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket', required: true },
          { key: 'accountId', label: 'Account ID', type: 'text', placeholder: '1234567890', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', placeholder: '', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', placeholder: '', required: true }
        ];
      case 'WASABI':
        return [
          { key: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-bucket', required: true },
          { key: 'region', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
          { key: 'accessKeyId', label: 'Access Key ID', type: 'password', placeholder: '', required: true },
          { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password', placeholder: '', required: true }
        ];
      default:
        return [];
    }
  };

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={loading || isLoading} />
      
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">
            <IconSettings size={24} style={{ marginRight: 8 }} />
            Storage Settings
          </Title>
          <Text c="dimmed">
            Configure your storage backends and switch between them
          </Text>
        </div>

        {(error || storageError) && (
          <Alert icon={<IconX size={16} />} title="Error" color="red">
            {error || storageError}
          </Alert>
        )}

        {success && (
          <Alert icon={<IconCheck size={16} />} title="Success" color="green">
            {success}
          </Alert>
        )}

        <Stack gap="md">
          {backends.map((backend) => (
            <Card key={backend.backend} withBorder p="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Group>
                    <Text size="xl">{getBackendIcon(backend.backend)}</Text>
                    <div>
                      <Text fw={500}>{backend.name}</Text>
                      <Text size="sm" c="dimmed">
                        {backend.backend}
                      </Text>
                    </div>
                  </Group>
                  
                  <Group>
                    {backend.backend === currentBackend && (
                      <Badge color="green" variant="light">
                        Current
                      </Badge>
                    )}
                    <Switch
                      checked={backend.enabled}
                      onChange={() => handleToggleBackend(backend.backend)}
                      disabled={saving}
                    />
                  </Group>
                </Group>

                {backend.enabled && backend.backend !== currentBackend && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleSetCurrentBackend(backend.backend)}
                    disabled={saving}
                  >
                    Set as Current
                  </Button>
                )}

                <Group>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleTestConnection(backend.backend)}
                    loading={!!testLoading.current[backend.backend]}
                  >
                    Test Connection
                  </Button>
                  {testResult[backend.backend] === 'success' && (
                    <Alert color="green" icon={<IconCheck size={16} />} title="Success" mt="xs">
                      Connection successful!
                    </Alert>
                  )}
                  {testResult[backend.backend] && testResult[backend.backend] !== 'success' && (
                    <Alert color="red" icon={<IconX size={16} />} title="Error" mt="xs">
                      {testResult[backend.backend]}
                    </Alert>
                  )}
                </Group>

                {editingBackend === backend.backend ? (
                  <Stack gap="md">
                    <Divider />
                    <Text size="sm" fw={500}>Configuration</Text>
                    
                    {getConfigFields(backend.backend).map((field) => (
                      <div key={field.key}>
                        {field.type === 'password' ? (
                          <PasswordInput
                            label={field.label}
                            placeholder={field.placeholder}
                            value={editConfig[field.key] || ''}
                            onChange={(e) => setEditConfig({
                              ...editConfig,
                              [field.key]: e.target.value
                            })}
                            required={field.required}
                          />
                        ) : (
                          <TextInput
                            label={field.label}
                            placeholder={field.placeholder}
                            value={editConfig[field.key] || ''}
                            onChange={(e) => setEditConfig({
                              ...editConfig,
                              [field.key]: e.target.value
                            })}
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                    
                    <Group>
                      <Button
                        size="sm"
                        onClick={() => handleUpdateConfig(backend.backend)}
                        loading={saving}
                      >
                        Save Configuration
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                    </Group>
                  </Stack>
                ) : (
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={() => startEditing(backend)}
                    disabled={saving}
                  >
                    Edit Configuration
                  </Button>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default StorageSettings; 