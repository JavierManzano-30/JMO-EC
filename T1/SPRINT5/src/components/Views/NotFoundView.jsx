import React, { useEffect, useRef } from 'react';

/**
 * Vista 404 - Página no encontrada
 * Se muestra cuando se intenta acceder a una ruta que no existe
 */
const NotFoundView = ({ navigate }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const handleGoHome = () => {
    navigate?.('chat');
  };

  return (
    <section className="view-section" aria-labelledby="not-found-title">
      <header className="view-header">
        <h2 id="not-found-title" ref={headingRef} tabIndex={-1}>
          404 - Página no encontrada
        </h2>
        <p>La ruta que intentas acceder no existe en esta aplicación.</p>
      </header>

      <div className="view-content view-content--centered">
        <div className="not-found-content">
          <div className="not-found-icon" aria-hidden="true">
            🔍
          </div>
          <p className="not-found-message">
            Lo sentimos, no pudimos encontrar la página que buscas.
          </p>
          <button 
            type="button" 
            className="primary-button"
            onClick={handleGoHome}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundView;

