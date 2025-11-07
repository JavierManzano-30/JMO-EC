import React from 'react';
import NavBar from '../Navigation/NavBar';
import SessionIndicator from '../Auth/SessionIndicator';
import bubblybotLogo from '../../assets/images/bubblybot-logo.svg';

const AppLayout = ({
  children,
  routes,
  currentRoute,
  onRouteChange,
  session,
  onLogout,
  onRequireLogin,
}) => {
  return (
    <div className="app-layout">
      <header className="app-header" role="banner">
        <div className="app-header__brand">
          <img src={bubblybotLogo} alt="Logo de BubblyBot" className="app-logo" />
          <div className="app-header-text">
            <h1>BubblyBot</h1>
            <p>Tu compañero de charla</p>
          </div>
        </div>

        <SessionIndicator
          session={session}
          onLogout={onLogout}
          onRequireLogin={onRequireLogin}
        />
      </header>

      <div className="layout-content">
        <NavBar
          routes={routes}
          currentRoute={currentRoute}
          onRouteChange={onRouteChange}
          session={session}
        />

        <main className="view-container" role="main" aria-live="polite">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

