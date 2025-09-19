// ejercicio5.js (versión robusta)
(function () {
  // Genera un XPath simple y único (usa id si existe)
  function getXPath(element) {
    if (!element) return '';
    if (element.nodeType === Node.TEXT_NODE) element = element.parentNode;
    if (!element) return '';

    if (element.id) return "//*[@id='" + element.id + "']";

    const parts = [];
    while (element && element.nodeType === 1) {
      let index = 1;
      let sibling = element.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) index++;
        sibling = sibling.previousSibling;
      }
      parts.unshift(element.nodeName.toLowerCase() + '[' + index + ']');
      element = element.parentNode;
      if (element && element.nodeType === Node.DOCUMENT_NODE) break;
    }
    return '/' + parts.join('/');
  }

  function showXPath(xpath) {
    alert("XPath: " + xpath);
    const p = document.getElementById('xpathConsole');
    if (p) p.textContent = "El xpath es -> " + xpath;
  }

  // Listener para el documento principal (ignora clicks que vengan de iframes)
  document.addEventListener('click', function (event) {
    if (event.target.ownerDocument !== document) return; // ignorar clicks dentro de iframes
    const xpath = getXPath(event.target);
    showXPath(xpath);
  }, true);

  // Al cargar la página intentamos "arreglar" el iframe y añadir listeners dentro
  window.addEventListener('DOMContentLoaded', function () {
    const iframe = document.getElementById('myIframe');
    if (!iframe) return;

    // Intento: si el src es data:..., extraer su HTML y asignarlo a srcdoc (será same-origin)
    try {
      const src = iframe.getAttribute('src') || '';
      if (src.startsWith('data:')) {
        const comma = src.indexOf(',');
        if (comma !== -1) {
          const data = src.substring(comma + 1);
          let html;
          try {
            html = decodeURIComponent(data);
          } catch (e) {
            // si es base64
            if (src.includes(';base64,')) {
              const b64 = src.split(';base64,')[1];
              html = atob(b64);
            } else {
              html = data; // último recurso
            }
          }
          // ponemos srcdoc con el HTML decodificado (esto evita el origen opaco)
          iframe.srcdoc = html;
          iframe.removeAttribute('src');
        }
      }
    } catch (err) {
      console.warn('No se pudo convertir data: a srcdoc:', err);
      // seguimos; el siguiente load listener intentará igualmente acceder
    }

    // Cuando el iframe termine de cargar, intentamos enganchar listeners dentro
    iframe.addEventListener('load', function () {
      try {
        const idoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!idoc) throw new Error('No se puede obtener document del iframe');

        // Listener general dentro del iframe
        idoc.addEventListener('click', function (evt) {
          const xpathInside = getXPath(evt.target);
          const iframeXPath = getXPath(iframe); // path en el documento padre hacia el iframe
          const final = iframeXPath + xpathInside; // ejemplo: /html/body/iframe[1]/html/body/button[1]
          showXPath(final);
        }, true);

        // Listener directo al botón si existe (opcional)
        const btn = idoc.getElementById('iframeButton');
        if (btn) {
          btn.addEventListener('click', function (e) {
            const xpathInside = getXPath(e.target);
            const iframeXPath = getXPath(iframe);
            showXPath(iframeXPath + xpathInside);
          }, true);
        }
      } catch (err) {
        // Si no podemos (cross-origin u otro), damos fallback
        console.warn('No se pudo acceder al contenido del iframe:', err);
        iframe.addEventListener('click', function () {
          alert('Click detectado en el iframe, pero no puedo leer su contenido por políticas de origen.\nPara obtener el XPath dentro del iframe debes usar srcdoc o un archivo HTML del mismo origen.');
          const p = document.getElementById('xpathConsole');
          if (p) p.textContent = 'El xpath es -> (no accesible: cross-origin)';
        });
      }
    });
  });
})();
