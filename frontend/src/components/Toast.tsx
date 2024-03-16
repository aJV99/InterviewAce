// useCustomToast.ts
import { useToast, UseToastOptions } from '@chakra-ui/react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (variant: ToastVariant, description?: string, options?: UseToastOptions) => {
    // Default options for all toasts
    const defaultOptions: UseToastOptions = {
      //   title,
      description,
      status: variant,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      containerStyle: {
        marginTop: 3,
        marginRight: 5,
      },
      ...options,
    };

    toast(defaultOptions);
  };

  return {
    showSuccess: (description?: string, options?: UseToastOptions) => showToast('success', description, options),

    showError: (description?: string, options?: UseToastOptions) => showToast('error', description, options),

    showInfo: (description?: string, options?: UseToastOptions) => showToast('info', description, options),

    showWarning: (description?: string, options?: UseToastOptions) => showToast('warning', description, options),
  };
};
