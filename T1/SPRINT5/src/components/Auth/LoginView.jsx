import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/auth.css';

const DEFAULT_USER_NAME = 'Persona curiosa';

const LoginView = ({ onLogin, authMessage, session }) => {
  const [name, setName] = useState(session?.user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = Boolean(session?.isAuthenticated);
  const inputRef = useRef(null);

  const helperText = useMemo(() => {
    if (isAuthenticated) {
      return 'Ya tienes una sesión activa en este dispositivo.';
    }

    return 'Introduce un nombre o alias para iniciar una sesión local.';
  }, [isAuthenticated]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isAuthenticated) {
      return;
    }

    setIsSubmitting(true);

    const trimmedName = name.trim() || DEFAULT_USER_NAME;
    window.setTimeout(() => {
      onLogin?.({ name: trimmedName });
      setIsSubmitting(false);
    }, 300);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isAuthenticated]);

  return (
    <section className="view-section auth-section" aria-labelledby="login-view-title">
      <header className="view-header">
        <h2 id="login-view-title">Acceso local</h2>
        <p>Inicia una sesión simulada para desbloquear las vistas protegidas de BubblyBot.</p>
      </header>

      <div className="view-content auth-content" role="region" aria-live="polite">
        {authMessage && !isAuthenticated && (
          <div className="auth-alert" role="alert">
            {authMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-name" className="form-field">
            Nombre o alias
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: Alex"
              disabled={isAuthenticated}
              ref={inputRef}
            />
          </label>

          <p className="auth-helper">{helperText}</p>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting || isAuthenticated}
          >
            {isAuthenticated ? 'Sesión activa' : isSubmitting ? 'Accediendo...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginView;

