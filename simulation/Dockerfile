# Imagen del simulador. No incluye la base de datos: esa la pone docker-compose.
FROM python:3.12-slim

# Sin .pyc y con salida sin buffer, para que los logs se vean en tiempo real.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Las dependencias se copian primero y solas: asi Docker reutiliza esta capa
# mientras no cambie requirements.txt, y reconstruir tras editar el modelo
# tarda segundos en vez de minutos.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY pyproject.toml ./
COPY src/ ./src/
COPY db/ ./db/
COPY config/ ./config/

RUN pip install --no-cache-dir --no-deps -e . \
    && mkdir -p /app/salidas

# Se corre como usuario sin privilegios. Si se monta ./salidas desde el equipo
# anfitrion y aparece un error de permisos, la solucion es crear la carpeta
# antes de levantar el compose: mkdir -p salidas
RUN useradd --create-home --uid 1000 siappc \
    && chown -R siappc:siappc /app
USER siappc

ENTRYPOINT ["siappc"]
CMD ["--help"]
