import { Group, Button, Input, Divider, Container } from '@mantine/core';
import { IconUpload, IconFolder, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import styles from './file-toolbar.module.css';

export interface FileToolbarProps {
  onUpload: () => void;
  onNewFolder: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  selectedCount: number;
  onDelete: () => void;
  onUncheckAll: () => void;
}

export default function FileToolbar({ onUpload, onNewFolder, onSearch, searchValue, view, onViewChange, selectedCount, onDelete, onUncheckAll }: FileToolbarProps) {
  return (
    <Container pt="md">
      <Group className={styles.root} justify="space-between" align="center">
        <Group gap="sm">
          <Button leftSection={<IconUpload size={18} />} onClick={onUpload}>
            Upload files
          </Button>
          <Button leftSection={<IconFolder size={18} />} onClick={onNewFolder} variant="outline">
            New folder
          </Button>
          {selectedCount > 0 && (
            <>
              <Button leftSection={<IconX size={18} />} onClick={onUncheckAll} variant="outline">
                Uncheck all
              </Button>
              <Button leftSection={<IconTrash size={18} />} onClick={onDelete} color="red" variant="outline">
                Delete ({selectedCount})
              </Button>
            </>
          )}
        </Group>
        <Input
          leftSection={<IconSearch size={16} />}
          placeholder="Search in current folder"
          w={340}
          value={searchValue}
          onChange={e => onSearch(e.currentTarget.value)}
        />
        {/* Add grid/list toggle here if needed */}
      </Group>
    </Container>
  );
} 