import React from 'react';
import '../../styles/auth.css';

const SessionIndicator = ({ session, onLogout, onRequireLogin }) => {
  const isAuthenticated = Boolean(session?.isAuthenticated);
  const displayName =
    session?.user?.displayName || session?.user?.username || session?.user?.name || 'Invitado';

  return (
    <div className="session-indicator" role="status">
      <div className="session-indicator__status">
        <span className={`session-indicator__dot${isAuthenticated ? ' is-online' : ''}`} />
        <div className="session-indicator__details">
          <span className="session-indicator__label">
            {isAuthenticated ? 'Sesión activa' : 'Sin sesión local'}
          </span>
          <span className="session-indicator__user">{displayName}</span>
        </div>
      </div>

      {isAuthenticated ? (
        <button type="button" className="secondary-button" onClick={onLogout}>
          Cerrar sesión
        </button>
      ) : (
        <button type="button" className="secondary-button" onClick={onRequireLogin}>
          Iniciar sesión
        </button>
      )}
    </div>
  );
};

export default SessionIndicator;

