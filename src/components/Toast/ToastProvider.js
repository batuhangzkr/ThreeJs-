'use client';

import React, { createContext, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ToastContext = createContext();


export const ToastProvider = ({ children }) => {
    const showSuccess = (message) => toast.success(message);
    const showError = (message) => toast.error(message);
    const showInfo = (message) => toast.info(message);
    const showWarning = (message) => toast.warn(message);

    const toastFunctions = {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };

    return (
        <ToastContext.Provider value={toastFunctions}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
                theme="colored"
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
