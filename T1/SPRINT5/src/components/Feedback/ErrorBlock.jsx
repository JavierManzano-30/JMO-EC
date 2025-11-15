import React from 'react';

/**
 * Componente de bloque de error
 * Muestra mensajes de error de forma clara y accesible
 */
const ErrorBlock = ({ 
  title = 'Error', 
  message = 'Ha ocurrido un error inesperado.',
  onRetry = null,
  retryLabel = 'Reintentar'
}) => {
  return (
    <div className="error-block" role="alert" aria-live="assertive">
      <div className="error-block__icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="error-block__content">
        <h3 className="error-block__title">{title}</h3>
        <p className="error-block__message">{message}</p>
        {onRetry && (
          <button 
            type="button" 
            className="primary-button error-block__retry"
            onClick={onRetry}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBlock;

