import { Center, Stack, Text } from '@mantine/core';
import { IconFileOff } from '@tabler/icons-react';
import styles from './empty-state.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ 
  title = "No files found", 
  description = "Upload some files or create a folder to get started",
  icon = <IconFileOff size={64} className={styles.icon} />
}: EmptyStateProps) {
  return (
    <Center className={styles.root}>
      <Stack align="center" gap="md">
        {icon}
        <Text size="lg" fw={500} className={styles.title}>
          {title}
        </Text>
        <Text size="sm" ta="center" className={styles.description}>
          {description}
        </Text>
      </Stack>
    </Center>
  );
} 