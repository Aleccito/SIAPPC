import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ApiError } from './api/http';
import './index.css';

// Datos de src/api/ con caché (las mismas reglas que frontend/): no se reintenta lo que no va a
// cambiar al reintentar (sin sesión, sin permiso, no existe).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (count, error) => !(error instanceof ApiError && [400, 401, 403, 404].includes(error.status)) && count < 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
