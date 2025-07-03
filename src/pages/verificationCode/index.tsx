import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { useDependencies } from './hook';
import AnimatedPage from '../../components/animatedPage/animatedPage';
import './styles.css';

const VerificationCode: React.FC = () => {
	const { handleSubmit } = useDependencies();
	const [form] = Form.useForm();

	return (
		<AnimatedPage>
			<div className="verification-wrapper">
				<div className="verification-card">
					<Typography.Title level={3} className="verification-title">
						Verificá tu cuenta
					</Typography.Title>
					<Typography.Paragraph>
						Ingresá el código de verificación que te enviamos por correo.
					</Typography.Paragraph>

					<Form
						form={form}
						layout="vertical"
						onFinish={({ code }) => handleSubmit(code)}
					>
						<Form.Item
							name="code"
							label="Código de Verificación"
							rules={[{ required: true, message: 'Este campo es requerido' }]}
						>
							<Input placeholder="123456" maxLength={6} />
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" block>
								Verificar y continuar
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</AnimatedPage>
	);
};

export default VerificationCode;
