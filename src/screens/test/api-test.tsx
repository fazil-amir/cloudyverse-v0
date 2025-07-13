import { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  TextInput,
  Button,
  Table,
  Pagination,
  Group,
  Text,
  Alert,
  ActionIcon,
  Modal,
  Title,
  Paper,
  Badge,
  Loader,
  Flex,
  Box
} from '@mantine/core';
import { IconTrash, IconPlus, IconRefresh } from '@tabler/icons-react';

interface TestRecord {
  id: number;
  random_string: string;
  created_at: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_BASE_URL = 'http://localhost:3006/api';

const ApiTest = () => {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [customString, setCustomString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<TestRecord | null>(null);

  const fetchRecords = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/test-data?page=${page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch records');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const insertRandomRecord = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/test-data/random`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Random record inserted successfully!');
        fetchRecords(1); // Refresh to first page
      } else {
        setError(data.error || 'Failed to insert random record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert random record');
    } finally {
      setLoading(false);
    }
  };

  const insertCustomRecord = async () => {
    if (!customString.trim()) {
      setError('Please enter a string');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/test-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ random_string: customString.trim() }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Custom record inserted successfully!');
        setCustomString('');
        fetchRecords(1); // Refresh to first page
      } else {
        setError(data.error || 'Failed to insert custom record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to insert custom record');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (record: TestRecord) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/test-data/${record.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Record deleted successfully!');
        setDeleteModalOpen(false);
        setRecordToDelete(null);
        fetchRecords(pagination.page);
      } else {
        setError(data.error || 'Failed to delete record');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchRecords(page);
  };

  const openDeleteModal = (record: TestRecord) => {
    setRecordToDelete(record);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Title order={2}>API Test - Database Operations</Title>
        
        {/* Alerts */}
        {error && (
          <Alert color="red" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert color="green" title="Success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Insert Forms */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Insert Data</Title>
            
            <Group gap="md" align="flex-end">
              <TextInput
                label="Custom String"
                placeholder="Enter a custom string to insert"
                value={customString}
                onChange={(e) => setCustomString(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                onClick={insertCustomRecord}
                loading={loading}
                leftSection={<IconPlus size={16} />}
              >
                Insert Custom
              </Button>
            </Group>
            
            <Button
              onClick={insertRandomRecord}
              loading={loading}
              variant="outline"
              leftSection={<IconRefresh size={16} />}
            >
              Insert Random String
            </Button>
          </Stack>
        </Paper>

        {/* Data Table */}
        <Paper p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Database Records</Title>
              <Badge variant="light">
                Total: {pagination.total} records
              </Badge>
            </Group>
            
            {loading ? (
              <Flex justify="center" py="xl">
                <Loader size="lg" />
              </Flex>
            ) : (
              <>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Random String</Table.Th>
                      <Table.Th>Created At</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {records.map((record) => (
                      <Table.Tr key={record.id}>
                        <Table.Td>{record.id}</Table.Td>
                        <Table.Td>
                          <Text size="sm" style={{ wordBreak: 'break-all' }}>
                            {record.random_string}
                          </Text>
                        </Table.Td>
                        <Table.Td>{formatDate(record.created_at)}</Table.Td>
                        <Table.Td>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={() => openDeleteModal(record)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                
                {records.length === 0 && (
                  <Text c="dimmed" ta="center" py="xl">
                    No records found. Add some data using the form above!
                  </Text>
                )}
                
                {pagination.totalPages > 1 && (
                  <Group justify="center">
                    <Pagination
                      total={pagination.totalPages}
                      value={pagination.page}
                      onChange={handlePageChange}
                    />
                  </Group>
                )}
              </>
            )}
          </Stack>
        </Paper>
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRecordToDelete(null);
        }}
        title="Confirm Delete"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete this record?
          </Text>
          {recordToDelete && (
            <Box>
              <Text size="sm" c="dimmed">ID: {recordToDelete.id}</Text>
              <Text size="sm" c="dimmed">String: {recordToDelete.random_string}</Text>
            </Box>
          )}
          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setRecordToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              loading={loading}
              onClick={() => recordToDelete && deleteRecord(recordToDelete)}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ApiTest; 