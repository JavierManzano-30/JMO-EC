import React, { useEffect, useRef } from 'react';

const SettingsView = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="view-section" aria-labelledby="settings-view-title">
      <header className="view-header">
        <h2 id="settings-view-title" tabIndex={-1} ref={headingRef}>
          Ajustes
        </h2>
        <p>Configura las preferencias del asistente y del modelo de lenguaje.</p>
      </header>

      <div className="view-content view-content--form">
        <form className="settings-form">
          <fieldset>
            <legend>Preferencias de conversación</legend>
            <label className="form-field">
              Tono de respuesta
              <select>
                <option value="amigable">Amigable</option>
                <option value="profesional">Profesional</option>
                <option value="entusiasta">Entusiasta</option>
              </select>
            </label>

            <label className="form-field">
              Longitud sugerida de respuesta
              <input type="range" min="1" max="3" defaultValue="2" aria-label="Selecciona la longitud de respuesta" />
            </label>
          </fieldset>

          <fieldset>
            <legend>Modelo</legend>
            <label className="form-field">
              Nombre del modelo
              <input type="text" placeholder="Ej: llama-3-8b-instruct" />
            </label>

            <label className="form-field form-field--inline">
              <input type="checkbox" defaultChecked />
              <span>Habilitar contexto de la conversación</span>
            </label>
          </fieldset>

          <button type="submit" className="primary-button">Guardar cambios</button>
        </form>
      </div>
    </section>
  );
};

export default SettingsView;

