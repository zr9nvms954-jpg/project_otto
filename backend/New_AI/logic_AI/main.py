import os
from pathlib import Path
from typing import Optional

from catalog_manager import (
    format_catalog_context,
    format_vehicle_list_response,
    get_available_brands,
    is_vehicle_list_request,
    is_brand_list_request,
)
from db_cache import SemanticCache
from memory_manager import MemoryManager
from conversation_logger import ConversationLogger

os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "0"

BASE_DIR = Path(__file__).resolve().parent.parent
_LOCAL_3B_PATH = BASE_DIR / "models" / "Qwen2.5-3B"
MODEL_NAME = (
    str(_LOCAL_3B_PATH)
    if _LOCAL_3B_PATH.exists()
    else os.getenv("MODEL_NAME", "mlx-community/Qwen2.5-3B-Instruct-4bit")
)

_model = None
_tokenizer = None
_generate_fn = None
_make_sampler_fn = None
_cache_instance = None
_memory_instance = None
_logger_instance = None


def _get_cache() -> SemanticCache:
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = SemanticCache()
    return _cache_instance


def _get_memory() -> MemoryManager:
    global _memory_instance
    if _memory_instance is None:
        _memory_instance = MemoryManager()
    return _memory_instance


def _get_logger() -> ConversationLogger:
    global _logger_instance
    if _logger_instance is None:
        _logger_instance = ConversationLogger()
    return _logger_instance


def _get_model():
    global _model, _tokenizer, _generate_fn, _make_sampler_fn
    if _model is not None:
        return _model, _tokenizer, _generate_fn, _make_sampler_fn

    from mlx_lm import generate, load
    from mlx_lm.sample_utils import make_sampler

    _generate_fn, _make_sampler_fn = generate, make_sampler
    print(f"[HỆ THỐNG]: Đang tải mô hình LLM từ {MODEL_NAME}...")
    _model, _tokenizer = load(MODEL_NAME)
    print("[HỆ THỐNG]: Tải mô hình thành công!")
    return _model, _tokenizer, _generate_fn, _make_sampler_fn


def should_bypass_cache(prompt: str) -> bool:
    p = prompt.lower().strip()
    keywords = [
        "tỷ",
        "triệu",
        "top",
        "nhanh nhất",
        "chậm nhất",
        "so sánh",
        "lái thử",
        "bmw",
        "porsche",
        "audi",
        "mercedes",
        "lamborghini",
        "ferrari",
        "chi phí",
        "bảo dưỡng",
        "mã lực",
        "hp",
        "0-100",
        "tăng tốc",
        "tên",
        "là",
        "chào",
        "tôi là",
        "anh là",
        "chị là",
        "mình là",
        "hãng xe",
        "danh sách",
        "có những xe gì",
        "có các mẫu xe nào",
        "những hãng nào",
    ]
    return any(kw in p for kw in keywords) or len(p.split()) > 6


SYSTEM_PROMPT_TEMPLATE = """\
**VAI TRÒ VÀ PHONG CÁCH TÁC PHONG**
Bạn là Chuyên viên Tư vấn Khách hàng VIP tại Showroom Ô tô Cao cấp. 
- Phong cách: Tinh tế, lịch sự, chuyên nghiệp, bắt tai và thuyết phục. Xưng "em" và gọi "Anh/Chị".
- Danh sách thương hiệu hiện có tại showroom: {available_brands}.

**NGUYÊN TẮC XỬ LÝ TRÍ THỨC (GROUNDING CỰC KỲ TUYỆT ĐỐI)**
1. Thông số xe, giá bán, công suất BẮT BUỘC chỉ được lấy từ [DỮ LIỆU SẢN PHẨM].
2. TUYỆT ĐỐI KHÔNG tự bịa thông số kỹ thuật nếu trong dữ liệu không có.
3. TUYỆT ĐỐI KHÔNG hướng dẫn khách hàng tìm kiếm trên các website bên ngoài (như bmw.com, audi.com, google...). Chỉ sử dụng dữ liệu nội bộ của Showroom.
4. Trường hợp không tìm thấy xe khách yêu cầu: Lịch sự báo Showroom hiện chưa cập nhật mẫu xe này, sau đó chủ động gợi ý 1-2 mẫu xe cùng phân khúc hoặc cùng tầm giá hiện có tại Showroom.

**QUY TẮC HIỂN THỊ ĐƯỜNG DẪN (URL) BẮT BUỘC**
1. Mỗi khi giới thiệu hoặc tư vấn về một mẫu xe cụ thể, nếu trong [DỮ LIỆU SẢN PHẨM] có thông tin "URL" (và URL khác "N/A"), bạn BẮT BUỘC phải chèn một đường link dạng Markdown ở ngay cuối đoạn tư vấn xe đó.
2. Cú pháp bắt buộc: `[Xem chi tiết xe tại đây](URL_TỪ_DỮ_LIỆU)`
   - Ví dụ đúng: `[Xem chi tiết xe tại đây](http://127.0.0.1:5500/frontend/html/BMW/BMW-X5M.html)`
3. KHÔNG BAO GIỜ in ra các chuỗi chữ như "URL:", "Đường dẫn:", hay để trống URL. Nếu URL là "N/A" thì bỏ qua, không chèn link.
**
Khi khách hàng hỏi xem các mẫu xe của một hãng, hãy liệt kê tên xe, giá bán và đường dẫn chi tiết một cách ngắn gọn, súc tích, tuyệt đối không tự ý liệt kê dài dòng các thông số động cơ/công suất trừ khi khách chủ động hỏi chi tiết.

[THÔNG TIN KHÁCH HÀNG (MEMORY RAG)]
{customer_memory}

[DỮ LIỆU SẢN PHẨM CUNG CẤP CHO LẦN HỎI NÀY]
{context_data}"""


def generate_car_advice(
    user_prompt: str,
    conversation_history: Optional[list[dict[str, str]]] = None,
    user_id: str = "customer_001",  # Abstraction User ID
) -> str:
    if is_brand_list_request(user_prompt) or is_vehicle_list_request(user_prompt):
        return format_vehicle_list_response(user_prompt)

    bypass = should_bypass_cache(user_prompt)
    if not bypass:
        cached_res = _get_cache().search(user_prompt)
        if cached_res.get("hit"):
            return cached_res["response"]

    model, tokenizer, generate_fn, make_sampler_fn = _get_model()

    # 1. Thu thập dữ liệu (Catalog & Memory)
    available_brands_str = ", ".join(get_available_brands())
    context_data = format_catalog_context(user_prompt)

    customer_memory = _get_memory().get_relevant_memories(user_id, user_prompt)
    if not customer_memory:
        customer_memory = (
            "Không có thông tin lịch sử nổi bật. Hãy tư vấn theo câu hỏi hiện tại."
        )

    # 2. Xây dựng Prompt
    system_content = SYSTEM_PROMPT_TEMPLATE.format(
        available_brands=available_brands_str,
        customer_memory=customer_memory,
        context_data=context_data,
    )

    messages = [{"role": "system", "content": system_content}]
    if conversation_history:
        messages.extend(conversation_history[-4:])
    messages.append({"role": "user", "content": user_prompt})

    formatted_prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True, enable_thinking=False
    )

    # 3. Gọi LLM sinh phản hồi
    response = generate_fn(
        model,
        tokenizer,
        prompt=formatted_prompt,
        max_tokens=600,
        sampler=make_sampler_fn(temp=0.1),
        verbose=False,
    )

    # 4. Lưu Cache (nếu đủ điều kiện)
    if not bypass:
        _get_cache().add(user_prompt, response)

    # 5. Cập nhật Memory (Background task hoặc Async nếu có thể, ở đây chạy đồng bộ)
    _get_memory().extract_and_save_memories(
        user_id, user_prompt, model, tokenizer, generate_fn, make_sampler_fn
    )

    # 6. Ghi Log
    _get_logger().log_interaction(
        user_id=user_id,
        user_msg=user_prompt,
        bot_response=response,
        metadata={"memory_used": bool(customer_memory), "cache_bypassed": bypass},
    )

    return response
