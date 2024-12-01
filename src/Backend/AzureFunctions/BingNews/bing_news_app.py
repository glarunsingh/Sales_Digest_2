'''
Main application for Bing News Extraction
'''
from dotenv import load_dotenv

_= load_dotenv("./config.env")

import json
from typing import Optional,Union
import pandas as pd
from pydantic import BaseModel, Field, model_validator
from typing import Optional, List, Literal
import sys
from datetime import date

# FastAPI imports
import uvicorn
from fastapi import FastAPI, Response, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from utils import database
from utils import bing_crawler

bing_news_db = database.Bing_News_DB()
import logging
# from utils import logger
# logger = logger.create_log(name="bing_news", level=logging.INFO)
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, filename= "log"+".log", filemode='a',
                        datefmt="%Y-%m-%d %H:%M:%S",
                        format="%(asctime)s  %(filename)s  Line: %(lineno)d  %(levelname)s  Function_Name: %("
                        "funcName)s:  %(message)s")
logger.propagate = True




origins = [
        "http://localhost:8000",
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:4700",
        "http://localhost:4700"
        ]

app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


class bing_news_schema(BaseModel):
    
    source_name : Optional[Literal["Bing News"]] = Field(default="Bing News", description="Source Name")
    # department_name: Optional[Literal["Health systems", "Government sales"]] = Field(default="Health systems",
    #                                                             description="Department Name")
    # department_name : str  = Field(default="Healthcare",  description="Department Name")
    client_name: Optional[Union[List[str]]]= Field(default=["All"],
                                                                description="Client Name List")
    minDate: str = Field(default="YYYY-MM-DD",description="Minimum date from when to get results format = YYYY-MM-DD")
    write_db: Optional[bool] = Field(default=False,
                                description="Flag to indicate whether to store in the database")
    location: str = Field(default="IN",
                                description="Location")
    
@app.post("/start_bing_news_scarping")    
def bing_news_scrapping(inputs:bing_news_schema):
    """
    Endpoint to crawl Bing news for a given client list using API and scrape data for each url.
    Each scraped text is passed to LLM model to clean content, summary, sentiment,
    matched keyword lists, breaking news and client relevance.
    params:
        source_name: source from which news is to be extracted; in this case Bing News, default:'Bing News'
        department: department for which news is extracted, default:'Health systems'
        client: list of search keyword or client name for which data is to be extracted,default:['All']
        minDate: from when news needs to be extracted
        write_db : Flag to indicate whether to store in the database
        location: US , location form which news is extracted;
        
    returns:
        list of dictionary containing news_url,news_content,news_summary,sentiment,keywords_list,news_date
    """
    final_data=[]
    try:
        
        # department_name= inputs.department_name
        source_name= inputs.source_name
        client_name= inputs.client_name
        minDate = inputs.minDate
        write_db = inputs.write_db
        location = inputs.location
        news_data = bing_crawler.BingCrawl(source_name = source_name, minDate=minDate,location= location,
                         store_db = write_db)
        
        #if news_data.connection_error:
        #    return ({'success': False,'message': "Open AI API giving connection error, please check before processing further","data": []})
        
        if client_name[0]=="All":
            client_list = bing_news_db.query_client_list()
        else:
            client_list =[]
            for item in client_name:
                client_list.append({'client_name':item , 'search_term':f'"{item.strip()}"'})
        client_list.reverse()
        for client in client_list:
            logger.info(f"Starting Bing News Extraction for { client['search_term']}")
            news_data.url_processing(client_name = client['client_name'], search_term = client['search_term'] )
            final_data.extend(news_data.all_articles_info)
            
        print(final_data)
        logger.info(f"Bing News extraction completed for given client list")
        return ({'success': True,'message': "Bing News extraction completed","data": final_data})
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        logger.error(f"Line No: {exc_tb.tb_lineno}  Error: {str(e)}", stack_info=True)
        return ({'success': False,'message': "Bing News extraction failed",
                            "data": []})
        
        
if __name__=="__main__":
    uvicorn.run('bing_news_app:app',host="127.0.0.1",port=4700, reload=False)
    
#uvicorn bing_news_app:app --host 127.0.0.1 --port 8001