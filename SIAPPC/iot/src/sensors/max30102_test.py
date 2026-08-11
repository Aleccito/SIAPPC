import max30102
import hrcalc
import time

sensor = max30102.MAX30102(gpio_pin=11)

while True:
    red, ir = sensor.read_sequential()
    hr, hr_valid, spo2, spo2_valid = hrcalc.calc_hr_and_spo2(ir, red)
    print(f"HR: {hr} ({hr_valid}) | SpO2: {spo2} ({spo2_valid})")
    time.sleep(1)
