import { Middleware } from '@reduxjs/toolkit';
import { showErrorToast, showSuccessToast } from '@/components/toast';

export const errorToastMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Check if action is rejected (API call failed)
  if ((action as any).type?.endsWith('/rejected')) {
    const errorMessage = (action as any).payload || (action as any).error?.message || 'An error occurred';
    
    // Show error toast
    showErrorToast({
      title: 'Error',
      message: errorMessage,
    });
  }

  // Check if action is fulfilled and has a success message
  if ((action as any).type?.endsWith('/fulfilled')) {
    // Check if the action has a success message in the payload
    if ((action as any).payload?.message) {
      showSuccessToast({
        title: 'Success',
        message: (action as any).payload.message,
      });
    }
  }

  return result;
}; 