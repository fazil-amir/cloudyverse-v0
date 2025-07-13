import { showErrorToast, showSuccessToast } from '@/components/toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: any, context?: string): void => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.error) {
    errorMessage = error.error;
  }

  // Add context if provided
  const title = context ? `${context} Error` : 'Error';
  
  showErrorToast({
    title,
    message: errorMessage,
  });
};

export const handleApiSuccess = (message: string, context?: string): void => {
  const title = context ? `${context} Success` : 'Success';
  
  showSuccessToast({
    title,
    message,
  });
};

// Utility for handling fetch responses
export const handleFetchResponse = async (response: Response, context?: string): Promise<any> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If we can't parse the error response, use the default message
    }
    
    handleApiError({ message: errorMessage }, context);
    throw new Error(errorMessage);
  }
  
  return response.json();
};
