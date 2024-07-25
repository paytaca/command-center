import json
from datetime import datetime, timedelta
import random

# Define the date range
start_date = datetime(2024, 6, 18)
end_date = datetime(2024, 7, 25)

# Function to generate a list of dates within the given range
def generate_dates(start, end, num_dates):
    delta = end - start
    dates = [start + timedelta(days=random.randint(0, delta.days)) for _ in range(num_dates)]
    return sorted(dates)

# Number of entries to generate
num_entries = 100

# Generate sorted dates
sorted_dates = generate_dates(start_date, end_date, num_entries)

# Generate the list of dictionaries with sorted dates and sequential user_ids
data = []
for user_id, date in enumerate(sorted_dates, start=1):
    entry = {
        "user_id": user_id,
        "created_at": date.strftime('%Y-%m-%d')
    }
    data.append(entry)

# Write the data to a JSON file
with open('wallets.json', 'w') as f:
    json.dump(data, f, indent=4)
