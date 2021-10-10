cd .venv/lib/python3.7/site-packages
zip -r ../../../../deployment-package.zip .
cd ../../../../
zip -g deployment-package.zip scraper.py
zip -g deployment-package.zip scraper_job.py
