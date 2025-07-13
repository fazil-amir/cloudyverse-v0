import { Drawer, Stack, Text, Image, Input, ActionIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import styles from './file-sidebar.module.css';

export interface FileSidebarProps {
  file: any;
  open: boolean;
  onClose: () => void;
}

export default function FileSidebar({ file, open, onClose }: FileSidebarProps) {
  return (
    <Drawer opened={open} onClose={onClose} title={file?.name} position="right" size="lg" className={styles.root}>
      {file && (
        <Stack>
          {file.type === 'file' && (
            <Image src={file.url} alt={file.name} width={'100%'} />
          )}
          <Text>Name: {file.name}</Text>
          <Text>Type: {file.type}</Text>
          {file.size && <Text>Size: {file.size}</Text>}
          {file.date && <Text>Date: {file.date}</Text>}
          {file.url && (
            <Input value={file.url} readOnly rightSection={<ActionIcon onClick={() => navigator.clipboard.writeText(file.url)}><IconCheck size={16} /></ActionIcon>} />
          )}
        </Stack>
      )}
    </Drawer>
  );
} 