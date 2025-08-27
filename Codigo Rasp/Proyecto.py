import time
import ssl
from datetime import datetime, timezone
import RPi.GPIO as GPIO
from gpiozero import DistanceSensor, Servo
from RPLCD.i2c import CharLCD
import adafruit_dht, board
from pymongo import MongoClient
import paho.mqtt.client as mqtt
from paho.mqtt.client import CallbackAPIVersion
import dns.resolver

# ========== Pines ==========
GPIO_TRIG = 4
GPIO_ECHO = 17
GPIO_SOIL_DO = 21
GPIO_SERVO = 27
GPIO_BUZZ = 22
LCD_ADDR = 0x27

GPIO_Led1 = 5
GPIO_Led2 = 6
GPIO_Led3 = 13           
GPIO_Bombadeagua = 10    

GPIO_AlarmaR = 9         
GPIO_AlarmaA = 11        
GPIO_AZUL = 18           
GPIO_ROJO = 15           
GPIO_VERDE = 14        

GPIO.setmode(GPIO.BCM)
#Problema de dns
resolver = dns.resolver.Resolver(configure=False)
resolver.timeout = 3
resolver.lifetime = 5
resolver.nameservers = ["8.8.8.8", "1.1.1.1"]  # Google + Cloudflare
dns.resolver.default_resolver = resolver

# === RGB por PWM ===
RGB_FREQ = 1000  
COMMON_ANODE = False  

# ========== MQTT (HiveMQ Cloud) ==========
MQTT_HOST = "332362e6e921400e87b8124f8bfc0546.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USER = "Arqui1"
MQTT_PASS = "Pass1234"
CLIENT_ID  = "raspi-casainteligente-main"

TOPIC_ILUM = "/ilumination"   
TOPIC_ENTR = "/entrance"      
TOPIC_ALERT= "/alerts"        

# ========== MongoDB (por categoría) ==========
MONGO_URL = "mongodb+srv://Arqui1:pass123@cluster0.pij2euq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo = MongoClient(MONGO_URL)
db = mongo.get_database("Arqui1")

col_temp = db.get_collection("Temperatura")   
col_rieg = db.get_collection("Riego")      
col_ilum = db.get_collection("Iluminacion")  
col_vent = db.get_collection("Ventilacion")   
col_entr = db.get_collection("Entrada")      
col_mov  = db.get_collection("Movimiento")   
col_alarm= db.get_collection("Alarmas")      

# ========== GPIO Setup ==========

GPIO.setwarnings(False)
GPIO.setup(GPIO_SOIL_DO, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) 
GPIO.setmode(GPIO.BCM)
for p in [GPIO_Led1, GPIO_Led2, GPIO_Led3, GPIO_Bombadeagua, GPIO_AlarmaR, GPIO_AlarmaA, GPIO_AZUL, GPIO_ROJO, GPIO_VERDE, GPIO_BUZZ]:
    GPIO.setup(p, GPIO.OUT, initial=GPIO.LOW)

# Inicializar PWM después de configurar los pines como salida
pwmR = GPIO.PWM(GPIO_ROJO,  RGB_FREQ)
pwmG = GPIO.PWM(GPIO_VERDE, RGB_FREQ)
pwmB = GPIO.PWM(GPIO_AZUL,  RGB_FREQ)
# Inicia apagados
pwmR.start(0)
pwmG.start(0)
pwmB.start(0)

# Bomba activa en HIGH
BOMBA_ACTIVE_HIGH = True

# ========== Dispositivos ==========
lcd = CharLCD('PCF8574', LCD_ADDR, cols=16, rows=2)
ultra = DistanceSensor(echo=GPIO_ECHO, trigger=GPIO_TRIG, max_distance=4.0, threshold_distance=0.10)
servo = Servo(GPIO_SERVO, min_pulse_width=0.0005, max_pulse_width=0.0025)
dht = adafruit_dht.DHT11(board.D26)  # DHT en GPIO26 (board.D26)

# ========== Estado & Timers ==========
t_last_lcd = 0.0
t_last_temp_log = 0.0
t_last_soil_log = 0.0
LCD_ROT = 5.0
LOG_TEMP_EVERY = 300.0  # 5 min
LOG_SOIL_EVERY = 420.0  # 7 min

alarma_activa = False
rgb_state = False

# ========== Utilidades ==========
def now_iso():
    return datetime.now(timezone.utc).isoformat()

def lcd2(l1="", l2=""):
    lcd.clear()
    lcd.write_string(l1[:16])
    lcd.cursor_pos = (1, 0)
    lcd.write_string(l2[:16])

def buzzer(ms=120):
    GPIO.output(GPIO_BUZZ, GPIO.HIGH)
    time.sleep(ms/100.0)
    GPIO.output(GPIO_BUZZ, GPIO.LOW)

def set_bomba(on: bool, motivo="auto"):
    GPIO.output(GPIO_Bombadeagua, GPIO.HIGH if on and BOMBA_ACTIVE_HIGH else GPIO.LOW)
    col_rieg.insert_one({"ts": now_iso(), "evento": "BOMBA_ON" if on else "BOMBA_OFF", "motivo": motivo})
    lcd2("Riego:", "ON" if on else "OFF")

def set_ventilador(on: bool, motivo="auto"):
    GPIO.output(GPIO_Led3, GPIO.HIGH if on else GPIO.LOW)
    col_vent.insert_one({"ts": now_iso(), "evento": "VENT_ON" if on else "VENT_OFF", "motivo": motivo})

def _to_duty(v255: int) -> float:

    v = max(0, min(255, v255))
    duty = (v / 255.0) * 100.0
    return 100.0 - duty if COMMON_ANODE else duty

def set_rgb_values(r: int, g: int, b: int):
    pwmR.ChangeDutyCycle(_to_duty(r))
    pwmG.ChangeDutyCycle(_to_duty(g))
    pwmB.ChangeDutyCycle(_to_duty(b))

def set_rgb_off():
    set_rgb_values(0, 0, 0)

def soil_seco():
    # DO habitual: HIGH=SECO, LOW=HÚMEDO
    return GPIO.input(GPIO_SOIL_DO) == GPIO.HIGH

def leer_dht():
    try:
        t = dht.temperature
        h = dht.humidity
        if t is None or h is None:
            raise RuntimeError("DHT None")
        return (float(t), float(h))
    except Exception:
        return (None, None)

def log_temp_periodico():
    global t_last_temp_log
    if time.time() - t_last_temp_log >= LOG_TEMP_EVERY:
        t, h = leer_dht()
        if t is not None and h is not None:
            col_temp.insert_one({"ts": now_iso(), "temperature": t, "humidity": h})
        t_last_temp_log = time.time()

def log_suelo_periodico():
    global t_last_soil_log
    if time.time() - t_last_soil_log >= LOG_SOIL_EVERY:
        col_rieg.insert_one({"ts": now_iso(), "tipo": "suelo_lectura", "estado": "SECO" if soil_seco() else "HUMEDO"})
        t_last_soil_log = time.time()

# ========== Lógicas ==========
def logica_riego():
    # Con DO no hay %, interpretamos SECO = activar breve y cortar por seguridad
    if soil_seco():
        if GPIO.input(GPIO_Bombadeagua) == GPIO.LOW:
            set_bomba(True, "auto_suelo_seco")
            col_rieg.insert_one({"ts": now_iso(), "tipo": "bomba_activada", "lectura": "SECO"})
        time.sleep(2.0)
        set_bomba(False, "auto_seguridad")
    else:
        if GPIO.input(GPIO_Bombadeagua) == GPIO.HIGH:
            set_bomba(False, "auto_suelo_humedo")

def logica_alarma_temp(mqtt_client: mqtt.Client):
    global alarma_activa, rgb_state
    t, h = leer_dht()
    if t is None:
        return

    # ======= SOLO ALARMA por temperatura =======
    if t > 27.0:
        if not alarma_activa:
            alarma_activa = True
            col_alarm.insert_one({"ts": now_iso(), "evento": "ALARM_ON", "temperature": t})
            mqtt_client.publish(TOPIC_ALERT, f"ALERTA: Temp {t:.1f}C > 27C")

        # beep corto + alternar luces de alarma (R/A) – NO usamos el RGB aquí
        buzzer(150)
        rgb_state = not rgb_state  # reutilizamos el flag para alternar
        if rgb_state:
            GPIO.output(GPIO_AlarmaR, GPIO.HIGH)
            GPIO.output(GPIO_AlarmaA, GPIO.LOW)
        else:
            GPIO.output(GPIO_AlarmaR, GPIO.LOW)
            GPIO.output(GPIO_AlarmaA, GPIO.HIGH)
    else:
        if alarma_activa:
            alarma_activa = False
            col_alarm.insert_one({"ts": now_iso(), "evento": "ALARM_OFF", "temperature": t})
        # Apagar luces de alarma
        GPIO.output(GPIO_AlarmaR, GPIO.LOW)
        GPIO.output(GPIO_AlarmaA, GPIO.LOW)


def refrescar_lcd():
    # Alterna entre 3 pantallas
    static = getattr(refrescar_lcd, "_idx", 0)
    if static == 0:
        lcd2("Iluminacion:", "AUTO por US")
    elif static == 1:
        t, h = leer_dht()
        if t is not None and h is not None:
            lcd2(f"Temp:{t:>4.1f}C", f"Humed:{h:>4.1f}%")
        else:
            lcd2("DHT11", "Reintentando...")
    else:
        lcd2("Suelo:", "SECO" if soil_seco() else "HUMEDO")
    refrescar_lcd._idx = (static + 1) % 3

# ========== Ultrasonico → SOLO Iluminación ==========
def luces_auto_on():
    # Enciende habitación 1 y 2 cuando hay presencia
    GPIO.output(GPIO_Led1, GPIO.HIGH)
    GPIO.output(GPIO_Led2, GPIO.HIGH)
    GPIO.output(GPIO_Led3, GPIO.HIGH)
    col_ilum.insert_one({"ts": now_iso(), "room": "room1", "on": True, "origen": "ultrasonico"})
    col_ilum.insert_one({"ts": now_iso(), "room": "room2", "on": True, "origen": "ultrasonico"})
    col_mov.insert_one({"ts": now_iso(), "evento": "PRESENCIA_ON"})

def luces_auto_off():
    # Apaga habitación 1 y 2 cuando no hay presencia
    GPIO.output(GPIO_Led1, GPIO.LOW)
    GPIO.output(GPIO_Led2, GPIO.LOW)
    GPIO.output(GPIO_Led3, GPIO.LOW)
    col_ilum.insert_one({"ts": now_iso(), "room": "room1", "on": False, "origen": "ultrasonico"})
    col_ilum.insert_one({"ts": now_iso(), "room": "room2", "on": False, "origen": "ultrasonico"})
    col_mov.insert_one({"ts": now_iso(), "evento": "PRESENCIA_OFF"})

ultra.when_in_range = luces_auto_on
ultra.when_out_of_range = luces_auto_off

# ========== MQTT Callbacks ==========
def on_connect(client, userdata, flags, reason_code, properties):
    code = getattr(reason_code, "value", reason_code)
    print(f"[MQTT] on_connect rc={code}")
    if code == 0:
        client.subscribe(TOPIC_ILUM)
        client.subscribe(TOPIC_ENTR)
        print(f"[MQTT] Subscribed: {TOPIC_ILUM}, {TOPIC_ENTR}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode().strip()
    top = msg.topic
    print(f"[MQTT] {top}: {payload}")

    # /entrance → "open"/"close" (sólo por MQTT)
    if top == TOPIC_ENTR:
        if payload.lower() == "open":
            servo.max()
            col_entr.insert_one({"ts": now_iso(), "evento": "PORTON_OPEN", "origen": "mqtt"})
            lcd2("Porton:", "ABIERTO")
        elif payload.lower() == "close":
            servo.min()
            col_entr.insert_one({"ts": now_iso(), "evento": "PORTON_CLOSE", "origen": "mqtt"})
            lcd2("Porton:", "CERRADO")

    # /ilumination → room1 on/off | room2 on/off | rgb r,g,b
    elif top == TOPIC_ILUM:
        pl = payload.lower()
        nowdoc = {"ts": now_iso(), "origen": "mqtt"}
        if pl.startswith("room1"):
            on = "on" in pl
            GPIO.output(GPIO_Led1, GPIO.HIGH if on else GPIO.LOW)
            lcd2("Habitacion 1", "ENCENDIDA" if on else "APAGADA")
            col_ilum.insert_one({**nowdoc, "room": "room1", "on": on})
        elif pl.startswith("room2"):
            on = "on" in pl
            GPIO.output(GPIO_Led2, GPIO.HIGH if on else GPIO.LOW)
            lcd2("Habitacion 2", "ENCENDIDA" if on else "APAGADA")
            col_ilum.insert_one({**nowdoc, "room": "room2", "on": on})
        elif pl.startswith("room3"):
            on = "on" in pl
            GPIO.output(GPIO_Led3, GPIO.HIGH if on else GPIO.LOW)
            lcd2("Habitacion 3", "ENCENDIDA" if on else "APAGADA")
            col_ilum.insert_one({**nowdoc, "room": "room3", "on": on})
        elif pl.startswith("rgb"):
            try:
                _, vals = payload.split(None, 1) if " " in payload else payload.split(":", 1)
                r, g, b = [int(x) for x in vals.replace(" ", "").split(",")]
                set_rgb_values(r, g, b)  # PWM 0..255 en cada canal
                col_ilum.insert_one({**nowdoc, "rgb": [r, g, b]})
                lcd2("RGB:", f"{r},{g},{b}")
            except Exception as e:
                print("RGB payload invalido:", e)


def build_mqtt_client():
    client = mqtt.Client(
        client_id=CLIENT_ID,
        protocol=mqtt.MQTTv311,
        callback_api_version=CallbackAPIVersion.VERSION2
    )
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    ctx = ssl.create_default_context()
    ctx.check_hostname = True
    ctx.verify_mode = ssl.CERT_REQUIRED
    client.tls_set_context(ctx)
    client.on_connect = on_connect
    client.on_message = on_message
    return client

# ========== Inicio ==========
lcd2("Sistema listo", "Esperando...")

mqtt_client = build_mqtt_client()
mqtt_client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
mqtt_client.loop_start()

try:
    while True:
        # Rotación LCD
        if time.time() - t_last_lcd >= LCD_ROT:
            refrescar_lcd()
            t_last_lcd = time.time()

        # Lógicas
        logica_riego()
        logica_alarma_temp(mqtt_client)

        # Logs periódicos
        log_temp_periodico()
        log_suelo_periodico()

        time.sleep(0.2)

except KeyboardInterrupt:
    pass
finally:
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    set_bomba(False, "shutdown")
    set_ventilador(False, "shutdown")
    set_rgb_off()
    GPIO.output(GPIO_Led1, GPIO.LOW)
    GPIO.output(GPIO_Led2, GPIO.LOW)
    GPIO.output(GPIO_Led3, GPIO.LOW)
    GPIO.output(GPIO_AlarmaR, GPIO.LOW)
    GPIO.output(GPIO_AlarmaA, GPIO.LOW)
    GPIO.output(GPIO_BUZZ, GPIO.LOW)
    pwmR.stop()
    pwmG.stop()
    pwmB.stop()
    lcd2("Saliendo...", "")
    time.sleep(0.5)
    GPIO.cleanup()
