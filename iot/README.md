# IoT - Sensores Biomédicos

Lectura de signos vitales mediante Raspberry Pi 4 + sensores biomédicos.

## Sensores

- **MAX30102**: frecuencia cardíaca (HR) y saturación de oxígeno (SpO2)
- **AD8232 + ADS1115**: electrocardiograma (ECG)

## Setup

```bash
python3 -m venv ~/venv --system-site-packages
source ~/venv/bin/activate
pip install -r requirements.txt
```

## Ejecutar

```bash
python3 src/main.py
```

## Estructura

- `src/sensors/`: drivers y scripts de prueba individuales por sensor
- `src/main.py`: combina la lectura de todos los sensores
