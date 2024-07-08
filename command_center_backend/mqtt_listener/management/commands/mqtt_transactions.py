
import psycopg2
from psycopg2.extras import RealDictCursor
import paho.mqtt.client as mqtt
import json
import time
from decouple import config

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("transactions/#")


# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "paytaca-cc-db"
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_PORT = "5432"

# Function to save message to PostgreSQL
def save_message_to_db(topic, payload):
    conn = None
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cur = conn.cursor()
        # Assuming `payload` is a JSON string that looks like the MQTT message you provided
        # First, convert the payload JSON string into a Python dictionary
        payload_dict = json.loads(payload)
        # Prepare the SQL INSERT statement with the new fields
        insert_query = """
        INSERT INTO mqtt_listener_transaction (token, txid, recipient, decimals, value, received_at) 
        VALUES (%s, %s, %s, %s, %s, NOW())
        """
        # Extract values from the payload dictionary
        data_tuple = (
            payload_dict['token'],
            payload_dict['txid'],
            payload_dict['recipient'],
            payload_dict['decimals'],
            payload_dict['value']
        )
        # Execute the INSERT statement
        cur.execute(insert_query, data_tuple)
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

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
