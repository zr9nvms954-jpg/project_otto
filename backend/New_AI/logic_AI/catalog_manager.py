import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

_BASE_DIR_PARENT = Path(__file__).resolve().parent.parent / "dataset" / "brand_car"
_BASE_DIR_LOCAL = Path(__file__).resolve().parent / "dataset" / "brand_car"
CATALOG_DIR = _BASE_DIR_PARENT if _BASE_DIR_PARENT.exists() else _BASE_DIR_LOCAL


def _clean_str(text: str) -> str:
    """Hàm làm sạch chuỗi: viết thường, xóa gạch dưới, xóa khoảng trắng và ký tự đặc biệt."""
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r"[_\-\s]+", "", text)
    return text


@lru_cache(maxsize=1)
def load_all_catalogs() -> list[dict[str, Any]]:
    all_vehicles = []
    if not CATALOG_DIR.exists():
        return []

    url_dir = CATALOG_DIR.parent / "url_car"
    url_mapping = {}

    # 1. Đọc dữ liệu 
    if url_dir.exists():
        for url_file in url_dir.glob("*.json"):
            try:
                data = json.loads(url_file.read_text(encoding="utf-8"))
                items = data if isinstance(data, list) else data.get("vehicles", [])
                for item in items:
                    url = item.get("url")
                    if not url:
                        continue

                    item_id = _clean_str(item.get("id"))
                    item_model = _clean_str(item.get("model") or item.get("name"))

                    if item_id:
                        url_mapping[item_id] = url
                    if item_model:
                        url_mapping[item_model] = url

                    for kw in item.get("keywords", []):
                        clean_kw = _clean_str(kw)
                        if clean_kw:
                            url_mapping[clean_kw] = url

            except Exception as e:
                print(f"[Cảnh báo]: Không thể đọc file URL {url_file.name}: {e}")

    # 2 Ghép URL vào đúng mẫu xe
    for json_file in CATALOG_DIR.glob("*.json"):
        try:
            data = json.loads(json_file.read_text(encoding="utf-8"))
            brand_from_file = json_file.stem.capitalize()
            vehicles_list = data.get("vehicles", []) if isinstance(data, dict) else data

            for v in vehicles_list:
                v_copy = dict(v)
                if "brand" not in v_copy or not v_copy["brand"]:
                    v_copy["brand"] = brand_from_file

                v_id = _clean_str(v_copy.get("id"))
                v_name = _clean_str(v_copy.get("name") or v_copy.get("model"))

                matched_url = "N/A"
                if v_id and v_id in url_mapping:
                    matched_url = url_mapping[v_id]
                elif v_name and v_name in url_mapping:
                    matched_url = url_mapping[v_name]
                else:
                    for key, url in url_mapping.items():
                        if key and (key in v_name or v_name in key):
                            matched_url = url
                            break

                v_copy["url"] = matched_url
                all_vehicles.append(v_copy)
        except Exception as error:
            print(f"[Cảnh báo]: Lỗi đọc dataset {json_file.name}: {error}")

    return all_vehicles


def get_available_brands() -> list[str]:
    vehicles = load_all_catalogs()
    return sorted(
        list(
            {
                v.get("brand", "").strip().capitalize()
                for v in vehicles
                if v.get("brand")
            }
        )
    )


def parse_budget_range(prompt: str) -> Optional[tuple[float, float]]:
    p = prompt.lower()
    range_match = re.search(
        r"(\d+(?:\.\d+)?)\s*(?:đến|-|tới)\s*(\d+(?:\.\d+)?)\s*tỷ", p
    )
    if range_match:
        return (
            float(range_match.group(1)) * 1_000_000_000,
            float(range_match.group(2)) * 1_000_000_000,
        )

    single_match = re.search(r"(?:tầm|khoảng|mức|dưới)\s*(\d+(?:\.\d+)?)\s*tỷ", p)
    if single_match:
        val = float(single_match.group(1)) * 1_000_000_000
        return (0.0, val) if "dưới" in p else (val * 0.8, val * 1.2)

    return None


def parse_acc_time(acc_val: Any) -> float:
    if isinstance(acc_val, (int, float)):
        return float(acc_val)
    if isinstance(acc_val, str):
        match = re.search(r"(\d+(?:\.\d+)?)", acc_val)
        if match:
            return float(match.group(1))
    return 999.0


def format_catalog_context(user_prompt: str) -> str:
    p = user_prompt.lower()
    vehicles = load_all_catalogs()
    available_brands = get_available_brands()

    unsupported_requested = []
    common_brands = [
        "bmw",
        "porsche",
        "ferrari",
        "mclaren",
        "bentley",
        "lexus",
        "lamborghini",
        "mercedes",
        "audi",
        "bugatti",
    ]
    for b in common_brands:
        if (
            b in p
            and b.capitalize() not in available_brands
            and b.upper() not in available_brands
        ):
            unsupported_requested.append(b.capitalize())

    brand_warning = ""
    if unsupported_requested:
        brand_warning = f"[LƯU Ý HỆ THỐNG]: Khách hỏi hãng {', '.join(unsupported_requested)} -> Showroom KHÔNG CÓ sẵn hãng này.\n\n"

    candidate_vehicles = []

    # Lọc xe
    clean_p = _clean_str(p)
    for v in vehicles:
        v_name = _clean_str(v.get("name") or v.get("model"))
        v_brand = _clean_str(v.get("brand"))
        v_id = _clean_str(v.get("id"))

        if (
            (v_name and v_name in clean_p)
            or (v_id and v_id in clean_p)
            or (v_brand and v_brand in clean_p)
        ):
            candidate_vehicles.append(v)

    # Nếu không lọc được xe cụ thể, lấy danh sách xe theo ngân sách hoặc danh sách chung
    if not candidate_vehicles:
        budget_range = parse_budget_range(user_prompt)
        if budget_range:
            min_b, max_b = budget_range
            candidate_vehicles = [
                v
                for v in vehicles
                if isinstance(v.get("price_vnd"), (int, float))
                and min_b <= v.get("price_vnd") <= max_b
            ]
        else:
            candidate_vehicles = vehicles

    if not candidate_vehicles:
        return (
            brand_warning
            + "HỆ THỐNG: Không tìm thấy mẫu xe phù hợp trong dữ liệu Showroom."
        )

    lines = [brand_warning + "DỮ LIỆU XE PHÙ HỢP TẠI SHOWROOM:"]
    for v in candidate_vehicles[:5]:
        price = v.get("price_vnd")
        price_str = f"{price:,}" if isinstance(price, (int, float)) else "Liên hệ"
        car_url = v.get("url", "N/A")
        if car_url != "N/A":
            car_url = car_url.replace(" ", "%20")

        lines.append(
            f"- {v.get('brand', '').upper()} {v.get('name') or v.get('model')}: Giá {price_str} VNĐ | "
            f"Động cơ: {v.get('powertrain', 'N/A')} | Công suất: {v.get('power_hp', 'N/A')} HP | "
            f"Số chỗ: {v.get('seats', 'N/A')} | URL: {car_url}"
        )
    return "\n".join(lines)


def is_brand_list_request(text: str) -> bool:
    """Xác định xem khách có đang hỏi danh sách HÃNG XE không."""
    kws = [
        "hãng xe",
        "hãng nào",
        "các hãng",
        "thương hiệu",
        "có những hãng",
        "có hãng xe nào",
        "những hãng xe nào",
    ]
    return any(kw in text.lower() for kw in kws)


def is_vehicle_list_request(text: str) -> bool:
    """Xác định xem khách có đang hỏi danh sách TẤT CẢ XE không."""
    kws = [
        "danh sách xe",
        "xem danh sách",
        "showroom có những xe gì",
        "có các mẫu xe nào",
        "tất cả các xe",
        "các mẫu xe hiện có",
    ]
    return any(kw in text.lower() for kw in kws)


def format_vehicle_list_response(user_prompt: str) -> str:
    """Định dạng danh sách tùy theo khách hỏi Hãng hay hỏi Xe."""
    vehicles = load_all_catalogs()
    if not vehicles:
        return "Dạ, hiện tại showroom bên em chưa cập nhật dữ liệu xe ạ."

    # Xử lý trường hợp 
    if is_brand_list_request(user_prompt):
        available_brands = get_available_brands()
        lines = [
            "Dạ, hiện tại showroom bên em đang phân phối các hãng xe danh tiếng sau:\n"
        ]
        for idx, brand in enumerate(available_brands, 1):
            lines.append(f"{idx}. **{brand.upper()}**")
        lines.append(
            "\nAnh/Chị đang quan tâm đặc biệt đến thương hiệu nào, hoặc cần em gợi ý mẫu xe cụ thể không ạ?"
        )
        return "\n".join(lines)

    lines = ["Dạ, em gửi danh sách các mẫu xe hiện có tại showroom ạ:\n"]
    for idx, v in enumerate(vehicles, 1):
        price = v.get("price_vnd")
        price_str = f"{price:,}" if isinstance(price, (int, float)) else "Liên hệ"
        car_url = v.get("url", "N/A")

        if car_url != "N/A":
            clean_url = car_url.replace(" ", "%20")
            url_text = f" — [Xem chi tiết xe tại đây]({clean_url})"
        else:
            url_text = ""

        lines.append(
            f"{idx}. **{v.get('brand', '').upper()} {v.get('name') or v.get('model')}** — **{price_str} VNĐ**{url_text}"
        )

    lines.append("\nAnh/Chị muốn tư vấn chi tiết mẫu xe nào trên đây ạ?")
    return "\n".join(lines)
