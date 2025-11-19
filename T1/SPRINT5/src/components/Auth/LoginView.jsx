import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/auth.css';
import { loginUser } from '../../services/auth';

const LoginView = ({ onLogin, authMessage, session }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAuthenticated = Boolean(session?.isAuthenticated);
  const inputRef = useRef(null);

  useEffect(() => {
    if (session?.user?.username) {
      setUsername(session.user.username);
    }
  }, [session]);

  const helperText = useMemo(() => {
    if (isAuthenticated) {
      return 'Ya tienes una sesión activa en este dispositivo.';
    }

    return 'Introduce tu nombre de usuario tal y como aparece en la base de datos de HeidiSQL.';
  }, [isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isAuthenticated || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const user = await loginUser({ username, password });
      onLogin?.(user);
      setPassword('');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage(error.message || 'No se pudo iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isAuthenticated]);

  return (
    <section className="view-section auth-section" aria-labelledby="login-view-title">
      <header className="view-header">
        <h2 id="login-view-title">Acceso a BubblyBot</h2>
        <p>Introduce tu usuario registrado en la base de datos para continuar.</p>
      </header>

      <div className="view-content auth-content" role="region" aria-live="polite">
        {authMessage && !isAuthenticated && (
          <div className="auth-alert" role="alert">
            {authMessage}
          </div>
        )}

        {errorMessage && (
          <div className="auth-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-name" className="form-field">
            Nombre de usuario
            <input
              id="login-name"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ej: javier"
              disabled={isAuthenticated || isSubmitting}
              ref={inputRef}
            />
          </label>

          <label htmlFor="login-password" className="form-field">
            Contraseña
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Introduce tu contraseña"
              disabled={isAuthenticated || isSubmitting}
            />
          </label>

          <p className="auth-helper">{helperText}</p>

          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting || isAuthenticated}
          >
            {isAuthenticated ? 'Sesión activa' : isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginView;
