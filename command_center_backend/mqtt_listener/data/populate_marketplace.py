import csv
import random
from datetime import datetime, timedelta

# Define the data structure
riders = []
orders = []
male_names = ['Euvan', 'Melben', 'Marelden', 'Angelo', 'William']
female_names = ['Sheena', 'Aiah', 'Maloi', 'Colet', 'Gwen']

# Populate Riders
for i in range(1, 11):
    if random.choice([True, False]):
        name = random.choice(male_names)
    else:
        name = random.choice(female_names)

    riders.append({
        'rider_id': i,
        'name': name
    })

# Helper function to generate random datetime
def random_datetime(start, end):
    return start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

# Populate Orders
start_date = datetime(2024, 6, 18)
end_date = datetime(2024, 7, 26)

for i in range(1, 51):
    order_time = random_datetime(start_date, end_date)
    delivered_time = order_time + timedelta(minutes=random.randint(20, 90))
    total_amount = round(random.uniform(50.0, 1000.0), 2)
    revenue = round(total_amount * 0.09, 2)
    delivery_fee = 30.0

    orders.append({
        'order_id': i,
        'total_amount': total_amount,
        'revenue': revenue,
        'order_time': order_time,
        'delivered_time': delivered_time,
        'delivery_fee': delivery_fee,
        'date': order_time.date(),
        'merchant_id': random.randint(1, 71),
        'rider_id': random.randint(1, 10)
    })

# Write Riders to CSV
with open('riders.csv', 'w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=['rider_id', 'name'], quotechar='"', quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for rider in riders:
        writer.writerow(rider)

# Write Orders to CSV
with open('orders.csv', 'w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=[
        'order_id', 'total_amount', 'revenue', 'order_time', 'delivered_time', 'delivery_fee', 'date', 'merchant_id', 'rider_id'
    ], quotechar='"', quoting=csv.QUOTE_ALL)
    writer.writeheader()
    for order in orders:
        writer.writerow(order)
