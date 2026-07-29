# Estándar de Ramas

```
main   → versión estable 
dev    → integración de trabajo 
```

Todo cambio nace de `dev` y vuelve a `dev` vía Pull Request.

## Prefijos

| Prefijo | Uso | Ejemplo |
|---|---|---|
| `feature/` | Funcionalidad nueva | `feature/backend-endpoint-vitales` |
| `fix/` | Corrección de bug | `fix/frontend-login-error` |
| `docs/` | Solo documentación | `docs/iot-readme` |
| `refactor/` | Reordenar código sin cambiar comportamiento | `refactor/logica-alertas` |
| `chore/` | Configuración, dependencias, estructura | `chore/estructura-carpetas` |

## Formato

```
prefijo/modulo-descripcion-corta
```
Minúsculas, guiones, sin espacios. Ej: `feature/iot-sensor-max30102`
