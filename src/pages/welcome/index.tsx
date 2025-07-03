import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Lottie from 'lottie-react';
import contiAnimacion from '../../assets/animacionConti.json'; 

const Welcome = () => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 500); 
  };

  return (
    <div className={`welcome-wrapper ${isExiting ? 'slide-out' : ''}`}>
      {/* Logo + nombre */}
      <div className="welcome-logo">
        <img src="/contiLogoPequeño.png" alt="Logo Conti" width={40} height={40} />
        Conti Learning Community
      </div>

      {/* Contenido principal */}
      <div className="welcome-content">
        
        <Lottie 
          animationData={contiAnimacion}
          loop
          autoplay
          className="welcome-illustration"
        />

        <div className="welcome-text">
          <h1>¡La forma divertida, efectiva y gratuita de aprender!</h1>

          <div className="welcome-buttons">
            <button
              className="welcome-button-primary"
              onClick={() => handleNavigate('/register')}
            >
              Empieza ahora
            </button>
            <button
              className="welcome-button-secondary"
              onClick={() => handleNavigate('/login')}
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>
      </div>

      <div className="welcome-footer">
        © 2025 Conti Learning Community. Todos los derechos reservados.
      </div>
    </div>
  );
};

export default Welcome;
