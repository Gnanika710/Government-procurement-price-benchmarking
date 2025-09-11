from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from test import scrape_product_details_builder_mart
from google import scrape_product_details_google
from google_specs import scrape_product_details_google_specs
import json
from typing import List, Dict

app = FastAPI()

# Add CORS middleware to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Define the request body structure
class ItemRequest_form1(BaseModel):
    item_name: str
    seller: str = None
    model: str = None

class ItemRequest_form2(BaseModel):
    item_name: str
    specifications: List[Dict[str, str]] = None

category_functions_form1 = {
    "construction": [scrape_product_details_builder_mart, scrape_product_details_google],
    "medical": [scrape_product_details_google],
    "electronics": [scrape_product_details_google],
}

category_functions_form2 = {
    "construction": [scrape_product_details_google_specs],
    "medical": [scrape_product_details_google_specs],
    "electronics": [scrape_product_details_google_specs],
}

@app.post("/scrape-make-model/{category}")
def scrape_products(category: str, request: ItemRequest_form1):
    # Scrape the product details from both sources
    if category not in category_functions_form1:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found.")

    scraping_functions = category_functions_form1[category]

    combined_results = []

    # Execute the scraping functions and combine results
    for func in scraping_functions:
        result_json = func(request.item_name, request.seller, request.model)
        result_list = json.loads(result_json) if result_json else []
        combined_results.extend(result_list)

    if not combined_results:
        raise HTTPException(status_code=404, detail="No products found.")

    # Return the combined results as JSON
    return combined_results



@app.post("/scrape-specs/{category}")
def scrape_products_specs(category: str, request: ItemRequest_form2):
    # Scrape the product details based on specifications
    if category not in category_functions_form2:
        raise HTTPException(status_code=404, detail=f"Category '{category}' not found.")

    scraping_functions = category_functions_form2[category]

    combined_results = []

    # Execute the scraping functions and combine results
    for func in scraping_functions:
        # Unpack specifications list to pass it as individual arguments
        result_json = func(request.item_name, request.specifications)
        result_list = json.loads(result_json) if result_json else []
        combined_results.extend(result_list)

    if not combined_results:
        raise HTTPException(status_code=404, detail="No products found.")

    # Return the combined results as JSON
    return combined_results







# To run the server, use the command:
# uvicorn server:app --reload
