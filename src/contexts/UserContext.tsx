import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApiHandler } from '../hooks/useApiHandlers';
import { useNotificationHandler } from '../hooks/notificationHandler';
import { getUserData } from '../services/profile.service';

export interface UserData {
  username: string;
  email: string;
  profileImage: string;
}

interface UserContextType {
  userData: UserData;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  updateUserData: (newData: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { handleQuery } = useApiHandler();
  const { setNotification } = useNotificationHandler();
  
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    profileImage: ''
  });
  
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      setLoading(true);
      const { result, isError, message: apiMessage } = await handleQuery(getUserData, undefined);

      if (isError) {
        setNotification({
          type: 'error', 
          message: apiMessage || 'No se pudieron obtener los datos del usuario'
        });
        return;
      }

      if (result) {
        setUserData(result as UserData);
      }
    } catch (error) {
      setNotification({
        type: 'error', 
        message: 'Error al cargar los datos del usuario'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const value: UserContextType = {
    userData,
    loading,
    refreshUserData,
    updateUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};