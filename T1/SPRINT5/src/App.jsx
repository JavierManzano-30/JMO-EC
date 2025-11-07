import React, { useMemo, useState } from 'react';
import './styles/layout.css';
import './App.css';
import AppLayout from './components/Layout/AppLayout';
import {
  DEFAULT_ROUTE_ID,
  ROUTE_COMPONENTS,
  ROUTE_LIST,
  ROUTE_MAP,
} from './services/routes';

function App() {
  const [currentRoute, setCurrentRoute] = useState(DEFAULT_ROUTE_ID);

  const ActiveView = useMemo(() => {
    return ROUTE_COMPONENTS[currentRoute] ?? ROUTE_COMPONENTS[DEFAULT_ROUTE_ID];
  }, [currentRoute]);

  const activeRoute = useMemo(() => {
    return ROUTE_MAP[currentRoute] ?? ROUTE_MAP[DEFAULT_ROUTE_ID];
  }, [currentRoute]);

  return (
    <AppLayout
      routes={ROUTE_LIST}
      currentRoute={activeRoute.id}
      onRouteChange={setCurrentRoute}
    >
      <ActiveView route={activeRoute} />
    </AppLayout>
  );
}

export default App;
