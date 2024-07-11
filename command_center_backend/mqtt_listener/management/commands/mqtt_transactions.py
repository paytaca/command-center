
from django.db import transaction
# import psycopg2
# from psycopg2.extras import RealDictCursor
import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime
# from decouple import config
from mqtt_listener.models import Transaction, Tx_Counter

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("transactions/#")


# Database connection parameters
# DB_HOST = "localhost"
# DB_NAME = "paytaca-cc-db"
# DB_USER = config('DB_USER')
# DB_PASSWORD = config('DB_PASSWORD')
# DB_PORT = "5432"

# Function to save message to PostgreSQL
def save_message_to_db(topic, payload):
    # conn = None
    try:
        # Create and save the transaction
        payload_dict = json.loads(payload)
        Transaction.objects.create(
            token=payload_dict['token'],
            txid=payload_dict['txid'],
            recipient=payload_dict['recipient'],
            decimals=payload_dict['decimals'],
            value=payload_dict['value'],
            received_at=datetime.now()  # Assuming 'received_at' is auto added; otherwise, remove this
        )
        # Use a transaction block to ensure atomicity
        with transaction.atomic():
            today = datetime.now().date()
            counter, created = Tx_Counter.objects.select_for_update().get_or_create(date=today)
            if not created:
                counter.count += 1
            else:
                counter.count = 1
            counter.save()

    except Exception as error:
        print(error)
        return

    #     conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    #     cur = conn.cursor()

    #     # Assuming payload_dict is correctly formed and sanitized
    #     payload_dict = json.loads(payload)
    #     insert_query = """
    #     INSERT INTO mqtt_listener_transaction (token, txid, recipient, decimals, value, received_at) 
    #     VALUES (%s, %s, %s, %s, %s, NOW())
    #     """
    #     data_tuple = (
    #         payload_dict['token'],
    #         payload_dict['txid'],
    #         payload_dict['recipient'],
    #         payload_dict['decimals'],
    #         payload_dict['value']
    #     )
    #     cur.execute(insert_query, data_tuple)
    #     conn.commit()

    #     today = datetime.now().date()
    #     # Start a transaction block for atomicity
    #     conn.autocommit = False
    #     cur.execute("SELECT count FROM mqtt_listener_tx_counter WHERE date = %s FOR UPDATE", (today,))
    #     row = cur.fetchone()
    #     if row:
    #         count = row[0] + 1  
    #         cur.execute("UPDATE mqtt_listener_tx_counter SET count = %s WHERE date = %s", (count, today))
    #     else:
    #         cur.execute("INSERT INTO mqtt_listener_tx_counter (count, date) VALUES (1, %s)", (today,))
    #     conn.commit()
    #     conn.autocommit = True  # Reset autocommit to True
    #     cur.close()
    # except (Exception, psycopg2.DatabaseError) as error:
    #     print(error)
    #     if conn:
    #         conn.rollback()  # Rollback in case of error
    # finally:
    #     if conn is not None:
    #         conn.close()

# Modify the on_message callback to save messages to the database
def on_message(client, userdata, msg):
    print(f"Received message '{msg.payload.decode()}' on topic '{msg.topic}'")
    save_message_to_db(msg.topic, msg.payload.decode())

FIRST_RECONNECT_DELAY = 1
RECONNECT_RATE = 2
MAX_RECONNECT_COUNT = 12
MAX_RECONNECT_DELAY = 60

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

_timestamp = str(int(time.time()))
client = mqtt.Client(transport='websockets', client_id="local101-" + _timestamp, clean_session=False)
client.tls_set()

client.on_connect = on_connect
client.on_message = on_message
client.on_disconnect = on_disconnect

mqtt_broker_url = 'mqtt.watchtower.cash'
client.connect(mqtt_broker_url, 443, 60)
client.loop_forever()
