import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

_BASE_DIR_PARENT = Path(__file__).resolve().parent.parent / "dataset" / "brand_car"
_BASE_DIR_LOCAL = Path(__file__).resolve().parent / "dataset" / "brand_car"
CATALOG_DIR = _BASE_DIR_PARENT if _BASE_DIR_PARENT.exists() else _BASE_DIR_LOCAL


def _clean_str(text: str) -> str:
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r"[_\-\s]+", "", text)
    return text


# @lru_cache(maxsize=1)
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
                data = json.loads(url_file.read_text(encoding="utf-8-sig"))
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
            data = json.loads(json_file.read_text(encoding="utf-8-sig"))
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
        r"(\d+(?:\.\d+)?)\s*(?:tỷ\s*)?(?:đến|-|tới)\s*(\d+(?:\.\d+)?)\s*tỷ", p
    )
    if range_match:
        first_value = float(range_match.group(1)) * 1_000_000_000
        second_value = float(range_match.group(2)) * 1_000_000_000
        return (
            min(first_value, second_value),
            max(first_value, second_value),
        )

    single_match = re.search(
        r"(?:tầm|khoảng|mức|dưới|trên|hơn)\s*(\d+(?:\.\d+)?)\s*tỷ", p
    )
    if single_match:
        val = float(single_match.group(1)) * 1_000_000_000
        if "dưới" in p:
            return (0.0, val)
        elif "trên" in p or "hơn" in p:
            return (val, float("inf"))  # Mức giá từ val đến vô cực
        else:
            return (val * 0.8, val * 1.2)

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

    available_brands_lower = [br.lower() for br in available_brands]
    for b in common_brands:
        if b in p and not any(b in avail for avail in available_brands_lower):
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

        raw_name = str(v.get("name") or v.get("model")).lower()
        raw_brand = str(v.get("brand")).lower()

        if (
            (v_name and (v_name in clean_p or clean_p in v_name))
            or (v_brand and v_brand in clean_p)
            or (raw_brand and raw_brand.split("-")[0] in p)
            or (raw_name and any(w in p for w in raw_name.split() if len(w) > 2))
        ):
            candidate_vehicles.append(v)

    wants_cheaper = any(
        phrase in p
        for phrase in ("giá mềm hơn", "rẻ hơn", "giá thấp hơn", "giá hợp lý hơn")
    )
    if wants_cheaper:
        referenced_vehicle = next(
            (
                v
                for v in vehicles
                if any(
                    len(token) > 1 and re.search(rf"\b{re.escape(token)}\b", p)
                    for token in re.findall(
                        r"[a-z0-9]+", str(v.get("name") or v.get("model", "")).lower()
                    )
                    if token
                    not in {"audi", "bmw", "mercedes", "benz", "ferrari", "lamborghini"}
                )
            ),
            None,
        )
        if referenced_vehicle and isinstance(
            referenced_vehicle.get("price_vnd"), (int, float)
        ):
            reference_price = referenced_vehicle["price_vnd"]
            reference_brand = _clean_str(referenced_vehicle.get("brand"))
            candidate_vehicles = [
                v
                for v in vehicles
                if _clean_str(v.get("brand")) == reference_brand
                and isinstance(v.get("price_vnd"), (int, float))
                and v["price_vnd"] < reference_price
            ]
            if any(
                term in p for term in ("kiểu dáng", "thể thao", "coupe", "sportback")
            ):
                style_matches = [
                    v
                    for v in candidate_vehicles
                    if any(
                        term in f"{v.get('name', '')} {v.get('body_type', '')}".lower()
                        for term in ("coupe", "sportback", "roadster")
                    )
                    and "suv" not in str(v.get("body_type", "")).lower()
                ]
                if style_matches:
                    candidate_vehicles = sorted(
                        style_matches, key=lambda v: v["price_vnd"]
                    )

    requested_electric = any(
        term in p for term in ("xe điện", "thuần điện", "xe chạy điện")
    )
    electric_note = ""
    if requested_electric and "audi" in p:
        audi_electric = [
            v
            for v in vehicles
            if _clean_str(v.get("brand")) == "audi"
            and any(
                term in str(v.get("powertrain", "")).lower()
                for term in ("thuần điện", "pin điện", "electric")
            )
        ]
        if not audi_electric:
            electric_note = (
                "[LƯU Ý HỆ THỐNG]: Dữ liệu showroom hiện chưa có mẫu Audi thuần điện; "
                "không tự đề xuất Audi e-tron hoặc khẳng định xe điện Audi đang được bán.\n"
            )

    # Nếu không lọc được xe cụ thể, kiểm tra xem khách có đang hỏi câu ngoài lề không
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
            brands_list = ", ".join(get_available_brands())
            return (
                brand_warning
                + "HỆ THỐNG: Khách hàng hỏi vấn đề ngoài lề (không phải mua/tìm xe). "
                + f"Hãy lịch sự từ chối các dịch vụ ngoài lề đó, sau đó giới thiệu rằng showroom của chúng ta hiện đang phân phối các hãng xe cao cấp sau để khách lựa chọn: {brands_list}."
            )

    if not candidate_vehicles:
        return (
            brand_warning
            + "HỆ THỐNG: Không tìm thấy mẫu xe phù hợp trong dữ liệu Showroom."
        )

    lines = [brand_warning + electric_note + "DỮ LIỆU XE PHÙ HỢP TẠI SHOWROOM:"]
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
    text_lower = text.lower()
    if "tỷ" in text_lower or "giá" in text_lower or "vài xe" in text_lower:
        return False

    specific_vehicle = any(
        any(
            re.search(rf"\b{re.escape(token)}\b", text_lower)
            for token in re.findall(
                r"[a-z0-9]+", str(v.get("name") or v.get("model", "")).lower()
            )
            if any(character.isdigit() for character in token)
        )
        for v in load_all_catalogs()
    )
    if specific_vehicle or any(
        term in text_lower for term in ("link", "chi tiết", "đường dẫn")
    ):
        return False

    requested_brand = any(
        re.search(rf"\b{re.escape(brand.lower())}\b", text_lower)
        for brand in get_available_brands()
    )
    brand_vehicle_phrases = (
        "xem xe",
        "cho xem",
        "các dòng xe",
        "dòng xe",
        "các mẫu xe",
        "có xe",
        "những xe",
    )
    if requested_brand and any(
        phrase in text_lower for phrase in brand_vehicle_phrases
    ):
        return True

    kws = [
        "hãng xe",
        "hãng nào",
        "các hãng",
        "thương hiệu",
        "có những hãng",
        "có hãng xe nào",
        "những hãng xe nào",
    ]
    return any(kw in text_lower for kw in kws)


def is_vehicle_list_request(text: str) -> bool:
    """Xác định xem khách có đang hỏi danh sách TẤT CẢ XE không."""
    if parse_budget_range(text):
        return True

    kws = [
        "danh sách xe",
        "xem danh sách",
        "showroom có những xe gì",
        "có các mẫu xe nào",
        "tất cả các xe",
        "các mẫu xe hiện có",
    ]
    text_lower = text.lower()
    if any(kw in text_lower for kw in kws):
        return True

    if any(term in text_lower for term in ("link", "đường dẫn", "chi tiết")):
        return any(
            any(
                re.search(rf"\b{re.escape(token)}\b", text_lower)
                for token in re.findall(
                    r"[a-z0-9]+", str(v.get("name") or v.get("model", "")).lower()
                )
                if any(character.isdigit() for character in token)
            )
            for v in load_all_catalogs()
        )

    return False


def format_vehicle_list_response(user_prompt: str) -> str:
    """Định dạng danh sách tùy theo khách hỏi Hãng hay hỏi Xe."""
    vehicles = load_all_catalogs()
    if not vehicles:
        return "Dạ, hiện tại showroom bên em chưa cập nhật dữ liệu xe ạ."

    text_lower = user_prompt.lower()
    clean_prompt = _clean_str(text_lower)
    requested_vehicle = next(
        (
            v
            for v in vehicles
            if any(
                re.search(rf"\b{re.escape(token)}\b", text_lower)
                for token in re.findall(
                    r"[a-z0-9]+", str(v.get("name") or v.get("model", "")).lower()
                )
                if any(character.isdigit() for character in token)
            )
            and any(term in text_lower for term in ("link", "đường dẫn", "chi tiết"))
        ),
        None,
    )
    budget_range = parse_budget_range(user_prompt)
    requested_brand = next(
        (
            brand
            for brand in get_available_brands()
            if re.search(rf"\b{re.escape(brand.lower())}\b", text_lower)
        ),
        None,
    )

    if requested_vehicle:
        selected_vehicles = [requested_vehicle]
    elif budget_range:
        min_budget, max_budget = budget_range
        selected_vehicles = sorted(
            [
                v
                for v in vehicles
                if isinstance(v.get("price_vnd"), (int, float))
                and min_budget <= v["price_vnd"] <= max_budget
                and v.get("url") not in (None, "", "N/A")
            ],
            key=lambda v: v["price_vnd"],
            reverse=True,
        )[:5]
    elif requested_brand and is_brand_list_request(user_prompt):
        selected_vehicles = [
            v
            for v in vehicles
            if str(v.get("brand", "")).lower() == requested_brand.lower()
            and v.get("url") not in (None, "", "N/A")
        ]
        __import__("random").shuffle(selected_vehicles)
        selected_vehicles = selected_vehicles[:5]
        previous_lists = getattr(
            format_vehicle_list_response, "_last_random_brand_lists", {}
        )
        brand_key = requested_brand.lower()
        current_names = tuple(
            v.get("name") or v.get("model") for v in selected_vehicles
        )
        if len(selected_vehicles) > 1 and current_names == previous_lists.get(
            brand_key
        ):
            selected_vehicles = selected_vehicles[1:] + selected_vehicles[:1]
            current_names = tuple(
                v.get("name") or v.get("model") for v in selected_vehicles
            )
        previous_lists[brand_key] = current_names
        format_vehicle_list_response._last_random_brand_lists = previous_lists
    else:
        selected_vehicles = [
            v for v in vehicles if v.get("url") not in (None, "", "N/A")
        ][:5]

    if selected_vehicles:
        lines = ["Dạ, em gửi thông tin các mẫu xe phù hợp ạ:\n"]
        for idx, vehicle in enumerate(selected_vehicles, 1):
            price = vehicle.get("price_vnd")
            price_text = (
                f"{price:,} VNĐ" if isinstance(price, (int, float)) else "Liên hệ"
            )
            description = (
                str(
                    vehicle.get("description")
                    or vehicle.get("detailed_description")
                    or ""
                )
                .split(".")[0]
                .strip()
            )
            car_url = str(vehicle["url"]).replace(" ", "%20")
            name = vehicle.get("name") or vehicle.get("model")
            if requested_vehicle:
                technical_details = [
                    f"- Động cơ: {vehicle['powertrain']}"
                    for _ in [0]
                    if vehicle.get("powertrain")
                ]
                if vehicle.get("power_hp"):
                    technical_details.append(f"- Công suất: {vehicle['power_hp']} HP")
                if vehicle.get("seats"):
                    technical_details.append(f"- Số chỗ: {vehicle['seats']}")
                if vehicle.get("transmission"):
                    technical_details.append(f"- Hộp số: {vehicle['transmission']}")
                if vehicle.get("drivetrain"):
                    technical_details.append(f"- Dẫn động: {vehicle['drivetrain']}")
                detailed_description = (
                    vehicle.get("detailed_description") or description
                )
                lines.append(
                    f"{idx}. **{name}** — **{price_text}**.\n"
                    + "\n".join(technical_details)
                    + f"\n{detailed_description}\n"
                    + f"[Xem chi tiết xe tại đây]({car_url})"
                )
            else:
                lines.append(
                    f"{idx}. **{name}** — **{price_text}**. {description} "
                    f"[Xem chi tiết xe tại đây]({car_url})"
                )
        return "\n".join(lines)

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

    return "Dạ, hiện chưa tìm thấy mẫu xe có trang chi tiết phù hợp trong dữ liệu showroom ạ."
