import React, { useEffect } from 'react';
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Upload,
  Typography,
  Modal,
  Spin
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EditOutlined,
  UploadOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './styles.css';
import { useUserProfile, rules } from './hooks';
import DarkModeToggle from '../../components/sidebar/DarkModeToggle';

const { Title } = Typography;

export const Profile = () => {
  const {
    userData,
    loading,
    isEditing,
    passwordModalVisible,
    form,
    passwordForm,
    uploadProps,
    startEditing,
    cancelEditing,
    saveChanges,
    showPasswordModal,
    handlePasswordChange,
    setPasswordModalVisible,
    getConfirmPasswordRule
  } = useUserProfile();

  if (loading) {
    return (
      <div className="profile-container">
        <Card bordered={false} style={{ textAlign: 'center', minHeight: '300px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Cargando perfil...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Card bordered={false}>
      
        <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <DarkModeToggle /> 
        </div>

      
        {!isEditing ? (
          <>
            <div className="profile-avatar-container">
              <Avatar
                src={userData.profileImage}
                size={120}
                icon={<UserOutlined />}
              />
            </div>

            <div className="profile-info">
              <Title level={3}>{userData.username || 'Usuario'}</Title>
              <Typography.Paragraph>{userData.email || 'Sin email'}</Typography.Paragraph>

              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={startEditing}
                className="profile-button"
              >
                Editar Perfil
              </Button>

              <Button
                icon={<LockOutlined />}
                onClick={showPasswordModal}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </>
        ) : (
          /* Formulario de edición */
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: userData.username,
              email: userData.email
            }}
          >
            <div className="profile-avatar-container">
              <Upload {...uploadProps}>
                <div className="profile-avatar-upload">
                  <Avatar
                    src={userData.profileImage}
                    size={120}
                    icon={<UserOutlined />}
                  />
                  <div className="upload-icon-container">
                    <UploadOutlined className="upload-icon" />
                  </div>
                </div>
              </Upload>
            </div>

            <Form.Item
              name="username"
              label="Nombre de usuario"
              rules={rules.username}
            >
              <Input prefix={<UserOutlined />} placeholder="Nombre de usuario" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Correo electrónico"
              rules={rules.email}
            >
              <Input prefix={<MailOutlined />} placeholder="Correo electrónico" />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveChanges}
                className="profile-button"
              >
                Guardar Cambios
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={cancelEditing}
                style={{ marginLeft: '8px' }}
              >
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={passwordModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => setPasswordModalVisible(false)}
        okText="Cambiar Contraseña"
        cancelText="Cancelar"
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            name="currentPassword"
            label="Contraseña actual"
            rules={rules.currentPassword}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña actual" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Nueva contraseña"
            rules={rules.newPassword}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar contraseña"
            rules={getConfirmPasswordRule(passwordForm)}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};