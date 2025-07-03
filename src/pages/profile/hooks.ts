import { useState, useCallback, useEffect } from 'react';
import { message, Form, FormInstance } from 'antd';
import { UploadFile, UploadProps, Upload, GetProp } from 'antd';
import { Rule } from 'antd/lib/form';
import { PasswordFormValues } from './types';
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { useApiHandler } from '../../hooks/useApiHandlers';
import { updateUserProfile, updatePassword } from '../../services/profile.service';
import { useUser, UserData } from '../../contexts/UserContext';

export const rules = {
  username: [
    { 
      required: true, 
      message: 'Por favor ingresa tu nombre de usuario' 
    }
  ] as Rule[],
  
  email: [
    { 
      required: true,
      message: 'Por favor ingresa tu correo electrónico'
    },
    { 
      type: 'email', 
      message: 'Ingresa un correo válido'
    }
  ] as Rule[],
  
  currentPassword: [
    { 
      required: true, 
      message: 'Por favor ingresa tu contraseña actual' 
    }
  ] as Rule[],
  
  newPassword: [
    { 
      required: true, 
      message: 'Por favor ingresa tu nueva contraseña' 
    },
    { 
      min: 8, 
      message: 'La contraseña debe tener al menos 8 caracteres' 
    }
  ] as Rule[],
  
};

export const useUserProfile = () => {
  const { handleMutation } = useApiHandler();
  const { setNotification } = useNotificationHandler();
  
  const { userData, loading, refreshUserData, updateUserData } = useUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (isEditing && userData) {
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
      });
    }
  }, [userData, isEditing, form]);

  const loadUserData = useCallback(async () => {
    await refreshUserData();
  }, [refreshUserData]);

  const startEditing = useCallback(() => {
    setOriginalUserData({ ...userData });
    
    form.setFieldsValue({
      username: userData.username,
      email: userData.email
    });
    setIsEditing(true);
  }, [form, userData]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    form.resetFields();
    
    if (originalUserData) {
      updateUserData(originalUserData);
      setOriginalUserData(null);
    }
  }, [form, originalUserData, updateUserData]);

  const saveChanges = useCallback(() => {
    form.validateFields()
      .then(async (values) => {
        const payload = {
          username: values.username,
          email: values.email,
          profileImage: userData.profileImage,
        };

        const { result, isError, message: apiMessage } = await handleMutation(updateUserProfile, payload);

        if (isError) {
          setNotification({type: 'error', message: apiMessage || 'Error al actualizar el perfil'});
          return;
        }

        if (result) {
          updateUserData(result);
        } else {
          updateUserData({
            ...userData,
            username: values.username,
            email: values.email
          });
        }
        
        setIsEditing(false);
        setOriginalUserData(null);
        setNotification({type: 'success', message: 'Perfil actualizado correctamente'});
        
        await refreshUserData();
      })
      .catch(() => {
        message.error('Valida los campos del formulario');
        setNotification({type: 'error', message: 'Valida los campos del formulario'});
      });
  }, [form, handleMutation, userData, updateUserData, setNotification, refreshUserData]);

  const showPasswordModal = useCallback(() => {
    setPasswordModalVisible(true);
    passwordForm.resetFields();
  }, [passwordForm]);

  const handlePasswordChange = useCallback(() => {
    passwordForm.validateFields()
      .then(async (values: PasswordFormValues) => {
        if (values.newPassword !== values.confirmPassword) {
          message.error('Las contraseñas no coinciden');
          return;
        }

        const { isError, message: apiMessage } = await handleMutation(updatePassword, {
          currentPassword: values.currentPassword, 
          newPassword: values.newPassword
        });

        if (isError) {
          setNotification({type: 'error', message: apiMessage || 'Error al actualizar la contraseña'});
          return;
        }

        setPasswordModalVisible(false);
        setNotification({type: 'success', message: 'Contraseña actualizada correctamente'});
      })
      .catch(() => {
        message.error('Valida los campos del formulario');
      });
  }, [passwordForm, handleMutation, setNotification]);

  const handleImageUpload: UploadProps['onChange'] = async ({
    fileList: newFileList,
  }) => {
    if (newFileList.length === 0) {
      updateUserData({ ...userData, profileImage: '' });
      return;
    }

    const file = newFileList[0];
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as File);
      reader.onload = () => {
        updateUserData({ 
          ...userData,
          profileImage: reader.result as string 
        });
      };
    }
  };

  const uploadProps: UploadProps = {
    onChange: handleImageUpload,
    beforeUpload: () => false,
    maxCount: 1,
    accept: 'image/*',
    showUploadList: false,
  };

  const getConfirmPasswordRule = useCallback((passwordForm: FormInstance) => [
    { required: true, message: 'Por favor confirma tu nueva contraseña' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('newPassword') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Las contraseñas no coinciden'));
      },
    }),
  ], []);

  return {
    userData,
    loading,
    isEditing,
    passwordModalVisible,
    form,
    passwordForm,
    uploadProps,
    loadUserData,
    startEditing,
    cancelEditing,
    saveChanges,
    showPasswordModal,
    handlePasswordChange,
    setPasswordModalVisible,
    getConfirmPasswordRule
  };
};