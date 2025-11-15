import React, { useEffect, useRef } from 'react';

/**
 * Componente para anunciar cambios de vista a lectores de pantalla
 * Mejora la accesibilidad anunciando cambios de ruta
 */
const ScreenAnnouncer = ({ message, priority = 'polite' }) => {
  const announcementRef = useRef(null);

  useEffect(() => {
    if (message && announcementRef.current) {
      // Forzar un nuevo anuncio cambiando el texto
      announcementRef.current.textContent = '';
      // Usar requestAnimationFrame para asegurar que el cambio se detecte
      requestAnimationFrame(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = message;
        }
      });
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div
      ref={announcementRef}
      className="screen-announcer"
      role="status"
      aria-live={priority}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default ScreenAnnouncer;

