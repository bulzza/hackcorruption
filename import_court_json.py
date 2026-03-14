import json
import re
import unicodedata
from collections import Counter
from datetime import datetime
import mysql.connector

# =========================
# CONFIG
# =========================

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "hackcorruption",
    "charset": "utf8mb4",
    "use_unicode": True,
}

JSON_FILE = "court_data.json"

# =========================
# HELPERS
# =========================

def normalize_key(s):
    if s is None:
        return ""
    return re.sub(r"\s+", " ", s).strip()

def get_field(obj, startswith_text):
    startswith_text = normalize_key(startswith_text)

    for k, v in obj.items():
        nk = normalize_key(k)
        if nk.startswith(startswith_text):
            return v
    return None

def mk_to_iso_date(mk_date):
    if not mk_date:
        return None

    try:
        return datetime.strptime(mk_date.strip(), "%d.%m.%Y").strftime("%Y-%m-%d")
    except:
        return None

def slugify(text):

    if not text:
        return "court"

    text = text.strip().lower()

    text = text.replace("основен", "osnoven")
    text = text.replace("кривичен", "krivicen")
    text = text.replace("суд", "sud")
    text = text.replace("скопје", "skopje")

    text = unicodedata.normalize("NFKD", text)

    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)

    text = re.sub(r"[-\s]+", "-", text).strip("-")

    return text

def infer_court_type(name):

    if not name:
        return "Court"

    name = name.lower()

    if "основен" in name:
        return "Basic Court"

    if "апелацион" in name:
        return "Appeal Court"

    if "врховен" in name:
        return "Supreme Court"

    return "Court"

def infer_status(summary):

    if not summary:
        return "Објавено"

    s = summary.upper()

    if "ЗАПИРА" in s:
        return "Запрена постапка"

    if "Р Е Ш Е Н И Е" in s or "РЕШЕНИЕ" in s:
        return "Решение"

    if "П Р Е С У Д А" in s or "ПРЕСУДА" in s:
        return "Пресуда"

    return "Објавено"

def combine_basis_type(v_basis, basis):

    v_basis = (v_basis or "").strip()
    basis = (basis or "").strip()

    if v_basis and basis:
        return f"{v_basis} | {basis}"

    return basis or v_basis or None

def choose_better_record(old, new):

    def score(rec):

        important = [
            "date","judge","legal_area","case_type",
            "case_subtype","basis_group","basis","summary"
        ]

        pts = 0

        for k in important:
            if rec.get(k):
                pts += 1

        if "connected=false" in (rec.get("download_link") or ""):
            pts += 1

        return pts

    return new if score(new) > score(old) else old

# =========================
# LOAD JSON
# =========================

with open(JSON_FILE,"r",encoding="utf-8") as f:
    data = json.load(f)

query_meta = data.get("query_meta",{})
court_name = query_meta.get("court","").strip()

court_slug = slugify(court_name)
court_type = infer_court_type(court_name)

results = data.get("results",[])

normalized_cases = {}

for row in results:

    case_number = get_field(row,"Број на предмет")
    court_from_row = get_field(row,"Суд")
    decision_date = get_field(row,"Датум на одлука")
    judge = get_field(row,"Судија")
    legal_area = get_field(row,"Правна област")
    case_type = get_field(row,"Вид предмет")
    case_subtype = get_field(row,"Подвид предмет")
    basis_group = get_field(row,"Вид основ")
    basis = get_field(row,"Основ")

    download_link = row.get("download_link","")
    summary = row.get("summary","")

    if not case_number:
        continue

    normalized = {

        "court_name": (court_from_row or court_name or "").strip(),

        "case_id": case_number.strip(),

        "date": mk_to_iso_date(decision_date),

        "judge": (judge or "").strip() or None,

        "legal_area": (legal_area or "").strip() or None,

        "case_type": (case_type or "").strip() or None,

        "case_subtype": (case_subtype or "").strip() or None,

        "basis_group": (basis_group or "").strip() or None,

        "basis": (basis or "").strip() or None,

        "basis_type_combined": combine_basis_type(basis_group,basis),

        "download_link": (download_link or "").strip() or None,

        "summary": (summary or "").strip() or None,

        "status": infer_status(summary)
    }

    if case_number in normalized_cases:
        normalized_cases[case_number] = choose_better_record(
            normalized_cases[case_number], normalized
        )
    else:
        normalized_cases[case_number] = normalized

cases = list(normalized_cases.values())

print("Unique cases:",len(cases))

# =========================
# AGGREGATIONS
# =========================

cases_per_year = Counter()
case_type_stats = Counter()
judges_set = set()

for c in cases:

    if c["date"]:
        year = int(c["date"][:4])
        cases_per_year[year]+=1

    label = c["basis"] or c["basis_group"] or c["case_type"] or "Непознато"

    case_type_stats[label]+=1

    if c["judge"]:
        judges_set.add(c["judge"])

# =========================
# DATABASE
# =========================

conn = mysql.connector.connect(**DB_CONFIG)
cursor = conn.cursor()

try:

    # ---------------------------------
    # COURTS
    # ---------------------------------

    cursor.execute(
        "SELECT id FROM courts WHERE slug=%s LIMIT 1",
        (court_slug,)
    )

    row = cursor.fetchone()

    if row:
        court_id = row[0]

    else:

        cursor.execute(
        """
        INSERT INTO courts
        (slug,name,court_type,address,phone,jurisdiction,about)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            court_slug,
            court_name,
            court_type,
            None,
            None,
            f"Imported dataset {query_meta.get('date_from','')} - {query_meta.get('date_to','')}",
            f"Scraped {query_meta.get('scraped_at','')}"
        )
        )

        court_id = cursor.lastrowid

    # ---------------------------------
    # CLEAR OLD DATA
    # ---------------------------------

    cursor.execute("DELETE FROM court_cases WHERE court_id=%s",(court_id,))
    cursor.execute("DELETE FROM court_cases_per_year WHERE court_id=%s",(court_id,))
    cursor.execute("DELETE FROM court_case_type_stats WHERE court_id=%s",(court_id,))
    cursor.execute("DELETE FROM court_metrics WHERE court_id=%s",(court_id,))

    # ---------------------------------
    # INSERT CASES
    # ---------------------------------

    insert_sql = """
    INSERT INTO court_cases
    (
        court_id,
        case_id,
        type,
        subtype,
        basis_type,
        filing_date,
        status,
        judge_name,
        legal_area,
        basis_group,
        basis,
        download_link,
        summary
    )
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    rows = []

    for c in cases:

        rows.append((
            court_id,
            c["case_id"],
            c["case_type"],
            c["case_subtype"],
            c["basis_type_combined"],
            c["date"],
            c["status"],
            c["judge"],
            c["legal_area"],
            c["basis_group"],
            c["basis"],
            c["download_link"],
            c["summary"]
        ))

    BATCH=200

    for i in range(0,len(rows),BATCH):

        batch = rows[i:i+BATCH]

        cursor.executemany(insert_sql,batch)

        conn.commit()

        print("Inserted",i+len(batch))

    # ---------------------------------
    # CASES PER YEAR
    # ---------------------------------

    insert_year_sql = """
    INSERT INTO court_cases_per_year
    (court_id,year,total_cases)
    VALUES (%s,%s,%s)
    """

    rows = [(court_id,y,c) for y,c in sorted(cases_per_year.items())]

    if rows:
        cursor.executemany(insert_year_sql,rows)

    # ---------------------------------
    # TYPE STATS
    # ---------------------------------

    insert_stats_sql = """
    INSERT INTO court_case_type_stats
    (court_id,case_type_label,total_cases,sort_order)
    VALUES (%s,%s,%s,%s)
    """

    sorted_stats = sorted(case_type_stats.items(),key=lambda x:(-x[1],x[0]))

    rows=[]

    for i,(label,total) in enumerate(sorted_stats,start=1):

        rows.append((court_id,label,total,i))

    if rows:
        cursor.executemany(insert_stats_sql,rows)

    # ---------------------------------
    # COURT METRICS
    # ---------------------------------

    cursor.execute(
    """
    INSERT INTO court_metrics
    (court_id,total_cases,total_judges,active_cases)
    VALUES (%s,%s,%s,%s)
    """,
    (
        court_id,
        len(cases),
        len(judges_set),
        0
    )
    )

    conn.commit()

    print("\nImport completed")
    print("Cases:",len(cases))
    print("Judges:",len(judges_set))

except Exception as e:

    print("ERROR:",e)

    conn.rollback()

finally:

    cursor.close()
    conn.close()