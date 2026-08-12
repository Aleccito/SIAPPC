#!/usr/bin/env sh
#
# Corre el plan de carga en un contenedor: no hace falta Java ni JMeter
# instalados en la máquina.
#
#   sh Pruebas/jmeter/correr.sh                  50 usuarios, 60 s
#   USUARIOS=200 DURACION=120 sh .../correr.sh   otra carga
#
# El backend tiene que estar arriba (docker compose up -d). El contenedor de
# JMeter entra a la red de Compose y llama al backend por su nombre de servicio,
# así la medición no pasa por el reenvío de puertos de Docker Desktop, que en
# Windows añade latencia propia y ensuciaría los números.
#
# ADVERTENCIA sobre los resultados: generador de carga, backend y base de datos
# comparten la CPU de esta máquina. Los números sirven para COMPARAR endpoints
# entre sí y para ver si la caché ayuda; no son la capacidad de un despliegue
# real, donde cada pieza tiene su propio servidor.

set -eu

# Git Bash reescribe cualquier argumento que empiece por "/" como ruta de
# Windows y rompe las rutas DENTRO del contenedor (-w, -t, -l). En Linux y
# macOS estas variables no hacen nada.
MSYS_NO_PATHCONV=1
MSYS2_ARG_CONV_EXCL="*"
export MSYS_NO_PATHCONV MSYS2_ARG_CONV_EXCL

AQUI=$(cd "$(dirname "$0")" && pwd)
RAIZ=$(cd "$AQUI/../.." && pwd)
SALIDA="$AQUI/../reportes/jmeter"

USUARIOS=${USUARIOS:-50}
RAMPA=${RAMPA:-20}
DURACION=${DURACION:-60}
IMAGEN=${IMAGEN:-justb4/jmeter:5.5}

# La red que crea Compose a partir del nombre de la carpeta del proyecto.
RED=${RED:-siappc_default}

# El reporte HTML exige un directorio vacío o inexistente.
rm -rf "$SALIDA"
mkdir -p "$SALIDA"

echo "Carga: $USUARIOS usuarios, rampa ${RAMPA}s, duración ${DURACION}s"
echo "Contra: backend:3001 (red $RED)"
echo

docker run --rm \
  --network "$RED" \
  -v "$RAIZ/Pruebas:/pruebas" \
  -w /pruebas \
  "$IMAGEN" \
  -n -t /pruebas/jmeter/siappc-carga.jmx \
  -Jhost=backend -Jport=3001 \
  -Jusuarios="$USUARIOS" -Jrampa="$RAMPA" -Jduracion="$DURACION" \
  -l /pruebas/reportes/jmeter/resultados.jtl \
  -e -o /pruebas/reportes/jmeter/html

echo
echo "Reporte HTML: Pruebas/reportes/jmeter/html/index.html"
echo "Resultados crudos: Pruebas/reportes/jmeter/resultados.jtl"
