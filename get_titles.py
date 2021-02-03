import re
import requests
from bs4 import BeautifulSoup

file_lines = open("blog/content/reading_log_jan_2021.md", "r").readlines()
output = []

for line in file_lines:
  finds = re.search("https?://.+\n", line)
  if finds:
    url = finds.group()[:-1]
    page = requests.get(url)
    title = BeautifulSoup(page.text, 'html.parser').title
    try:
      output.append(line.replace(url, "[" + title.text + "](" + url + ")"))
    except:
      output.append(line)
  else:
    output.append(line)

print("".join(output))
