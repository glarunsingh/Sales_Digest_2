"""
Module to call LLM to generate summary,sentiment,matched_keyword_list
"""
import tiktoken
import logging
import sys
from langchain.prompts import PromptTemplate
from langchain.chains import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from Advisory.utils.load_model import model
from Advisory.utils.advisory_schema import AdvisorySchema
from Advisory.utils.prompt_config import prompt_config
logger = logging.getLogger(__name__)

advisory_schema = AdvisorySchema()
advisory_op_format, output_parser = advisory_schema.response_schema()
news_prompt = prompt_config['news_prompt']


async def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


async def get_summary(raw_text, url):
    """
    Generates summary for the given content from url
    """
    token_count = 0
    token_count = await num_tokens_from_string(raw_text, "cl100k_base")
    if token_count > 110000:
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(chunk_size=110000, chunk_overlap=60000)
        docs = [Document(page_content=x) for x in text_splitter.split_text(raw_text)]
        chain = load_summarize_chain(model, chain_type="map_reduce")
    else:
        docs = [Document(page_content=str(raw_text), metadata={"source": url})]
        chain = load_summarize_chain(model, chain_type="stuff")
    summary = chain.invoke({"input_documents": docs})
    return summary['output_text']


async def get_summ_sent_key(raw_text, url, k_list=[]):
    """
    Function to call llm
    params:
        raw_text: text for which summary is to be generated
        url: url from which the raw_text is scraped
        client_name: client_name / or search keyword for which the url is crawled 
        k_list : list of keywords from specific to the department
    returns:
        Output from llm which is a dictionary containing summary,sentiment,
        matched_keywords from k_list, client_relevance
    """
    try:
        docs = [Document(page_content=str(raw_text), metadata={"source": url})]
        prompt = PromptTemplate.from_template(news_prompt)
        chain = prompt | model | output_parser
        logger.info("Generating response from LLM")
        response = chain.invoke({"content": docs, "keyword_list": k_list,
                                 "format_instructions": advisory_op_format})
        print(f"Response from LLM generated!")
        logger.info("response from LLM generated")
        return response
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        logger.error(f"Failed to generate response from LLM.Line No: {exc_tb.tb_lineno}  Error: {str(e)}",
                     stack_info=True)
