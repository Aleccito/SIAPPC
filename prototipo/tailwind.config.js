module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			// Colores del diseño de Figma (SIAPPC · módulo médico).
			// Úsalos con su nombre: bg-primary, text-muted, border-line, bg-danger-soft…
			colors: {
				ink: { DEFAULT: '#0f172a', soft: '#1e293b', muted: '#475569' }, // texto principal, fondo del menú, texto de las pantallas de acceso
				surface: '#f8fafc', // fondo de la app
				line: '#e2e8f0', // bordes y separadores
				muted: '#64748b', // texto secundario
				subtle: '#94a3b8', // texto terciario, menú inactivo
				primary: { DEFAULT: '#2563eb', soft: '#eff6ff' },
				danger: { DEFAULT: '#ef4444', soft: '#fef2f2' },
				warning: { DEFAULT: '#f59e0b', soft: '#fef3c7' },
				success: { DEFAULT: '#10b981', soft: '#ecfdf5' },
			},
			fontFamily: {
				jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
				inter: ['Inter', 'system-ui', 'sans-serif'],
				geist: ['Geist', 'system-ui', 'sans-serif'],
			},
			width: {
				sidebar: '240px',
			},
			// Capas que flotan sobre la pantalla, de abajo arriba. Todas se dibujan en `body`
			// (portal), así que el número vale para toda la página y no solo dentro de un contenedor.
			// La lista desplegable va sobre la ventana porque se abre desde dentro de ella.
			zIndex: {
				drawer: '50', // menú lateral en pantallas angostas
				modal: '55', // ventanas y confirmaciones
				popover: '60', // listas desplegables y menús
				toast: '70', // avisos cortos
			},
		},
	},
	plugins: [],
}
