import React from 'react';
import NavBar from '../Navigation/NavBar';
import bubblybotLogo from '../../assets/images/bubblybot-logo.svg';

const AppLayout = ({ children, routes, currentRoute, onRouteChange }) => {
  return (
    <div className="app-layout">
      <header className="app-header" role="banner">
        <img src={bubblybotLogo} alt="Logo de BubblyBot" className="app-logo" />
        <div className="app-header-text">
          <h1>BubblyBot</h1>
          <p>Tu compañero de charla</p>
        </div>
      </header>

      <div className="layout-content">
        <NavBar
          routes={routes}
          currentRoute={currentRoute}
          onRouteChange={onRouteChange}
        />

        <main className="view-container" role="main" aria-live="polite">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

