from django.db import transaction
from datetime import timedelta
import pytz
from django.utils import timezone
import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime
from mqtt_listener.models import Transaction, Tx_Counter

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("transactions/#")
    ensure_transaction_counter() # Ensure there's a Tx_Counter for today

def round_down_time():
    now = timezone.now().astimezone(pytz.timezone('Asia/Manila'))
    return now - timedelta(minutes=now.minute % 30, seconds=now.second, microseconds=now.microsecond)

def save_message_to_db(topic, payload):
    try:
        payload_dict = json.loads(payload)
        Transaction.objects.create(
            token=payload_dict['token'],
            txid=payload_dict['txid'],
            recipient=payload_dict['recipient'],
            decimals=payload_dict['decimals'],
            value=payload_dict['value'],
            received_at=timezone.now()
        )
        with transaction.atomic():
            rounded_time = round_down_time()
            counter, created = Tx_Counter.objects.select_for_update().get_or_create(
                date=rounded_time.date(), time=rounded_time.time()
            )
            counter.count += 1
            counter.save()
    except Exception as error:
        print(error)

def ensure_transaction_counter ():
    with transaction.atomic():
        rounded_time = round_down_time()
        Tx_Counter.objects.get_or_create(date=rounded_time.date(), time=rounded_time.time())

def on_message(client, userdata, msg):
    print(f"Received message '{msg.payload.decode()}' on topic '{msg.topic}'")
    save_message_to_db(msg.topic, msg.payload.decode())

def on_disconnect(client, userdata, rc):
    print(f"Disconnected with result code: {rc}")
    reconnect_count, reconnect_delay = 0, FIRST_RECONNECT_DELAY
    while reconnect_count < MAX_RECONNECT_COUNT:
        print(f"Reconnecting in {reconnect_delay} seconds...")
        time.sleep(reconnect_delay)
        try:
            client.reconnect()
            print("Reconnected successfully!")
            return
        except Exception as err:
            print(f"{err}. Reconnect failed. Retrying...")
        reconnect_delay *= RECONNECT_RATE
        reconnect_delay = min(reconnect_delay, MAX_RECONNECT_DELAY)
        reconnect_count += 1
    print(f"Reconnect failed after {reconnect_count} attempts. Exiting...")

FIRST_RECONNECT_DELAY = 1
RECONNECT_RATE = 2
MAX_RECONNECT_COUNT = 12
MAX_RECONNECT_DELAY = 60

_timestamp = str(int(time.time()))
client = mqtt.Client(transport='websockets', client_id="local101-" + _timestamp, clean_session=False)
client.tls_set()

client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

mqtt_broker_url = 'mqtt.watchtower.cash'
client.connect(mqtt_broker_url, 443, 60)
ensure_transaction_counter()  # Ensure there's a Tx_Counter for today before entering the loop
client.loop_forever()