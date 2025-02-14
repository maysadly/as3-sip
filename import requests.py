from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.webdriver import WebDriver


# Initialize the Chrome driver
driver = WebDriver()

# Open the webpage

try:
    # Wait for the element to load
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "#root > div > main > div > div > div.custom-1mgfq9c > div.custom-u4bj1o > div.custom-19qkkht > div > div.custom-1vjv7zm > div.custom-1mxzest > div.custom-1kikirr"))
    )
    print(element.text)
except Exception as e:
    print("Element not found or took too long to load:", e)
finally:
    # Quit the driver
    pass