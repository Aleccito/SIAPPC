#!/usr/bin/env sh
#
# Genera la CA y los certificados de DESARROLLO del broker MQTT.
#
#   sh infra/mosquitto/gen-certs.sh
#
# No hay CA real en el proyecto, así que se crea una propia y con ella se firma
# el certificado del broker. Todo queda en `infra/mosquitto/certs/`, que está en
# .gitignore: nada de esto se commitea y regenerarlo cuesta un segundo.
#
# NO USAR EN PRODUCCIÓN. Ahí va un certificado de una CA de verdad
# (Let's Encrypt o la CA interna del hospital) y la clave privada no se genera
# con un script del repo.
#
# El certificado del broker se emite para los nombres por los que se le llama:
# `mosquitto` desde la red de Compose y `localhost`/`127.0.0.1` desde el host.
# Si la Raspberry lo alcanza por la IP de la red, hay que añadirla:
#
#   MQTT_EXTRA_SANS="IP:192.168.1.50" sh infra/mosquitto/gen-certs.sh
#
# (varios valores separados por coma, con prefijo `IP:` o `DNS:`). Sin ese SAN
# la Pi rechaza el certificado, que es justo lo que debe pasar.

set -eu

# Git Bash reescribe los argumentos que empiezan por "/" como rutas de Windows
# y destroza los -subj. En Linux y macOS estas variables no hacen nada.
MSYS_NO_PATHCONV=1
MSYS2_ARG_CONV_EXCL="*"
export MSYS_NO_PATHCONV MSYS2_ARG_CONV_EXCL

cd "$(dirname "$0")"
CERTS=certs
DAYS_CA=3650
DAYS_LEAF=825

SANS="DNS:mosquitto,DNS:localhost,DNS:host.docker.internal,IP:127.0.0.1"
if [ -n "${MQTT_EXTRA_SANS:-}" ]; then
  SANS="$SANS,$MQTT_EXTRA_SANS"
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "Falta openssl. En Windows, ejecuta este script desde Git Bash." >&2
  exit 1
fi

mkdir -p "$CERTS"

echo "==> CA de desarrollo"
openssl req -x509 -nodes -newkey rsa:2048 -sha256 -days "$DAYS_CA" \
  -keyout "$CERTS/ca.key" -out "$CERTS/ca.crt" \
  -subj "/CN=SIAPPC Dev CA/O=SIAPPC" \
  -addext "basicConstraints=critical,CA:TRUE,pathlen:0" \
  -addext "keyUsage=critical,keyCertSign,cRLSign"

echo "==> Certificado del broker  ($SANS)"
openssl req -nodes -newkey rsa:2048 -sha256 \
  -keyout "$CERTS/server.key" -out "$CERTS/server.csr" \
  -subj "/CN=mosquitto/O=SIAPPC"

cat > "$CERTS/ext.cnf" <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=serverAuth
subjectAltName=$SANS
EOF

openssl x509 -req -in "$CERTS/server.csr" -days "$DAYS_LEAF" -sha256 \
  -CA "$CERTS/ca.crt" -CAkey "$CERTS/ca.key" -CAcreateserial \
  -extfile "$CERTS/ext.cnf" -out "$CERTS/server.crt"

echo "==> Certificado de cliente (opcional, solo si se activa mTLS)"
openssl req -nodes -newkey rsa:2048 -sha256 \
  -keyout "$CERTS/client.key" -out "$CERTS/client.csr" \
  -subj "/CN=siappc-client/O=SIAPPC"

cat > "$CERTS/ext.cnf" <<EOF
basicConstraints=critical,CA:FALSE
keyUsage=critical,digitalSignature,keyEncipherment
extendedKeyUsage=clientAuth
EOF

openssl x509 -req -in "$CERTS/client.csr" -days "$DAYS_LEAF" -sha256 \
  -CA "$CERTS/ca.crt" -CAkey "$CERTS/ca.key" -CAcreateserial \
  -extfile "$CERTS/ext.cnf" -out "$CERTS/client.crt"

rm -f "$CERTS"/*.csr "$CERTS/ext.cnf"

# La clave del broker la lee el proceso mosquitto dentro del contenedor, con
# otro uid que el dueño del archivo en el host: sin permiso de lectura para
# todos, el broker no arranca en Linux. Es aceptable porque son certificados de
# desarrollo; la clave de la CA sí se queda privada.
chmod 644 "$CERTS/server.key" "$CERTS/client.key" 2>/dev/null || true
chmod 600 "$CERTS/ca.key" 2>/dev/null || true

echo
echo "Listo. En infra/mosquitto/certs/:"
echo "  ca.crt      CA de desarrollo — la necesitan el backend y la Pi"
echo "  server.*    certificado del broker"
echo "  client.*    certificado de cliente, sin uso mientras no se active mTLS"
echo
echo "Para la Raspberry: copia ca.crt a iot/certs/ca.crt en la Pi."
