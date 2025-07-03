import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button, Tooltip } from "antd";
import { MoonFilled, SunFilled } from "@ant-design/icons"; 
import "../styles/sidebar.css"; 


const DarkModeToggle: React.FC = () => {
 const { darkMode, toggleDarkMode } = useTheme();

  const icon = darkMode ? <SunFilled /> : <MoonFilled />;
  const tooltipText = darkMode ? "Desactivar modo oscuro" : "Activar modo oscuro";

  return (

        <Tooltip title={tooltipText} placement="left"> 
         <Button
        icon={icon}
        
        onClick={toggleDarkMode}
         className="dark-mode-toggle" 
         />
        </Tooltip>
 );
};

export default DarkModeToggle;