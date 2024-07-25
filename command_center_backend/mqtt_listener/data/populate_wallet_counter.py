import json
from datetime import datetime, timedelta

dir = 'command_center_backend/mqtt_listener/data/wallets.json'

# Load the JSON data
with open(dir, 'r') as file:
    wallets = json.load(file)

# Extract all dates from the data
dates = [datetime.strptime(wallet['created_at'], '%Y-%m-%d') for wallet in wallets]

# Determine the date range
start_date = min(dates)
end_date = max(dates)

# Create a dictionary to count wallets per date
date_counts = {start_date + timedelta(days=i): 0 for i in range((end_date - start_date).days + 1)}

# Count the wallets per date
for date in dates:
    date_counts[date] += 1

# Convert the dictionary to the desired JSON structure
result = [{"count": count, "date": date.strftime('%Y-%m-%d')} for date, count in date_counts.items()]

# Write the result to a new JSON file
with open('wallets_count.json', 'w') as file:
    json.dump(result, file, indent=4)
