from datetime import datetime
import requests
import json
import threading
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def scrape_page(page_number, seller, model, base_url, result_list, lock):
    url = f"{base_url}&p={page_number}"
    response = requests.get(url, timeout=5)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Scrape products from the page
    products = soup.find_all('div', class_='item col-md-3 col-sm-4 col-xs-6')
    
    # Process the products and append to the result_list
    for product in products:
        href = product.find('a')['href']
        product_name = product.find('div', class_='product-name compareproductname').text.strip()
        product_seller = product.find('div', class_='product-seller').text.strip().replace('by', '').strip()
        price = product.find('span', class_='price', id='product-price-_listing_grid').text.strip()
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # If model is defined, check both seller and model
        if model:
            if (seller and seller.lower() in product_seller.lower()) and (model.lower() in product_name.lower()):
                with lock:
                    if not any(p['Product Name'] == product_name and p['Seller'] == product_seller for p in result_list):
                        if len(result_list) < 3:
                            result_list.append({
                                "Product Name": product_name,
                                "Seller": product_seller,
                                "Price": price,
                                "Rating":"No rating",
                                "Reviews":"No Reviews",
                                "specifications":"No specification",
                                "Website": href,
                                "last_updated":current_time
                            })
                        if len(result_list) >= 3:
                            return
        # If model is not defined, check only the seller
        elif seller:
            if seller.lower() in product_seller.lower():
                with lock:
                    if not any(p['Product Name'] == product_name and p['Seller'] == product_seller for p in result_list):
                        if len(result_list) < 3:
                            result_list.append({
                                "Product Name": product_name,
                                "Seller": product_seller,
                                "Price": price,
                                "Rating":"No rating",
                                "Reviews":"No Reviews",
                                "specifications":"No specification",
                                "Website": href,
                                "last_updated":current_time
                            })
                        if len(result_list) >= 3:
                            return
                        
        else:
            with lock:
                # Check if the product is already in the result_list
                if not any(p['Product Name'] == product_name and p['Seller'] == product_seller for p in result_list):
                    if len(result_list) < 3:
                        result_list.append({
                                "Product Name": product_name,
                                "Seller": product_seller,
                                "Price": price,
                                "Rating":"No rating",
                                "Reviews":"No Reviews",
                                "specifications":"No specification",
                                "Website": href,
                                "last_updated":current_time
                        })
                    if len(result_list) >= 3:
                        return


    # If there's no 'next' button, stop further processing
    next_button = soup.find('a', class_='next i-next')
    if not next_button:
        return

def scrape_product_details_builder_mart(item_name, seller=None, model=None):
    search_query = item_name.replace(' ', '+')
    if seller:
        search_query += f"+{seller.replace(' ', '+')}"
    if model:
        search_query += f"+{model.replace(' ', '+')}"

    base_url = f"https://www.buildersmart.in/catalogsearch/result/?q={search_query}"
    result_list = []
    lock = threading.Lock()

    start_time = time.perf_counter()

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        for page_number in range(1, 21):
            futures.append(executor.submit(scrape_page, page_number, seller, model, base_url, result_list, lock))
            
            with lock:
                if len(result_list) >= 3:
                    break

        # Wait for all futures to complete or early exit if 10 results found
        for future in as_completed(futures):
            with lock:
                if len(result_list) >= 3:
                    break  # Exit as soon as 10 results are found

    # end_time = time.perf_counter()
    # processing_time = end_time - start_time
    # print(f"Processing Time: {processing_time:.2f} seconds")

    return json.dumps(result_list, indent=4, ensure_ascii=False)



