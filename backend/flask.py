import sys
import json

# Deserialize the JSON string back to a Python object
products_json = sys.argv[1]
products = json.loads(products_json)

print(products[0]["name"])  # Accessing the first product's name
