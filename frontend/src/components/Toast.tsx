import { useToast, UseToastOptions } from '@chakra-ui/react';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = (variant: ToastVariant, title?: string, description?: string, options?: UseToastOptions) => {
    // Default options for all toasts
    const defaultOptions: UseToastOptions = {
      title,
      description,
      status: variant,
      duration: 9000,
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
    showSuccess: (title?: string, description?: string, options?: UseToastOptions) =>
      showToast('success', title, description, options),

    showError: (title?: string, description?: string, options?: UseToastOptions) =>
      showToast('error', title, description, options),

    showInfo: (title?: string, description?: string, options?: UseToastOptions) =>
      showToast('info', title, description, options),

    showWarning: (title?: string, description?: string, options?: UseToastOptions) =>
      showToast('warning', title, description, options),
  };
};
