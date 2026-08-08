import sys
sys.path.append('sensors')

import max30102
import hrcalc
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import RPi.GPIO as GPIO
import time

# Inicializar MAX30102
hr_sensor = max30102.MAX30102(gpio_pin=17)

# Inicializar ADS1115
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c, address=0x48)
ecg_chan = AnalogIn(ads, 0)

print("Iniciando lectura combinada... (Ctrl+C para detener)")

try:
    while True:
        try:
            # Leer MAX30102 (amount=25 para no bloquear ~4s por vuelta)
            red, ir = hr_sensor.read_sequential(amount=25)
            hr, hr_valid, spo2, spo2_valid = hrcalc.calc_hr_and_spo2(ir, red)

            # Leer ADS1115 (ECG)
            ecg_voltage = ecg_chan.voltage

            # Armar el paquete de datos
            data = {
                "timestamp": time.time(),
                "hr": hr if hr_valid else None,
                "spo2": round(spo2, 2) if spo2_valid else None,
                "ecg": round(ecg_voltage, 3)
            }

            print(data)

        except OSError as e:
            print(f"Error de lectura I2C, reintentando: {e}")
            time.sleep(0.5)
            continue

except KeyboardInterrupt:
    print("\nDeteniendo lectura...")

finally:
    GPIO.cleanup()
