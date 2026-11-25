// Imprime un pedazo de la pantalla (la hoja del paciente, la entrega de turno, la comparativa) en una ventana aparte
// con los mismos estilos: el navegador ofrece imprimir o guardar en PDF. Sin archivos ni servidor de por medio.
// Lo marcado con `data-no-imprimir` (botones, avisos) no sale en el papel.

const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function imprimirElemento(el: HTMLElement | null, titulo: string) {
  if (!el) return;
  const ventana = window.open('', '_blank', 'width=900,height=1000');
  // Con las ventanas emergentes bloqueadas, se imprime la pantalla entera.
  if (!ventana) {
    window.print();
    return;
  }
  const estilos = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((n) => n.outerHTML).join('\n');
  ventana.document.open();
  ventana.document.write(
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${escapar(titulo)}</title>${estilos}` +
      `<style>@page{margin:14mm}body{background:#fff;margin:0;padding:16px}[data-no-imprimir]{display:none!important}</style>` +
      `</head><body>${el.outerHTML}</body></html>`,
  );
  ventana.document.close();
  const lanzar = () => {
    ventana.focus();
    ventana.print();
  };
  // Un momento para que carguen las fuentes.
  if (ventana.document.readyState === 'complete') setTimeout(lanzar, 400);
  else ventana.addEventListener('load', () => setTimeout(lanzar, 400));
}
