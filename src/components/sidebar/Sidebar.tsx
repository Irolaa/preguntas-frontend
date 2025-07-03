import React, { useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BulbOutlined,
  FileAddOutlined,
  FileSearchOutlined,
  AlertOutlined,
  AimOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { SidebarProps } from "./types";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useSessionHandler } from "../../hooks/useSessionHandler";
import { useTheme } from "../../contexts/ThemeContext";
import "../styles/sidebar.css";
import { getUserProgress } from "../../services/profile.service";
import { UserProgressResponse as UserProgress } from "../../models/users.models";
import { useNotificationHandler } from '../../hooks/notificationHandler';
import { getJwtToken } from "../../services/cookies.service";
const { Sider } = Layout;
const { Title } = Typography;

interface ExtendedSidebarProps extends SidebarProps {
  toggleCollapsed: () => void;
}

const Sidebar: React.FC<ExtendedSidebarProps> = ({
  collapsed,
  role,
  toggleCollapsed,
}) => {
  const navigate = useNavigate();
  const { clearSession, getIdFromToken } = useSessionHandler();
  const { userData, loading } = useUser();
  const { darkMode } = useTheme();
  const [userProgress, setUserProgress] = React.useState<UserProgress | null>(
    null
  );
  const { setErrorNotification } = useNotificationHandler();

  const renderMenuItems = () => {
    switch (role) {
      case "ADMIN":
        return (
          <>
            <Menu.Item
              key="1"
              icon={<HomeOutlined />}
              onClick={() => navigate("/home")}
            >
              Página de Inicio
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<BulbOutlined />}
              onClick={() => navigate("/quiz")}
            >
              Crear Quiz
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<FileAddOutlined />}
              onClick={() => navigate("/preguntas")}
            >
              Crear Pregunta
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<FileSearchOutlined />}
              onClick={() => navigate("/mis-preguntas")}
            >
              Mis Preguntas
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
            >
              Información Personal
            </Menu.Item>

            <Menu.Item
              key="7"
              icon={<AlertOutlined />}
              onClick={() => navigate("/moderation")}
            >
              Panel de Moderación
            </Menu.Item>
          </>
        );
      case "COLAB":
        return (
          <>
            <Menu.Item
              key="1"
              icon={<HomeOutlined />}
              onClick={() => navigate("/home")}
            >
              Página de Inicio
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<BulbOutlined />}
              onClick={() => navigate("/quiz")}
            >
              Crear Quiz
            </Menu.Item>
            <Menu.Item
              key="3"
              icon={<FileAddOutlined />}
              onClick={() => navigate("/preguntas")}
            >
              Crear Pregunta
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<FileSearchOutlined />}
              onClick={() => navigate("/mis-preguntas")}
            >
              Mis Preguntas
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
            >
              Información Personal
            </Menu.Item>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = getJwtToken();
        const id = getIdFromToken(token);

        if (!id) {
          throw new Error("ID no válido.");
        }

        const progress = await getUserProgress(id);
        setUserProgress(progress);
      } catch {
        setErrorNotification("No se pudo cargar tu progreso. Intenta nuevamente.");
      }
    };

    fetchProgress();

    const interval = setInterval(fetchProgress, 10000);

    return () => clearInterval(interval);
  }, []);


  const renderProgressSection = () => {
    if (role === "ADMIN" || role === "COLAB") {
        if (!userProgress)
          return <div className="progress-loading">Cargando progreso...</div>;

        const { xp, progress, rank, nextRank, dailyStreak } = userProgress;
        const remainingPercentage = Math.round(100 - progress);
        const percentage = Math.round(progress);
        return (
          <div className="progress-section">
            <div className="progress-title">
              <AimOutlined style={{ marginRight: 8 }} />
              Tu Progreso
            </div>

            <div className="streak-container">
              <FireOutlined style={{ color: "#f50057", marginRight: 6 }} />
              <div>
                <div className="streak-count">{dailyStreak}</div>
                <div className="streak-label">días de racha</div>
              </div>
            </div>

            <div className="xp-container">
              <div className="xp-bar">
                <div
                  className="xp-progress"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="xp-info">
                <span className="current-xp">
                  <ThunderboltOutlined style={{ marginRight: 4 }} />
                  {xp} XP
                </span>
                <div className="rank-badge">
                  <CrownOutlined style={{ marginRight: 4 }} />
                  {rank} <span className="star">★</span>
                </div>
                <span className="next-rank">
                  Te falta un {remainingPercentage}% para alcanzar el rango {nextRank}
                </span>
              </div>
            </div>
          </div>
        );
    }
    return null;
  };

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const renderUserAvatar = () => {
    if (userData.profileImage) {
      return (
        <Avatar
          size={collapsed ? 32 : 64}
          src={userData.profileImage}
          alt={userData.username}
        />
      );
    }
    return <Avatar size={collapsed ? 32 : 64} icon={<UserOutlined />} />;
  };

  const renderUsername = () => {
    if (loading) return "Cargando...";
    return userData.username || "Usuario";
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      className="sidebar"
    >
      <div className="sidebar-container">
        <div className="sidebar-content">
          <div className="sidebar-header">
            {!collapsed && (
              <img
                src="/contiLogoPequeño.png"
                alt="Logo Conti"
                className="sidebar-logo"
              />
            )}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
              className={`sidebar-toggle-button ${
                collapsed
                  ? "sidebar-toggle-button--collapsed"
                  : "sidebar-toggle-button--expanded"
              }`}
            />
          </div>

          <div className="sidebar-user-section">
            {renderUserAvatar()}
            {!collapsed && (
              <Title level={4} className="sidebar-user-title">
                Bienvenido, {renderUsername()}
              </Title>
            )}
          </div>

          <div className="sidebar-menu">
            <Menu
              theme={darkMode ? "dark" : "light"}
              mode="inline"
              defaultSelectedKeys={["1"]}
            >
              {renderMenuItems()}
            </Menu>
          </div>

          {!collapsed && (
            <div className="sidebar-progress-section">
              {renderProgressSection()}
            </div>
          )}
        </div>

        <div className="sidebar-logout-section">
          
          {collapsed ? (
            <Popconfirm
              title="¿Estás seguro?"
              description="¿Realmente deseas cerrar sesión?"
              onConfirm={handleLogout}
              okText="Sí"
              cancelText="No"
              placement="top"
            >
              <Tooltip title="Cerrar sesión">
                <Button
                  icon={<LogoutOutlined />}
                  shape="circle"
                  type="primary"
                  danger
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="¿Estás seguro?"
              description="¿Realmente deseas cerrar sesión?"
              onConfirm={handleLogout}
              okText="Sí"
              cancelText="No"
              placement="top"
            >
              <Button icon={<LogoutOutlined />} type="primary" danger block>
                Cerrar Sesión
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;