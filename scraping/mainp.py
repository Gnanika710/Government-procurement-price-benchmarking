import time
from test import scrape_product_details_builder_mart
from google import scrape_product_details_google
import json

# Prompt the user for input
print("Enter item name:")
item_name = input().strip()
print("Enter manufacturer (optional):")
seller = input().strip() or None
print("Enter model (optional):")
model = input().strip() or None

# Scrape the product details from both sources
# result_json1 = scrape_product_details_builder_mart(item_name, seller, model)
start_time = time.perf_counter()
result_json2 = scrape_product_details_google(item_name, seller, model)

# Convert the JSON strings to Python lists
# result_list1 = json.loads(result_json1) if result_json1 else []
# result_list2 = json.loads(result_json2) if result_json2 else []

# Combine the two lists
# combined_results = result_list1 + result_list2

# # Convert the combined list back to a JSON string
# combined_json = json.dumps(combined_results, indent=4, ensure_ascii=False)

# Print the combined results
# print(combined_json)

print(result_json2)
end_time = time.perf_counter()
processing_time = end_time - start_time
print(f"Processing Time: {processing_time:.2f} seconds")