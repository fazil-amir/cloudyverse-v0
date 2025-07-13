import { Center, Stack, Text } from '@mantine/core';
import { IconFileOff } from '@tabler/icons-react';
// @ts-ignore
import styles from './empty-state.module.css';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  height?: string | number;
}

export default function EmptyState({ 
  title = "No files found", 
  description = "Upload some files or create a folder to get started",
  icon = <IconFileOff size={64} color="#adb5bd" />,
  height = "400px"
}: EmptyStateProps) {
  return (
    <Center className={styles.root} style={{ height }}>
      <Stack align="center" gap="md">
        {icon}
        <Text size="lg" color="dimmed" fw={500}>
          {title}
        </Text>
        <Text size="sm" color="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Center>
  );
} 