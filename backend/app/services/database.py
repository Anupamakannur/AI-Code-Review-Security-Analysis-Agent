import logging
import uuid
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config import MONGODB_URI, DATABASE_NAME

logger = logging.getLogger("database")
logger.setLevel(logging.INFO)

class DatabaseService:
    def __init__(self):
        self.client = None
        self.db = None
        self.use_fallback = False
        
        # In-memory storage for fallback mode
        self._mock_submissions = []
        self._mock_logs = []
        
        try:
            logger.info(f"Connecting to MongoDB at {MONGODB_URI}...")
            # Set a low timeout so we fail fast and fallback
            self.client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Trigger a ping call to verify connection
            self.client.admin.command('ping')
            self.db = self.client[DATABASE_NAME]
            logger.info("Successfully connected to MongoDB.")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.warning(f"MongoDB connection failed: {e}. Switching to In-Memory Fallback Mode.")
            self.use_fallback = True
            self.client = None
            self.db = None

    def save_submission(self, code: str, language: str, filename: str, is_valid: bool, errors: list) -> str:
        submission_id = str(uuid.uuid4())
        doc = {
            "_id": submission_id,
            "code": code,
            "language": language,
            "filename": filename or ("pasted_code.py" if language.lower() in ["python", "py"] else "pasted_code.java"),
            "is_valid": is_valid,
            "errors": [err.dict() if hasattr(err, 'dict') else err for err in errors],
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if self.use_fallback:
            self._mock_submissions.append(doc)
            logger.info(f"[InMemoryDB] Saved code submission {submission_id}")
        else:
            try:
                self.db.submissions.insert_one(doc)
                logger.info(f"[MongoDB] Saved code submission {submission_id}")
            except Exception as e:
                logger.error(f"Failed to save submission to MongoDB: {e}. Falling back to in-memory.")
                self._mock_submissions.append(doc)
                
        return submission_id

    def get_submission(self, submission_id: str) -> dict:
        if self.use_fallback:
            for s in self._mock_submissions:
                if s["_id"] == submission_id:
                    return s
            return None
        else:
            try:
                return self.db.submissions.find_one({"_id": submission_id})
            except Exception as e:
                logger.error(f"Failed to fetch submission from MongoDB: {e}")
                for s in self._mock_submissions:
                    if s["_id"] == submission_id:
                        return s
                return None

    def get_all_submissions(self) -> list:
        if self.use_fallback:
            return self._mock_submissions
        else:
            try:
                return list(self.db.submissions.find().sort("timestamp", -1))
            except Exception as e:
                logger.error(f"Failed to fetch submissions from MongoDB: {e}")
                return self._mock_submissions

    def get_stats(self) -> dict:
        submissions = self.get_all_submissions()
        total = len(submissions)
        valid = sum(1 for s in submissions if s["is_valid"])
        invalid = total - valid
        
        return {
            "total_submissions": total,
            "valid_submissions": valid,
            "invalid_submissions": invalid,
            "using_fallback_db": self.use_fallback
        }

# Singleton instance
db_service = DatabaseService()
