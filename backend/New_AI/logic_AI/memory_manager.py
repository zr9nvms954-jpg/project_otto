import json
import re
from datetime import datetime
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

MEMORY_DB_DIR = Path(__file__).resolve().parent / "vector_db"


class MemoryManager:
    def __init__(
        self, db_dir: Path = MEMORY_DB_DIR, collection_name: str = "customer_memory"
    ):
        self.client = chromadb.PersistentClient(path=str(db_dir))
        self.emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="paraphrase-multilingual-MiniLM-L12-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.emb_fn,
            metadata={"hnsw:space": "cosine"},
        )

    def get_relevant_memories(
        self, user_id: str, query: str, top_k: int = 3, threshold: float = 0.8
    ) -> str:
        """Lấy memory liên quan đến câu hỏi hiện tại."""
        try:
            results = self.collection.query(
                query_texts=[query], n_results=top_k, where={"user_id": user_id}
            )
            distances = results.get("distances", [[]])[0]
            metadatas = results.get("metadatas", [[]])[0]

            memories = []
            for dist, meta in zip(distances, metadatas):
                similarity = 1.0 - dist
                if similarity >= threshold:
                    # Chuyển type thành nhãn dễ hiểu
                    type_vi = {
                        "budget": "Ngân sách dự kiến",
                        "brand": "Thương hiệu yêu thích",
                        "body_type": "Kiểu dáng xe quan tâm",
                        "usage": "Mục đích sử dụng",
                    }.get(meta.get("memory_type"), meta.get("memory_type"))

                    memories.append(
                        f"- {type_vi}: {meta.get('value')} (Trích từ: '{meta.get('source_text')}')"
                    )

            if memories:
                return "\n".join(memories)
        except Exception as e:
            print(f"[Cảnh báo Memory Search]: {e}")
        return ""

    def extract_and_save_memories(
        self,
        user_id: str,
        user_prompt: str,
        model,
        tokenizer,
        generate_fn,
        make_sampler_fn,
    ):
        """
        Dùng LLM trích xuất memory ngầm từ câu hỏi của user (nếu có).
        Để tối ưu, chỉ chạy nếu user_prompt đủ độ dài hoặc có chứa từ khóa nhất định.
        """
        # Heuristic nhẹ để tránh gọi LLM vô ích
        keywords = [
            "thích",
            "muốn",
            "tìm",
            "khoảng",
            "tỷ",
            "triệu",
            "suv",
            "sedan",
            "gia đình",
            "đổi ý",
            "hơn",
        ]
        if (
            not any(kw in user_prompt.lower() for kw in keywords)
            or len(user_prompt.split()) < 3
        ):
            return

        sys_prompt = """Bạn là hệ thống trích xuất thông tin khách hàng mua xe. 
Nhiệm vụ: Phân tích câu nói của khách, trích xuất nhu cầu và trả về ĐÚNG định dạng JSON.
Các loại thông tin (memory_type) được phép: "budget" (ngân sách), "brand" (hãng xe), "body_type" (kiểu dáng như SUV, Sedan), "usage" (mục đích).
- Nếu khách đổi ý, trích xuất giá trị mới nhất.
- Không suy đoán. Nếu không có thông tin rõ ràng, trả về danh sách rỗng [].
Định dạng JSON bắt buộc:
[{"memory_type": "loại", "value": "giá trị"}]"""

        messages = [
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": f"Câu nói của khách: '{user_prompt}'"},
        ]
        prompt = tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )

        try:
            response = generate_fn(
                model,
                tokenizer,
                prompt=prompt,
                max_tokens=100,
                sampler=make_sampler_fn(temp=0.1),
                verbose=False,
            )

            # Parse JSON từ response
            json_match = re.search(r"\[.*\]", response, re.DOTALL)
            if json_match:
                extracted = json.loads(json_match.group(0))
                for item in extracted:
                    m_type = item.get("memory_type")
                    m_value = item.get("value")

                    if m_type and m_value:
                        # Dùng ID
                        doc_id = f"{user_id}_{m_type}"
                        text_content = f"Khách hàng {user_id} có {m_type} là {m_value}"

                        self.collection.upsert(
                            documents=[text_content],
                            metadatas=[
                                {
                                    "user_id": user_id,
                                    "memory_type": m_type,
                                    "value": str(m_value),
                                    "source_text": user_prompt,
                                    "timestamp": datetime.now().isoformat(),
                                }
                            ],
                            ids=[doc_id],
                        )
        except Exception as e:
            print(f"[Cảnh báo Memory Extraction]: {e}")
