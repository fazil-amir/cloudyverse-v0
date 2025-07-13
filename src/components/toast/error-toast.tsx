import { notifications } from '@mantine/notifications';
import { IconX, IconAlertCircle } from '@tabler/icons-react';

export interface ErrorToastOptions {
  title?: string;
  message: string;
  autoClose?: number;
}

export const showErrorToast = ({ 
  title = 'Error', 
  message, 
  autoClose = 5000 
}: ErrorToastOptions) => {
  notifications.show({
    id: `error-${Date.now()}`,
    title,
    message,
    color: 'red',
    icon: <IconAlertCircle size={16} />,
    autoClose,
    withCloseButton: true,
    styles: {
      root: {
        backgroundColor: 'var(--mantine-color-red-1)',
        border: '1px solid var(--mantine-color-red-3)',
      },
      title: {
        color: 'var(--mantine-color-red-9)',
        fontWeight: 600,
      },
      description: {
        color: 'var(--mantine-color-red-8)',
      },
    },
  });
};

export const showSuccessToast = ({ 
  title = 'Success', 
  message, 
  autoClose = 3000 
}: ErrorToastOptions) => {
  notifications.show({
    id: `success-${Date.now()}`,
    title,
    message,
    color: 'green',
    icon: <IconX size={16} />,
    autoClose,
    withCloseButton: true,
    styles: {
      root: {
        backgroundColor: 'var(--mantine-color-green-1)',
        border: '1px solid var(--mantine-color-green-3)',
      },
      title: {
        color: 'var(--mantine-color-green-9)',
        fontWeight: 600,
      },
      description: {
        color: 'var(--mantine-color-green-8)',
      },
    },
  });
};

export const showWarningToast = ({ 
  title = 'Warning', 
  message, 
  autoClose = 4000 
}: ErrorToastOptions) => {
  notifications.show({
    id: `warning-${Date.now()}`,
    title,
    message,
    color: 'yellow',
    icon: <IconAlertCircle size={16} />,
    autoClose,
    withCloseButton: true,
    styles: {
      root: {
        backgroundColor: 'var(--mantine-color-yellow-1)',
        border: '1px solid var(--mantine-color-yellow-3)',
      },
      title: {
        color: 'var(--mantine-color-yellow-9)',
        fontWeight: 600,
      },
      description: {
        color: 'var(--mantine-color-yellow-8)',
      },
    },
  });
}; 