import { useAppStore } from './useAppStore'; 

export const useNotificationHandler = () => {
    const setNotification = useAppStore(store => store.setNotification);

    const setErrorNotification = (message: string) => {
        setNotification({ message, type: 'error' });
    };
    const setInfoNotification = (message: string) => { 
        setNotification({ message, type: 'success' }); 
    };
 
    const clearNotification = useAppStore(store => store.clearNotification);
    const notification = useAppStore(store => store.notification);

    return {
        setNotification,
        setErrorNotification,
        setInfoNotification,
        clearNotification,
        notification,
    };
};