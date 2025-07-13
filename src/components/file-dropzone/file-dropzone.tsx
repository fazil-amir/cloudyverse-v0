import { Box, Stack, Title } from '@mantine/core';
import styles from './file-dropzone.module.css';

export interface FileDropzoneProps {
  open: boolean;
  children?: React.ReactNode;
  color?: string;
}

export default function FileDropzone({ open, children, color }: FileDropzoneProps) {
  if (!open) return null;
  return (
    <Box className={styles.overlay} style={{ background: color }}>
      {children}
    </Box>
  );
} 