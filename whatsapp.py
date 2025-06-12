

import time
from urllib.parse import quote
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import traceback


#  Load Google Sheets

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# Campaign data
campaign_sheet = client.open("campaign_data_sheet").sheet1
campaign_data = {row["Campaign ID"]: row["Message"] for row in campaign_sheet.get_all_records()}

# User data
user_sheet = client.open("user_data_sheet").sheet1
users = user_sheet.get_all_records()


# Setup Selenium WebDriver

options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


#  Open WhatsApp Web ONCE

driver.get("https://web.whatsapp.com")
print(" Please scan the QR code to login...")
time.sleep(120)  # Wait for QR scan


#  Loop through users and send messages

for user in users:
    name = user["Name"]
    phone = str(user["Phone Number"]).strip()
    campaign_id = user["Campaign ID"]

    message_template = campaign_data.get(campaign_id, "")
    if not message_template:
        print(f"⚠️ No message found for Campaign ID: {campaign_id}")
        continue

    personalized_message = message_template.replace("{name}", name)
    encoded_message = quote(personalized_message)

    # Open chat for the number with the message
    driver.get(f"https://web.whatsapp.com/send?phone={phone}&text={encoded_message}")

    try:
        # Wait for input box or invalid number message
        WebDriverWait(driver, 60).until(
            lambda d: d.find_elements(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]') or
                      d.find_elements(By.XPATH, '//*[contains(text(), "Phone number shared via url is invalid")]')
        )

        if driver.find_elements(By.XPATH, '//*[contains(text(), "Phone number shared via url is invalid")]'):
            print(f" Number {phone} is not valid on WhatsApp.")
            continue

        send_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//span[@data-icon="send"]'))
            
            
        )
        send_btn.click()
        print(f" Message sent to {name} ({phone})")

    except Exception as e:
        print(f" Failed to send message to {phone}. Error: {type(e).__name__}")
        traceback.print_exc()

    time.sleep(5)  # Small wait before next message


# Close browser

input("Press Enter to exit and close browser...")
driver.quit()

