import time
from urllib.parse import quote
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

# Google Sheets setup
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)
sheet = client.open("whatsapp-contact").sheet1
data = sheet.get_all_records()

# Selenium setup
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Open WhatsApp Web
driver.get("https://web.whatsapp.com/")
print("📷 Please scan the QR code in the browser. Waiting 30 seconds...")
time.sleep(30)

# Loop through contacts
# Loop through contacts
for entry in data:
    number = str(entry['Phone Number']).strip()
    message = entry['Message']
    encoded_message = quote(message)

    link = f"https://web.whatsapp.com/send?phone={number}&text={encoded_message}"
    driver.get(link)

    try:
        # Wait for either the message box or the error to appear
        WebDriverWait(driver, 30).until(
            lambda d: d.find_elements(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]') or
                      d.find_elements(By.XPATH, '//*[contains(text(), "Phone number shared via url is invalid")]')
        )

        if driver.find_elements(By.XPATH, '//*[contains(text(), "Phone number shared via url is invalid")]'):
            print(f" Number {number} is not on WhatsApp.")
            continue

        msg_box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
        msg_box.send_keys(message)
        msg_box.send_keys(Keys.ENTER)
        print(f" Message sent to {number}")

    except Exception as e:
        print(f" Failed to send message to {number}: {e}")

    time.sleep(5)


input(" Press Enter to close the browser manually...")
driver.quit()
