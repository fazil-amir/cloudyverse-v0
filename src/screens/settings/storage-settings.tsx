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
  LoadingOverlay,
  ActionIcon,
  Tooltip,
  Box,
  Flex
} from '@mantine/core';
import { 
  IconCloud, 
  IconSettings, 
  IconCheck, 
  IconX, 
  IconEdit, 
  IconTestPipe,
  IconDatabase,
  IconServer
} from '@tabler/icons-react';
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
  clearSuccess,
  loadStorageBackends,
  setCurrentBackend as setCurrentBackendSettings,
  updateBackendConfig as updateBackendConfigSettings,
  toggleBackend as toggleBackendSettings,
  StorageBackend
} from '@/store/slices/settings.slice';

const StorageSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentBackend} = useAppSelector((state) => state.storage);
  const { isLoading, storageBackends: settingsBackends, isUpdatingBackend } = useAppSelector((state) => state.settings);
  
  const [backends, setBackends] = useState<StorageBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBackend, setEditingBackend] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<Record<string, any>>({});
  const [testResult, setTestResult] = useState<Record<string, string | null>>({});
  const testLoading = useRef<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(loadStorageBackends());
  }, [dispatch]);

  // Clear errors and success messages
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
    dispatch(clearStorageError());
  }, [dispatch]);

  // Update local backends when Redux state changes
  useEffect(() => {
    if (settingsBackends.length > 0) {
      setBackends(settingsBackends);
      setLoading(false);
    }
  }, [settingsBackends]);

  const handleToggleBackend = async (backendType: string) => {
    // Only allow valid types for setCurrentBackendSettings
    if (['LOCAL', 'S3', 'R2'].includes(backendType)) {
      await dispatch(setCurrentBackendSettings(backendType as 'LOCAL' | 'S3' | 'R2'));
      await dispatch(loadStorageBackends());
    }
  };

  const handleUpdateConfig = async (backendType: string) => {
    await dispatch(updateBackendConfigSettings({ backendType, config: editConfig }));
    setEditingBackend(null);
    setEditConfig({});
  };

  const handleTestConnection = async (backendType: string) => {
    setTestResult((prev) => ({ ...prev, [backendType]: null }));
    testLoading.current[backendType] = true;
    
    const result = await dispatch(testStorageConnection(backendType));
    
    if (testStorageConnection.fulfilled.match(result)) {
      setTestResult((prev) => ({ ...prev, [backendType]: 'success' }));
    }
    // Don't handle errors here - let the Redux middleware handle them
    
    testLoading.current[backendType] = false;
  };

  const startEditing = (backend: StorageBackend) => {
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
        return <IconDatabase size={24} />;
      case 'S3':
        return <IconCloud size={24} />;
      case 'R2':
        return <IconServer size={24} />;
      case 'WASABI':
        return <IconServer size={24} />;
      default:
        return <IconDatabase size={24} />;
    }
  };

  const getBackendColor = (backendType: string) => {
    switch (backendType) {
      case 'LOCAL':
        return 'blue';
      case 'S3':
        return 'green';
      case 'R2':
        return 'orange';
      case 'WASABI':
        return 'cyan';
      default:
        return 'gray';
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
            Storage Backends
          </Title>
          <Text c="dimmed">
            Configure and manage your storage backends. Only one backend can be active at a time.
          </Text>
        </div>

        <Stack gap="md">
          {backends.map((backend) => (
            <Card 
              key={backend.backend} 
              withBorder 
              p="lg"
            >
              <Stack gap="lg">
                <Flex justify="space-between" align="center">
                  <Group>
                    <Box
                      style={{
                        color: `var(--mantine-color-${getBackendColor(backend.backend)}-6)`,
                      }}
                    >
                      {getBackendIcon(backend.backend)}
                    </Box>
                    <div>
                      <Text fw={600} size="lg">{backend.name}</Text>
                      <Text size="sm" c="dimmed">
                        {backend.backend}
                      </Text>
                    </div>
                  </Group>
                  
                  <Group>
                    {backend.enabled && (
                      <Badge 
                        color={getBackendColor(backend.backend)} 
                        variant="filled"
                        size="lg"
                      >
                        Active
                      </Badge>
                    )}
                    <Switch
                      checked={backend.enabled}
                      onChange={() => handleToggleBackend(backend.backend)}
                      disabled={isLoading || isUpdatingBackend}
                      size="lg"
                    />
                  </Group>
                </Flex>

                {backend.enabled && (
                  <Stack gap="md">
                    <Divider />
                    
                    <Group justify="space-between">
                      <Text size="sm" fw={500} c="dimmed">Configuration</Text>
                      <Group gap="xs">
                        <Tooltip label="Test Connection">
                          <ActionIcon
                            variant="light"
                            color={getBackendColor(backend.backend)}
                            onClick={() => handleTestConnection(backend.backend)}
                            loading={!!testLoading.current[backend.backend]}
                            disabled={isUpdatingBackend}
                          >
                            <IconTestPipe size={16} />
                          </ActionIcon>
                        </Tooltip>
                        
                        <Tooltip label="Edit Configuration">
                          <ActionIcon
                            variant="light"
                            color={getBackendColor(backend.backend)}
                            onClick={() => startEditing(backend)}
                            disabled={isUpdatingBackend}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>

                    {editingBackend === backend.backend ? (
                      <Card withBorder p="md" bg="var(--mantine-color-gray-0)">
                        <Stack gap="md">
                          <Text size="sm" fw={500}>Edit Configuration</Text>
                          
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
                                  size="sm"
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
                                  size="sm"
                                />
                              )}
                            </div>
                          ))}
                          
                          <Group justify="flex-end">
                            <Button
                              size="sm"
                              variant="light"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              color={getBackendColor(backend.backend)}
                              onClick={() => handleUpdateConfig(backend.backend)}
                              loading={isUpdatingBackend}
                            >
                              Save Configuration
                            </Button>
                          </Group>
                        </Stack>
                      </Card>
                    ) : (
                      <Card withBorder p="md" bg="var(--mantine-color-gray-0)">
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>Current Configuration</Text>
                          {Object.entries(backend.config || {}).map(([key, value]) => (
                            <Group key={key} justify="space-between">
                              <Text size="sm" c="dimmed">{key}:</Text>
                              <Text size="sm" style={{ fontFamily: 'monospace' }}>
                                {typeof value === 'string' && value.length > 20 
                                  ? value.substring(0, 20) + '...' 
                                  : String(value)
                                }
                              </Text>
                            </Group>
                          ))}
                          {Object.keys(backend.config || {}).length === 0 && (
                            <Text size="sm" c="dimmed">No configuration set</Text>
                          )}
                        </Stack>
                      </Card>
                    )}
                  </Stack>
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