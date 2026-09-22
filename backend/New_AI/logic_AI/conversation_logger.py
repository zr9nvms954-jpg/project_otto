import json
from datetime import datetime
from pathlib import Path

LOG_DIR = Path(__file__).resolve().parent / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)


class ConversationLogger:
    def __init__(self, log_file: str = "chat_history.jsonl"):
        self.log_path = LOG_DIR / log_file

    def log_interaction(
        self, user_id: str, user_msg: str, bot_response: str, metadata: dict = None
    ):
        """Lưu log ra file JSONL phục vụ Fine-Tuning sau này."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "messages": [
                {"role": "user", "content": user_msg},
                {"role": "assistant", "content": bot_response},
            ],
            "metadata": metadata or {},
        }

        try:
            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(log_entry, ensure_ascii=False) + "\n")
        except Exception as e:
            print(f"[Cảnh báo Logging]: {e}")
