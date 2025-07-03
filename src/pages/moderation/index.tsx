import React from 'react';
import {
    Card, Radio, Typography, Tag, Space, Divider,
    Button, Popconfirm, Spin, Alert, Input
} from 'antd';
import {
    DeleteOutlined, CloseOutlined,
    ExclamationCircleOutlined, SearchOutlined
} from '@ant-design/icons';
import { useDependencies } from './hooks';
import './styles.css';

const { Title, Text, Paragraph } = Typography;

export const ModerationPanel = () => {
    const {
        questions,
        loading,
        onDeleteQuestion,
        onRejectReport,
        filteredQuestions,
        handleSearchChange,
        clearSearch,
        searchId
    } = useDependencies();

    if (loading) {
        return (
            <div className="moderation-panel">
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Spin size="large" />
                    <p>Cargando preguntas reportadas...</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="moderation-panel">
                <Title level={2} className="moderation-panel__title">
                    Lista de Preguntas Reportadas
                </Title>
                <Alert
                    message="No hay preguntas reportadas"
                    description="No se encontraron preguntas reportadas en este momento."
                    type="info"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className='moderation-panel'>
            <Title level={2} className='moderation-panel__title'>
                Lista de Preguntas Reportadas ({questions.length})
            </Title>

            <div className="moderation-panel__search" style={{ marginBottom: '24px' }}>
                <Input
                    placeholder="Buscar por ID de pregunta..."
                    prefix={<SearchOutlined />}
                    value={searchId}
                    onChange={handleSearchChange}
                    allowClear
                    onClear={clearSearch}
                    style={{ maxWidth: '400px' }}
                />
                {searchId && (
                    <Text type="secondary" style={{ marginLeft: '12px' }}>
                        Mostrando {filteredQuestions.length} de {questions.length} preguntas
                    </Text>
                )}
            </div>

            {searchId && filteredQuestions.length === 0 && (
                <Alert
                    message="No se encontraron resultados"
                    description={`No se encontraron preguntas reportadas con ID que contenga "${searchId}".`}
                    type="warning"
                    showIcon
                    style={{ marginBottom: '24px' }}
                    action={
                        <Button type="text" onClick={clearSearch}>
                            Limpiar búsqueda
                        </Button>
                    }
                />
            )}

            {filteredQuestions.map((reportedQuestion) => (
                <Card
                    key={reportedQuestion.question.id}
                    className='question-card'
                    hoverable
                >
                    <div className='question-card__header'>
                        <Tag color="blue">ID: {reportedQuestion.question.id}</Tag>
                        <Space>
                            {reportedQuestion.question.categories.map((category) => (
                                <Tag key={category.id} color="green">{category.name}</Tag>
                            ))}
                        </Space>
                    </div>

                    {reportedQuestion.question.imageBase64 && (
                        <div className="question-card__image">
                            <img
                                src={reportedQuestion.question.imageBase64}
                                alt="Pregunta"
                            />
                        </div>
                    )}

                    <Title level={4} className='question-card__title'>
                        {reportedQuestion.question.text}
                    </Title>

                    <div className='question-card__options'>
                        <Text strong className='question-card__options-label'>
                            Opciones:
                        </Text>
                        <Radio.Group className='question-card__options-group' disabled>
                            <Space direction="vertical" className="question-card__options-space">
                                {reportedQuestion.question.answerOptions.map((option) => (
                                    <Radio
                                        key={option.id}
                                        value={option.id}
                                        className={`question-card__option ${option.isCorrect ? 'correct-option' : ''}`}
                                    >
                                        {option.text} {option.isCorrect && <Tag color="success">Correcto</Tag>}
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </div>

                    {reportedQuestion.question.explanation && (
                        <>
                            <Divider />
                            <div>
                                <Text strong className="question-card__explanation-label">
                                    Explicación:
                                </Text>
                                <Paragraph className="question-card__explanation-text">
                                    {reportedQuestion.question.explanation}
                                </Paragraph>
                            </div>
                        </>
                    )}

                    <Divider />
                    <div className="question-card__reports">
                        <Text strong className="question-card__reports-label">
                            <ExclamationCircleOutlined /> Reportes ({reportedQuestion.reports.length}):
                        </Text>
                        {reportedQuestion.reports.map((report) => (
                            <Card
                                key={report.reportId}
                                size="small"
                                className="report-card"
                                style={{ marginTop: '8px' }}
                            >
                                <Text strong>Razón:</Text> {report.reason}
                                <br />
                                <Text strong>Descripción:</Text> {report.description}
                                <br />
                                <Text type="secondary">
                                    Reportado el: {new Date(report.reportedAt).toLocaleString()}
                                </Text>
                            </Card>
                        ))}
                    </div>

                    <Divider />
                    <div className="question-card__info">
                        <Space>
                            <Text type="secondary">
                                Creado: {new Date(reportedQuestion.question.createdAt).toLocaleString()}
                            </Text>
                            <Text type="secondary">
                                👍 {reportedQuestion.question.likes} 👎 {reportedQuestion.question.dislikes}
                            </Text>
                        </Space>
                    </div>

                    <Divider />
                    <div className="question-card__actions">
                        <Popconfirm
                            title="Rechazar reporte"
                            description="¿Estás seguro de que quieres rechazar este reporte? La pregunta seguirá disponible."
                            onConfirm={() => onRejectReport(reportedQuestion.question.id)}
                            okText="Sí, rechazar"
                            cancelText="Cancelar"
                            okType="default"
                        >
                            <Button
                                type="primary"
                                icon={<CloseOutlined />}
                            >
                                Rechazar Reporte
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title="Eliminar pregunta"
                            description="¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer."
                            onConfirm={() => onDeleteQuestion(reportedQuestion.question.id)}
                            okText="Sí, eliminar"
                            cancelText="Cancelar"
                            okType="danger"
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                            >
                                Eliminar Pregunta
                            </Button>
                        </Popconfirm>
                    </div>
                </Card>
            ))}
        </div>
    );
};
