import React from 'react';

const NavBar = ({ routes, currentRoute, onRouteChange, session }) => {
  const isAuthenticated = Boolean(session?.isAuthenticated);

  return (
    <nav className="nav-bar" aria-label="Secciones principales">
      <h2 className="nav-title">Navegación</h2>
      <ul className="nav-list">
        {routes.map((route) => {
          const isActive = route.id === currentRoute;
          const isProtected = Boolean(route.requiresSession);
          const isLocked = isProtected && !isAuthenticated;

          return (
            <li key={route.id} className="nav-item">
              <button
                type="button"
                className={`nav-link${isActive ? ' is-active' : ''}${isLocked ? ' is-locked' : ''}`}
                onClick={() => onRouteChange(route.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="nav-link__title">{route.label}</span>
                <span className="nav-link__description">{route.description}</span>
                {isLocked && (
                  <span className="nav-link__badge">Requiere sesión</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;

