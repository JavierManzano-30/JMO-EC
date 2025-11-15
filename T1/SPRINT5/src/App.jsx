import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/layout.css';
import './App.css';
import AppLayout from './components/Layout/AppLayout';
import {
  DEFAULT_ROUTE_ID,
  PUBLIC_ROUTE_ID,
  ROUTE_COMPONENTS,
  ROUTE_LIST,
  ROUTE_MAP,
} from './services/routes';
import { readSearchParams, writeSearchParams } from './services/urlState';
import { clearSession, loadSession, saveSession } from './services/storage';

const deriveRouteFromParams = (params, session) => {
  const fallbacks = () => {
    if (params.get('id')) {
      return 'conversation';
    }
    if (params.get('q') || params.get('sort')) {
      return 'conversations';
    }
    return DEFAULT_ROUTE_ID;
  };

  const viewParam = params.get('view');
  const candidate = viewParam && ROUTE_MAP[viewParam] ? viewParam : fallbacks();
  
  // Si hay un view param pero no existe en el mapa, es una ruta inválida
  if (viewParam && !ROUTE_MAP[viewParam]) {
    return 'notfound';
  }
  
  const route = ROUTE_MAP[candidate] ?? ROUTE_MAP[DEFAULT_ROUTE_ID];

  if (route.hideWhenAuthenticated && session?.isAuthenticated) {
    return DEFAULT_ROUTE_ID;
  }

  if (route.requiresSession && !session?.isAuthenticated) {
    return PUBLIC_ROUTE_ID;
  }

  return route.id;
};

const sanitizeUrlForRoute = (routeId, options = {}) => {
  const params = readSearchParams();
  params.set('view', routeId);

  if (routeId === 'conversation') {
    if (options?.params?.id) {
      params.set('id', options.params.id);
    } else {
      params.delete('id');
    }
  } else {
    params.delete('id');
  }

  if (routeId === 'conversations') {
    if (options?.params) {
      if (Object.prototype.hasOwnProperty.call(options.params, 'q')) {
        const value = options.params.q;
        if (value) {
          params.set('q', value);
        } else {
          params.delete('q');
        }
      }

      if (Object.prototype.hasOwnProperty.call(options.params, 'sort')) {
        const value = options.params.sort;
        if (value) {
          params.set('sort', value);
        } else {
          params.delete('sort');
        }
      }
    }
  } else {
    params.delete('q');
    params.delete('sort');
  }

  return params;
};

function App() {
  const initialSession = useMemo(() => loadSession(), []);
  const [session, setSession] = useState(initialSession);
  const [authMessage, setAuthMessage] = useState('');
  const [currentRoute, setCurrentRoute] = useState(() => {
    const params = readSearchParams();
    return deriveRouteFromParams(params, initialSession);
  });

  useEffect(() => {
    const params = readSearchParams();
    const desired = deriveRouteFromParams(params, session);
    if (desired !== currentRoute) {
      setCurrentRoute(desired);
    }
  }, [session, currentRoute]);

  useEffect(() => {
    const params = readSearchParams();
    if (params.get('view') !== currentRoute) {
      const sanitized = sanitizeUrlForRoute(currentRoute);
      writeSearchParams(sanitized, { replace: true });
    }
  }, [currentRoute]);

  useEffect(() => {
    const handlePopstate = () => {
      const params = readSearchParams();
      const nextRoute = deriveRouteFromParams(params, session);
      setCurrentRoute(nextRoute);
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [session]);

  const handleRouteChange = useCallback(
    (nextRoute, options = {}) => {
      const route = ROUTE_MAP[nextRoute] ?? ROUTE_MAP[DEFAULT_ROUTE_ID];
      const requiresSession = Boolean(route?.requiresSession);

      if (!options.force && requiresSession && !session?.isAuthenticated) {
        setAuthMessage(`Necesitas iniciar sesión para acceder a "${route.label}".`);
        const sanitized = sanitizeUrlForRoute(PUBLIC_ROUTE_ID);
        writeSearchParams(sanitized, { replace: true });
        setCurrentRoute(PUBLIC_ROUTE_ID);
        return;
      }

      if (!route.requiresSession || session?.isAuthenticated || options.force) {
        setAuthMessage(options.message ?? '');
      }

      const sanitized = sanitizeUrlForRoute(route.id, options);
      writeSearchParams(sanitized, { replace: options?.replace ?? false });
      setCurrentRoute(route.id);
    },
    [session],
  );

  const handleLogin = useCallback(
    ({ name }) => {
      const newSession = saveSession({
        isAuthenticated: true,
        user: { name },
        loggedAt: new Date().toISOString(),
      });
      setSession(newSession);
      setAuthMessage('');
      handleRouteChange(DEFAULT_ROUTE_ID, { replace: true, force: true });
    },
    [handleRouteChange],
  );

  const handleLogout = useCallback(() => {
    clearSession();
    setSession(null);
    setAuthMessage('');
    handleRouteChange(PUBLIC_ROUTE_ID, { replace: true, force: true });
  }, [handleRouteChange]);

  const ActiveView = useMemo(() => {
    return ROUTE_COMPONENTS[currentRoute] ?? ROUTE_COMPONENTS.notfound;
  }, [currentRoute]);

  const activeRoute = useMemo(() => {
    return ROUTE_MAP[currentRoute] ?? ROUTE_MAP[DEFAULT_ROUTE_ID];
  }, [currentRoute]);

  const visibleRoutes = useMemo(() => {
    return ROUTE_LIST.filter((route) => {
      if (route.hideWhenAuthenticated && session?.isAuthenticated) {
        return false;
      }
      if (route.hideWhenUnauthenticated && !session?.isAuthenticated) {
        return false;
      }
      return true;
    });
  }, [session]);

  return (
    <AppLayout
      routes={visibleRoutes}
      currentRoute={activeRoute.id}
      onRouteChange={handleRouteChange}
      session={session}
      onLogout={handleLogout}
      onRequireLogin={() => handleRouteChange(PUBLIC_ROUTE_ID, { replace: true })}
    >
      <ActiveView
        route={activeRoute}
        navigate={handleRouteChange}
        session={session}
        onLogin={handleLogin}
        onLogout={handleLogout}
        authMessage={authMessage}
      />
    </AppLayout>
  );
}

export default App;
