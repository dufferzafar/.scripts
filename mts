#!/usr/bin/env python3

import requests
import pyquery

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

# Print out details
print("""
Balance: %s

Expiry Date: %s """ % (data, expiry)
)
