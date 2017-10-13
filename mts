#!/usr/bin/env python3

import requests
import pyquery

from datetime import date, datetime

# Disables all the 'Unverified HTTPS request is being made' warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Yes, your password is sent as plain text
CREDENTIALS = dict(
    mdn="",
    passwd=""
)

r = requests.post(
    url='https://selfcare.mtsindia.in/index.html',
    data=CREDENTIALS,
    verify=False,
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
days_left = (expiry_date - date.today()).days + 1
suggested = int(data[:-3]) // days_left

# Print out details
output = """
mts stats
---------

Balance: %s

Expiry Date: %s

Suggested Usage: %d MB per day
"""

print(output % (data, expiry, suggested))
