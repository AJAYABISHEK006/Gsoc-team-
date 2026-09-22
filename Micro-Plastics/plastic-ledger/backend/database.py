"""
Database connector for Python microservices.
"""
import os

def check_db_connection():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/plastic-ledger")
    return {"status": "ready", "uri": uri}
