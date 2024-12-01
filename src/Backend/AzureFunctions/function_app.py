# Importing the env variables
from dotenv import load_dotenv

_ = load_dotenv()

from config import session_key_vault
from config import logger_setup
session_key_vault.get_all_values()

# Importing logs
import logging
import asyncio
import os
from logging import Logger

logging.basicConfig(level=logging.INFO)
logger = logger_setup.create_log(level=logging.INFO)
logger.propagate = True

logger.info("starting function app")
import azure.functions as func
from DrugChannel.main import bp_drugchannel, drug_channel_scrapping_function
from BeckerHospitalReview.main import becker_hospital_scrapping_function #bp_beckerhospital, 
from Advisory.main import bp_advisory, advisory_news
from HIMSS.himss import himss_scrapping_function #bp_himss,
from BingNews.main import bing_news_scrapping #bp_bingnews
from AzureAISearch.main import azure_ai_search_indexer_pipeline

# from Bloomberg.main import bp_bloomberg
# from Definitive.main import bp_definitive

# app = func.FunctionApp()
# app.register_blueprint(bp_drugchannel)
# app.register_blueprint(bp_beckerhospital)
# app.register_blueprint(bp_advisory)
# app.register_blueprint(bp_definitive)
# app.register_blueprint(bp_himss)
# app.register_blueprint(bp_bingnews)
# app.register_blueprint(bp_bloomberg)
# app.register_blueprint(bp_azure_ai_search_indexer_pipeline)


if __name__== "__main__":
    # asyncio.run(advisory_news())
    # asyncio.run(drug_channel_scrapping_function())
    # asyncio.run(himss_scrapping_function())
    # asyncio.run(becker_hospital_scrapping_function())
    asyncio.run(bing_news_scrapping())
    # asyncio.run(azure_ai_search_indexer_pipeline())