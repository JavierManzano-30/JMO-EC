import React from 'react';

/**
 * Componente de estado de carga
 * Muestra un indicador visual mientras se cargan datos
 */
const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true">
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default Loading;

