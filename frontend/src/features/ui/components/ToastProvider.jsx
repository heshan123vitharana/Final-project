import React from 'react';
import { Toaster } from 'sonner';

const ToastProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        expand={true}
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          className: 'toast-custom',
        }}
      />
    </>
  );
};

export default ToastProvider;
