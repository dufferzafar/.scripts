#!/usr/bin/env python3

import requests
import pyquery

from datetime import date, datetime


# Yes, your password is sent as plain text
CREDENTIALS = dict(
    mdn="",
    passwd=""
)

r = requests.post(
    url='https://selfcare.mtsindia.in/index.html',
    data=CREDENTIALS
)

# Quick heuristic to ensure that login was successful
assert CREDENTIALS['mdn'] in r.text

# Find balance details
pq = pyquery.PyQuery(r.text)
t = pq('#fup_container > li:nth-child(2) > ul').text()

data = t[:t.find("MB")+2]
expiry = t[t.find("MB")+3:]

# Calculate suggested usage
expiry_date = datetime.strptime(expiry, "%d-%b-%Y %H:%M:%S").date()
days_left = (expiry_date - date.today()).days
suggested = int(data[:-3]) // days_left

# Print out details
output = """
Balance: %s

Expiry Date: %s

Suggested Usage: %d MB per day
"""

print(output % (data, expiry, suggested))
