export type Lang = "EN" | "MK" | "AL";

export type TKey =
  | "nav_about"
  | "nav_data"
  | "nav_dashboard"
  | "nav_research"
  | "nav_contact"
  | "nav_login"
  | "hero_eyebrow"
  | "hero_title"
  | "btn_get_insights"
  | "mission_title"
  | "mission_desc"
  | "feature_search_title"
  | "feature_search_desc"
  | "feature_ai_title"
  | "feature_ai_desc"
  | "feature_reporting_title"
  | "feature_reporting_desc"
  | "partners_label"
  | "newsletter_title"
  | "newsletter_desc"
  | "newsletter_placeholder"
  | "newsletter_btn"
  | "footer_about_heading"
  | "footer_about_text"
  | "footer_nav_heading"
  | "footer_follow_heading"
  | "footer_link_home"
  | "footer_rights"
  | "expertise_title"
  | "expertise_1_title"
  | "expertise_1_desc"
  | "expertise_2_title"
  | "expertise_2_desc"
  | "expertise_3_title"
  | "expertise_3_desc"
  | "expertise_4_title"
  | "expertise_4_desc"
  | "expertise_5_title"
  | "expertise_5_desc"
  | "expertise_6_title"
  | "expertise_6_desc"
  | "research_hero_label"
  | "research_hero_title"
  | "research_hero_subtitle"
  | "research_row_publications"
  | "research_row_analyses"
  | "research_type_publications"
  | "research_type_report"
  | "research_type_analysis"
  | "research_type_opinion"
  | "research_type_commentary"
  | "research_pub_1_title"
  | "research_pub_1_snippet"
  | "research_pub_2_title"
  | "research_pub_2_snippet"
  | "research_pub_3_title"
  | "research_pub_3_snippet"
  | "research_pub_4_title"
  | "research_pub_4_snippet"
  | "research_pub_5_title"
  | "research_pub_5_snippet"
  | "research_analysis_1_title"
  | "research_analysis_1_snippet"
  | "research_analysis_2_title"
  | "research_analysis_2_snippet"
  | "research_analysis_3_title"
  | "research_analysis_3_snippet"
  | "research_analysis_4_title"
  | "research_analysis_4_snippet"
  | "research_analysis_5_title"
  | "research_analysis_5_snippet"
  | "data_tab_courts"
  | "data_tab_judges"
  | "data_tab_cases"
  | "status_active"
  | "status_inactive"
  | "status_closed"
  | "status_unknown"
  | "court_directory_search_label"
  | "court_directory_search_placeholder"
  | "court_directory_matching_records"
  | "court_directory_loading_directory"
  | "court_directory_filter_eyebrow"
  | "court_directory_refine_results"
  | "court_directory_reset"
  | "court_directory_court_name"
  | "court_directory_court_name_placeholder"
  | "court_directory_court_type"
  | "court_directory_all_court_types"
  | "court_directory_jurisdiction"
  | "court_directory_all_jurisdictions"
  | "court_directory_status"
  | "court_directory_all_statuses"
  | "court_directory_sort"
  | "court_directory_per_page"
  | "court_directory_sort_name_asc"
  | "court_directory_sort_name_desc"
  | "court_directory_sort_jurisdiction"
  | "court_directory_sort_status"
  | "court_directory_preparing_records"
  | "court_directory_showing_results"
  | "court_directory_of"
  | "court_directory_loading_title"
  | "court_directory_loading_desc"
  | "court_directory_error_title"
  | "court_directory_empty_title"
  | "court_directory_empty_desc"
  | "court_directory_open_profile"
  | "court_directory_official_site"
  | "court_directory_no_website"
  | "pagination_previous"
  | "pagination_next"
  | "court_detail_loading"
  | "court_detail_not_found"
  | "court_detail_back"
  | "court_detail_visit_website"
  | "court_detail_about_fallback"
  | "court_detail_address"
  | "court_detail_phone"
  | "court_detail_jurisdiction"
  | "court_detail_top_case_types"
  | "court_detail_total_cases"
  | "court_detail_total_cases_per_year"
  | "court_detail_avg_time"
  | "court_detail_avg_cost"
  | "court_detail_recent_cases"
  | "court_detail_recent_cases_caption"
  | "court_detail_case_id"
  | "court_detail_type"
  | "court_detail_subtype"
  | "court_detail_basis_type"
  | "court_detail_filing_date"
  | "court_detail_status"
  | "court_detail_not_provided"
  | "court_detail_no_chart_data"
  | "court_detail_no_distribution"
  | "court_detail_no_metrics"
  | "court_detail_no_cases"
  | "judge_directory_search_label"
  | "judge_directory_search_placeholder"
  | "judge_directory_matching_records"
  | "judge_directory_loading_directory"
  | "judge_directory_filter_eyebrow"
  | "judge_directory_refine_results"
  | "judge_directory_reset"
  | "judge_directory_name"
  | "judge_directory_name_placeholder"
  | "judge_directory_area"
  | "judge_directory_all_areas"
  | "judge_directory_year_from"
  | "judge_directory_year_to"
  | "judge_directory_sort"
  | "judge_directory_per_page"
  | "judge_directory_sort_name_asc"
  | "judge_directory_sort_name_desc"
  | "judge_directory_sort_area"
  | "judge_directory_sort_year_desc"
  | "judge_directory_sort_year_asc"
  | "judge_directory_preparing_records"
  | "judge_directory_showing_results"
  | "judge_directory_of"
  | "judge_directory_loading_title"
  | "judge_directory_loading_desc"
  | "judge_directory_error_title"
  | "judge_directory_empty_title"
  | "judge_directory_empty_desc"
  | "judge_directory_role"
  | "judge_directory_elected_short"
  | "judge_directory_area_label"
  | "judge_directory_year_label"
  | "judge_directory_not_provided"
  | "judge_directory_open_profile"
  | "case_directory_search_label"
  | "case_directory_search_criteria"
  | "case_directory_search_placeholder"
  | "case_directory_matching_records"
  | "case_directory_filters_active"
  | "case_directory_loading_directory"
  | "case_directory_recent_limit_note"
  | "case_directory_filter_eyebrow"
  | "case_directory_refine_results"
  | "case_directory_reset"
  | "case_directory_court"
  | "case_directory_court_placeholder"
  | "case_directory_judge"
  | "case_directory_judge_placeholder"
  | "case_directory_legal_area"
  | "case_directory_all_areas"
  | "case_directory_status"
  | "case_directory_all_statuses"
  | "case_directory_date_from"
  | "case_directory_date_to"
  | "case_directory_preparing_records"
  | "case_directory_showing_results"
  | "case_directory_of"
  | "case_directory_sort"
  | "case_directory_sort_recent"
  | "case_directory_sort_oldest"
  | "case_directory_sort_court"
  | "case_directory_sort_judge"
  | "case_directory_sort_status"
  | "case_directory_per_page"
  | "case_directory_loading_title"
  | "case_directory_loading_desc"
  | "case_directory_error_title"
  | "case_directory_empty_title"
  | "case_directory_empty_desc"
  | "case_directory_download_document"
  | "case_directory_open_case"
  | "case_directory_relevance"
  | "case_detail_loading"
  | "case_detail_not_found"
  | "case_detail_back"
  | "case_detail_court"
  | "case_detail_judge"
  | "case_detail_legal_area"
  | "case_detail_decision_date"
  | "case_detail_case_type"
  | "case_detail_case_subtype"
  | "case_detail_basis_type"
  | "case_detail_basis"
  | "case_detail_articles"
  | "case_detail_public_prosecutor_case"
  | "case_detail_case_cost"
  | "case_detail_total_case_cost"
  | "case_detail_mitigating_factors"
  | "case_detail_plea_deal"
  | "case_detail_duration"
  | "case_detail_days"
  | "case_detail_severity_ratio"
  | "case_detail_sentence_severity"
  | "case_detail_appeal"
  | "case_detail_overview"
  | "case_detail_case_summary"
  | "case_detail_case_details"
  | "case_detail_key_insights"
  | "case_detail_timeline"
  | "case_detail_no_timeline"
  | "case_detail_related_cases"
  | "case_detail_not_provided"
  | "case_detail_no_related_cases";

export const translations: Record<Lang, Record<TKey, string>> = {
  EN: {
    nav_about: "About",
    nav_data: "Data",
    nav_dashboard: "Dashboard",
    nav_research: "Research",
    nav_contact: "Contact",
    nav_login: "Login",
    hero_eyebrow: "Judiciary Intelligence Platform",
    hero_title: "Judiciary Intelligence Platform",
    btn_get_insights: "Get Insights",
    mission_title: "Empowering justice\nthrough intelligent\ninsights.",
    mission_desc:
      "By embracing innovation, we are not only advancing legal decision-making but also reducing reliance on outdated systems, fostering fairness, and ensuring that justice is both efficient and equitable.",
    feature_search_title: "Advanced Search Options",
    feature_search_desc:
      "Provides cutting-edge advanced search options that allow users to pinpoint relevant cases, statutes, and legal precedents with unmatched precision. With filters, keywords, and contextual analysis, users can efficiently navigate vast legal databases to find exactly what they need in seconds.",
    feature_ai_title: "AI-Driven Insights",
    feature_ai_desc:
      "Leverage AI-driven legal insights to uncover patterns, predict outcomes, and gain a deeper understanding of legal contexts. The platform analyzes complex data sets to support confident, data-backed decisions.",
    feature_reporting_title: "Tailored Reporting Tools",
    feature_reporting_desc:
      "Create professional reports tailored to the needs of legal teams and institutions, combining searches and analytics into a clear, actionable format.",
    partners_label: "OUR PARTNERS",
    newsletter_title: "Subscribe to our newsletter",
    newsletter_desc: "Stay updated with the latest legal data insights.",
    newsletter_placeholder: "Enter your email",
    newsletter_btn: "Subscribe",
    footer_about_heading: "About JusticiaAI",
    footer_about_text:
      "JusticiaAI turns judicial and legal information into clear, accessible insights that support transparency, efficiency, and better decision-making.",
    footer_nav_heading: "Navigation",
    footer_follow_heading: "Follow us",
    footer_link_home: "Home",
    footer_rights: "© 2026 JusticiaAI. All rights reserved.",
    expertise_title: "Areas of Expertise",
    expertise_1_title: "Case Documentation",
    expertise_1_desc:
      "Organize judicial records, filings, and legal documents in a structured and accessible way.",
    expertise_2_title: "Legal Analysis",
    expertise_2_desc:
      "Turn judicial data into clear insights that support legal interpretation and decision-making.",
    expertise_3_title: "Court Intelligence",
    expertise_3_desc:
      "Track proceedings, legal activity, and relevant patterns through a modern data-driven platform.",
    expertise_4_title: "Compliance Review",
    expertise_4_desc:
      "Support transparency and accountability with tools built for oversight and verification workflows.",
    expertise_5_title: "Institutional Oversight",
    expertise_5_desc:
      "Provide better visibility into judicial institutions, structures, and administrative legal data.",
    expertise_6_title: "Practice Support",
    expertise_6_desc:
      "Help legal professionals work faster with organized information, clean dashboards, and smart insights.",
    research_hero_label: "Research & Insights",
    research_hero_title: "Judicial Research, Analysis, and Legal Intelligence",
    research_hero_subtitle:
      "Explore publications, expert analysis, and judicial commentary presented in a modern editorial format designed for clarity, professionalism, and accessibility.",
    research_row_publications: "Publications",
    research_row_analyses: "Analysis & Commentary",
    research_type_publications: "Publications",
    research_type_report: "Report",
    research_type_analysis: "Analysis",
    research_type_opinion: "Opinion",
    research_type_commentary: "Commentary",
    research_pub_1_title: "Berlin Process and The Way Forward",
    research_pub_1_snippet:
      "Analysis of the Chair's Conclusions and impact on the Berlin Process 2025.",
    research_pub_2_title: "From Resilience to Renewal: Economic Outlook",
    research_pub_2_snippet:
      "The 2025 Annual Meetings marked a turning point in global economic strategy.",
    research_pub_3_title: "G7 Summit 2025: Strategic Cooperation",
    research_pub_3_snippet:
      "Changes in Kananaskis, Canada, come at a time of significant geopolitical uncertainty.",
    research_pub_4_title: "Investing in Climate for Growth",
    research_pub_4_snippet:
      "New OECD-UNDP reporting shows how climate action can drive economic growth.",
    research_pub_5_title: "Eurobarometer: Trust in EU Institutions",
    research_pub_5_snippet:
      "More than half of Europeans tend to trust the EU, the highest result since 2014.",
    research_analysis_1_title: "AI Liability Directives",
    research_analysis_1_snippet:
      "Navigating the new EU framework for civil liability in artificial intelligence systems.",
    research_analysis_2_title: "Smart Contract Validity",
    research_analysis_2_snippet:
      "Examining the legal enforceability of blockchain-based agreements in commercial law.",
    research_analysis_3_title: "Digital Rights Charter",
    research_analysis_3_snippet:
      "Proposed amendments to data privacy laws protecting citizen rights in the metaverse.",
    research_analysis_4_title: "Judicial Analytics",
    research_analysis_4_snippet:
      "Leveraging big data to improve caseflow management and reduce court backlogs.",
    research_analysis_5_title: "Cross-Border Protocols",
    research_analysis_5_snippet:
      "Standardizing e-evidence procedures across member states for faster resolution.",
    data_tab_courts: "Courts",
    data_tab_judges: "Judges",
    data_tab_cases: "Cases",
    status_active: "Active",
    status_inactive: "Inactive",
    status_closed: "Closed",
    status_unknown: "Unknown",
    court_directory_search_label: "Search courts",
    court_directory_search_placeholder: "Search by court, address, phone, or website",
    court_directory_matching_records: "matching records",
    court_directory_loading_directory: "Loading court directory...",
    court_directory_filter_eyebrow: "Filter courts",
    court_directory_refine_results: "Refine results",
    court_directory_reset: "Reset",
    court_directory_court_name: "Court name",
    court_directory_court_name_placeholder: "Type a court name",
    court_directory_court_type: "Court type",
    court_directory_all_court_types: "All court types",
    court_directory_jurisdiction: "Jurisdiction",
    court_directory_all_jurisdictions: "All jurisdictions",
    court_directory_status: "Status",
    court_directory_all_statuses: "All statuses",
    court_directory_sort: "Sort",
    court_directory_per_page: "Per page",
    court_directory_sort_name_asc: "Name A-Z",
    court_directory_sort_name_desc: "Name Z-A",
    court_directory_sort_jurisdiction: "Jurisdiction",
    court_directory_sort_status: "Status",
    court_directory_preparing_records: "Preparing records...",
    court_directory_showing_results: "Showing",
    court_directory_of: "of",
    court_directory_loading_title: "Loading courts",
    court_directory_loading_desc: "The public directory is pulling the latest records from the database.",
    court_directory_error_title: "Could not load courts",
    court_directory_empty_title: "No courts match these filters",
    court_directory_empty_desc: "Adjust the filters or reset them to view the full directory.",
    court_directory_open_profile: "Open profile",
    court_directory_official_site: "Official site",
    court_directory_no_website: "No website listed",
    pagination_previous: "Previous",
    pagination_next: "Next",
    court_detail_loading: "Loading court...",
    court_detail_not_found: "Court not found",
    court_detail_back: "Back to Courts",
    court_detail_visit_website: "Visit Website",
    court_detail_about_fallback: "No description has been added for this court yet.",
    court_detail_address: "Address",
    court_detail_phone: "Phone",
    court_detail_jurisdiction: "Jurisdiction",
    court_detail_top_case_types: "Top 3 Case Types",
    court_detail_total_cases: "Total Cases",
    court_detail_total_cases_per_year: "Total Cases per Year",
    court_detail_avg_time: "Average Time per Case Type",
    court_detail_avg_cost: "Average Cost per Case Type",
    court_detail_recent_cases: "Recent Cases",
    court_detail_recent_cases_caption: "Showing the 10 most recent court cases",
    court_detail_case_id: "Case ID",
    court_detail_type: "Type",
    court_detail_subtype: "Subtype",
    court_detail_basis_type: "Basis Type",
    court_detail_filing_date: "Filing Date",
    court_detail_status: "Status",
    court_detail_not_provided: "Not provided",
    court_detail_no_chart_data: "No chart data available yet.",
    court_detail_no_distribution: "No distribution data available yet.",
    court_detail_no_metrics: "No court metrics are available yet for this record.",
    court_detail_no_cases: "No cases are available for this court yet.",
    judge_directory_search_label: "Search judges",
    judge_directory_search_placeholder: "Search by judge, area, or year",
    judge_directory_matching_records: "matching records",
    judge_directory_loading_directory: "Loading judges directory...",
    judge_directory_filter_eyebrow: "Filter judges",
    judge_directory_refine_results: "Refine results",
    judge_directory_reset: "Reset",
    judge_directory_name: "Judge name",
    judge_directory_name_placeholder: "Type a judge name",
    judge_directory_area: "Area of work",
    judge_directory_all_areas: "All areas",
    judge_directory_year_from: "From year",
    judge_directory_year_to: "To year",
    judge_directory_sort: "Sort",
    judge_directory_per_page: "Per page",
    judge_directory_sort_name_asc: "Name A-Z",
    judge_directory_sort_name_desc: "Name Z-A",
    judge_directory_sort_area: "Area",
    judge_directory_sort_year_desc: "Newest election",
    judge_directory_sort_year_asc: "Oldest election",
    judge_directory_preparing_records: "Preparing records...",
    judge_directory_showing_results: "Showing",
    judge_directory_of: "of",
    judge_directory_loading_title: "Loading judges",
    judge_directory_loading_desc: "The public directory is pulling the latest judge records from the database.",
    judge_directory_error_title: "Could not load judges",
    judge_directory_empty_title: "No judges match these filters",
    judge_directory_empty_desc: "Adjust the filters or reset them to view the full directory.",
    judge_directory_role: "Judge",
    judge_directory_elected_short: "Elected",
    judge_directory_area_label: "Area",
    judge_directory_year_label: "Election year",
    judge_directory_not_provided: "Not provided",
    judge_directory_open_profile: "Open profile",
    case_directory_search_label: "Search cases",
    case_directory_search_criteria: "Search Criteria",
    case_directory_search_placeholder: "Search by case ID, court, judge, legal area, or summary",
    case_directory_matching_records: "matching records",
    case_directory_filters_active: "filters active",
    case_directory_loading_directory: "Loading case directory...",
    case_directory_recent_limit_note: "Showing the 100 most recent cases by default",
    case_directory_filter_eyebrow: "Filter cases",
    case_directory_refine_results: "Refine results",
    case_directory_reset: "Reset",
    case_directory_court: "Court",
    case_directory_court_placeholder: "Type a court name",
    case_directory_judge: "Judge",
    case_directory_judge_placeholder: "Type a judge name",
    case_directory_legal_area: "Legal area",
    case_directory_all_areas: "All legal areas",
    case_directory_status: "Status",
    case_directory_all_statuses: "All statuses",
    case_directory_date_from: "Date from",
    case_directory_date_to: "Date to",
    case_directory_preparing_records: "Preparing records...",
    case_directory_showing_results: "Showing",
    case_directory_of: "of",
    case_directory_sort: "Sort",
    case_directory_sort_recent: "Most recent",
    case_directory_sort_oldest: "Oldest first",
    case_directory_sort_court: "Court",
    case_directory_sort_judge: "Judge",
    case_directory_sort_status: "Status",
    case_directory_per_page: "Per page",
    case_directory_loading_title: "Loading cases",
    case_directory_loading_desc: "The public directory is pulling the latest case records from the database.",
    case_directory_error_title: "Could not load cases",
    case_directory_empty_title: "No cases match these filters",
    case_directory_empty_desc: "Adjust the filters or reset them to view matching cases.",
    case_directory_download_document: "Download document",
    case_directory_open_case: "Open case",
    case_directory_relevance: "Relevance",
    case_detail_loading: "Loading case...",
    case_detail_not_found: "Case not found",
    case_detail_back: "Back to Cases",
    case_detail_court: "Court",
    case_detail_judge: "Judge",
    case_detail_legal_area: "Legal area",
    case_detail_decision_date: "Decision date",
    case_detail_case_type: "Case type",
    case_detail_case_subtype: "Case subtype",
    case_detail_basis_type: "Basis type",
    case_detail_basis: "Basis",
    case_detail_articles: "Articles",
    case_detail_public_prosecutor_case: "Public prosecutor case",
    case_detail_case_cost: "Case cost",
    case_detail_total_case_cost: "Total case cost",
    case_detail_mitigating_factors: "Mitigating factors",
    case_detail_plea_deal: "Plea deal",
    case_detail_duration: "Duration",
    case_detail_days: "days",
    case_detail_severity_ratio: "Severity ratio",
    case_detail_sentence_severity: "Sentence severity",
    case_detail_appeal: "Appeal",
    case_detail_overview: "Overview",
    case_detail_case_summary: "Case Summary",
    case_detail_case_details: "Case Details",
    case_detail_key_insights: "Key insights",
    case_detail_timeline: "Timeline",
    case_detail_no_timeline: "No timeline is available for this case yet.",
    case_detail_related_cases: "Related cases",
    case_detail_not_provided: "Not provided",
    case_detail_no_related_cases: "No related cases are available yet.",
  },

  MK: {
    nav_about: "За нас",
    nav_data: "Податоци",
    nav_dashboard: "Контролна табла",
    nav_research: "Истражувања",
    nav_contact: "Контакт",
    nav_login: "Најава",
    hero_eyebrow: "Платформа за судска интелигенција",
    hero_title: "Платформа за судска интелигенција",
    btn_get_insights: "Види анализи",
    mission_title: "Зајакнување на правдата\nпреку интелигентни\nувиди.",
    mission_desc:
      "Со прифаќање на иновациите, ја унапредуваме правната одлука, ја намалуваме зависноста од застарени системи и обезбедуваме правдата да биде ефикасна и правична.",
    feature_search_title: "Напредно пребарување",
    feature_search_desc:
      "Напредни опции за пребарување со филтри, клучни зборови и контекстуална анализа за брзо пронаоѓање релевантни предмети и преседани.",
    feature_ai_title: "AI-увиди",
    feature_ai_desc:
      "AI анализа за откривање обрасци, предвидување исходи и подобро разбирање на контекстот за посигурни одлуки.",
    feature_reporting_title: "Извештаи по мерка",
    feature_reporting_desc:
      "Професионални извештаи што ги обединуваат пребарувањето и аналитиката во јасен и употреблив формат.",
    partners_label: "НАШИ ПАРТНЕРИ",
    newsletter_title: "Претплати се на билтен",
    newsletter_desc: "Биди во тек со најновите правни увиди.",
    newsletter_placeholder: "Внеси е-пошта",
    newsletter_btn: "Претплати се",
    footer_about_heading: "За JusticiaAI",
    footer_about_text:
      "JusticiaAI ги претвора судските и правните информации во јасни и достапни увиди што поддржуваат транспарентност, ефикасност и подобро одлучување.",
    footer_nav_heading: "Навигација",
    footer_follow_heading: "Следете нè",
    footer_link_home: "Почетна",
    footer_rights: "© 2026 JusticiaAI. Сите права задржани.",
    expertise_title: "Области на експертиза",
    expertise_1_title: "Документација на предмети",
    expertise_1_desc:
      "Организирај судски записи, поднесоци и правни документи на структуриран и достапен начин.",
    expertise_2_title: "Правна анализа",
    expertise_2_desc:
      "Претвори ги судските податоци во јасни увиди што поддржуваат правно толкување и одлучување.",
    expertise_3_title: "Судска интелигенција",
    expertise_3_desc:
      "Следи постапки, правна активност и важни обрасци преку современа платформа базирана на податоци.",
    expertise_4_title: "Проверка на усогласеност",
    expertise_4_desc:
      "Поддржи транспарентност и отчетност со алатки создадени за надзор и верификација.",
    expertise_5_title: "Институционален надзор",
    expertise_5_desc:
      "Обезбеди подобар увид во судските институции, структури и административни правни податоци.",
    expertise_6_title: "Поддршка за пракса",
    expertise_6_desc:
      "Помогни им на правните професионалци да работат побрзо со организирани информации и паметни увиди.",
    research_hero_label: "Истражувања и увиди",
    research_hero_title: "Судски истражувања, анализи и правна интелигенција",
    research_hero_subtitle:
      "Истражете публикации, стручни анализи и судски коментари претставени во модерен уреднички формат создаден за јасност, професионалност и пристапност.",
    research_row_publications: "Публикации",
    research_row_analyses: "Анализи и коментари",
    research_type_publications: "Публикации",
    research_type_report: "Извештај",
    research_type_analysis: "Анализа",
    research_type_opinion: "Мислење",
    research_type_commentary: "Коментар",
    research_pub_1_title: "Берлинскиот процес и патот напред",
    research_pub_1_snippet:
      "Анализа на заклучоците на претседавачот и нивното влијание врз Берлинскиот процес 2025.",
    research_pub_2_title: "Од отпорност кон обновување: економски изгледи",
    research_pub_2_snippet:
      "Годишните средби во 2025 година означија пресвртница во глобалната економска стратегија.",
    research_pub_3_title: "Самитот Г7 2025: стратешка соработка",
    research_pub_3_snippet:
      "Промените во Кананаскис, Канада, доаѓаат во време на значителна геополитичка неизвесност.",
    research_pub_4_title: "Инвестирање во климата за раст",
    research_pub_4_snippet:
      "Новите извештаи на OECD и UNDP покажуваат како климатската акција може да поттикне економски раст.",
    research_pub_5_title: "Евробарометар: доверба во институциите на ЕУ",
    research_pub_5_snippet:
      "Повеќе од половина Европејци имаат доверба во ЕУ, што е највисок резултат од 2014 година.",
    research_analysis_1_title: "Директиви за одговорност на AI",
    research_analysis_1_snippet:
      "Ориентирање низ новата рамка на ЕУ за граѓанска одговорност кај системите со вештачка интелигенција.",
    research_analysis_2_title: "Валидност на паметни договори",
    research_analysis_2_snippet:
      "Испитување на правната извршливост на договори базирани на блокчејн во трговското право.",
    research_analysis_3_title: "Повелба за дигитални права",
    research_analysis_3_snippet:
      "Предложени измени на законите за приватност на податоци што ги штитат правата на граѓаните во метаверзумот.",
    research_analysis_4_title: "Судска аналитика",
    research_analysis_4_snippet:
      "Користење на големи податоци за подобро управување со предмети и намалување на судските заостанувања.",
    research_analysis_5_title: "Прекугранични протоколи",
    research_analysis_5_snippet:
      "Стандардизирање на процедурите за е-докази меѓу државите за побрзо решавање.",
    data_tab_courts: "Судови",
    data_tab_judges: "Судии",
    data_tab_cases: "Предмети",
    status_active: "Активен",
    status_inactive: "Неактивен",
    status_closed: "Затворен",
    status_unknown: "Непознато",
    court_directory_search_label: "Пребарај судови",
    court_directory_search_placeholder: "Пребарувај по суд, адреса, телефон или веб-страница",
    court_directory_matching_records: "совпаѓања",
    court_directory_loading_directory: "Се вчитува именикот на судови...",
    court_directory_filter_eyebrow: "Филтри",
    court_directory_refine_results: "Прецизирај резултати",
    court_directory_reset: "Ресетирај",
    court_directory_court_name: "Име на суд",
    court_directory_court_name_placeholder: "Внеси име на суд",
    court_directory_court_type: "Тип на суд",
    court_directory_all_court_types: "Сите типови на судови",
    court_directory_jurisdiction: "Надлежност",
    court_directory_all_jurisdictions: "Сите надлежности",
    court_directory_status: "Статус",
    court_directory_all_statuses: "Сите статуси",
    court_directory_sort: "Подреди",
    court_directory_per_page: "По страница",
    court_directory_sort_name_asc: "Име A-Z",
    court_directory_sort_name_desc: "Име Z-A",
    court_directory_sort_jurisdiction: "Надлежност",
    court_directory_sort_status: "Статус",
    court_directory_preparing_records: "Се подготвуваат записите...",
    court_directory_showing_results: "Прикажани",
    court_directory_of: "од",
    court_directory_loading_title: "Се вчитуваат судовите",
    court_directory_loading_desc: "Именикот ги презема најновите записи од базата.",
    court_directory_error_title: "Судовите не можеа да се вчитаат",
    court_directory_empty_title: "Нема судови што одговараат на филтрите",
    court_directory_empty_desc: "Промени ги филтрите или ресетирај ги за да го видиш целиот именик.",
    court_directory_open_profile: "Отвори профил",
    court_directory_official_site: "Официјална страница",
    court_directory_no_website: "Нема веб-страница",
    pagination_previous: "Претходна",
    pagination_next: "Следна",
    court_detail_loading: "Се вчитува судот...",
    court_detail_not_found: "Судот не е пронајден",
    court_detail_back: "Назад кон судови",
    court_detail_visit_website: "Отвори веб-страница",
    court_detail_about_fallback: "Сè уште нема додаден опис за овој суд.",
    court_detail_address: "Адреса",
    court_detail_phone: "Телефон",
    court_detail_jurisdiction: "Надлежност",
    court_detail_top_case_types: "Топ 3 типови на предмети",
    court_detail_total_cases: "Вкупно предмети",
    court_detail_total_cases_per_year: "Вкупно предмети по година",
    court_detail_avg_time: "Просечно време по тип на предмет",
    court_detail_avg_cost: "Просечен трошок по тип на предмет",
    court_detail_recent_cases: "Најнови предмети",
    court_detail_recent_cases_caption: "Прикажани се 10-те најнови предмети",
    court_detail_case_id: "ID на предмет",
    court_detail_type: "Тип",
    court_detail_subtype: "Подтип",
    court_detail_basis_type: "Основ на предмет",
    court_detail_filing_date: "Датум на поднесување",
    court_detail_status: "Статус",
    court_detail_not_provided: "Не е достапно",
    court_detail_no_chart_data: "Сè уште нема достапни податоци за графикот.",
    court_detail_no_distribution: "Сè уште нема достапна распределба.",
    court_detail_no_metrics: "Сè уште нема достапни метрики за овој запис.",
    court_detail_no_cases: "Сè уште нема достапни предмети за овој суд.",
    judge_directory_search_label: "Пребарај судии",
    judge_directory_search_placeholder: "Пребарувај по судија, област или година",
    judge_directory_matching_records: "совпаѓања",
    judge_directory_loading_directory: "Се вчитува именикот на судии...",
    judge_directory_filter_eyebrow: "Филтри",
    judge_directory_refine_results: "Прецизирај резултати",
    judge_directory_reset: "Ресетирај",
    judge_directory_name: "Име на судија",
    judge_directory_name_placeholder: "Внеси име на судија",
    judge_directory_area: "Област на работа",
    judge_directory_all_areas: "Сите области",
    judge_directory_year_from: "Од година",
    judge_directory_year_to: "До година",
    judge_directory_sort: "Подреди",
    judge_directory_per_page: "По страница",
    judge_directory_sort_name_asc: "Име A-Z",
    judge_directory_sort_name_desc: "Име Z-A",
    judge_directory_sort_area: "Област",
    judge_directory_sort_year_desc: "Најнова изборна година",
    judge_directory_sort_year_asc: "Најстара изборна година",
    judge_directory_preparing_records: "Се подготвуваат записите...",
    judge_directory_showing_results: "Прикажани",
    judge_directory_of: "од",
    judge_directory_loading_title: "Се вчитуваат судиите",
    judge_directory_loading_desc: "Именикот ги презема најновите записи за судии од базата.",
    judge_directory_error_title: "Судиите не можеа да се вчитаат",
    judge_directory_empty_title: "Нема судии што одговараат на филтрите",
    judge_directory_empty_desc: "Промени ги филтрите или ресетирај ги за да го видиш целиот именик.",
    judge_directory_role: "Судија",
    judge_directory_elected_short: "Избран",
    judge_directory_area_label: "Област",
    judge_directory_year_label: "Година на избор",
    judge_directory_not_provided: "Не е достапно",
    judge_directory_open_profile: "Отвори профил",
    case_directory_search_label: "Пребарај предмети",
    case_directory_search_placeholder: "Пребарај по ID на предмет, суд, судија, правна област или опис",
    case_directory_matching_records: "совпаѓања",
    case_directory_loading_directory: "Се вчитува именикот на предмети...",
    case_directory_recent_limit_note: "Стандардно се прикажуваат 100-те најнови предмети",
    case_directory_filter_eyebrow: "Филтри",
    case_directory_refine_results: "Прецизирај резултати",
    case_directory_reset: "Ресетирај",
    case_directory_court: "Суд",
    case_directory_court_placeholder: "Внеси име на суд",
    case_directory_judge: "Судија",
    case_directory_judge_placeholder: "Внеси име на судија",
    case_directory_legal_area: "Правна област",
    case_directory_all_areas: "Сите правни области",
    case_directory_status: "Статус",
    case_directory_all_statuses: "Сите статуси",
    case_directory_date_from: "Датум од",
    case_directory_date_to: "Датум до",
    case_directory_preparing_records: "Се подготвуваат записите...",
    case_directory_showing_results: "Прикажани",
    case_directory_of: "од",
    case_directory_sort: "Подреди",
    case_directory_sort_recent: "Најнови",
    case_directory_sort_oldest: "Најстари",
    case_directory_sort_court: "Суд",
    case_directory_sort_judge: "Судија",
    case_directory_sort_status: "Статус",
    case_directory_per_page: "По страница",
    case_directory_loading_title: "Се вчитуваат предметите",
    case_directory_loading_desc: "Јавниот именик ги презема најновите записи за предмети од базата.",
    case_directory_error_title: "Предметите не можеа да се вчитаат",
    case_directory_empty_title: "Нема предмети што одговараат на филтрите",
    case_directory_empty_desc: "Промени ги филтрите или ресетирај ги за да ги видиш соодветните предмети.",
    case_directory_open_case: "Отвори предмет",
    case_detail_loading: "Се вчитува предметот...",
    case_detail_not_found: "Предметот не е пронајден",
    case_detail_back: "Назад кон предмети",
    case_detail_court: "Суд",
    case_detail_judge: "Судија",
    case_detail_legal_area: "Правна област",
    case_detail_decision_date: "Датум на одлука",
    case_detail_case_type: "Тип на предмет",
    case_detail_case_subtype: "Подтип на предмет",
    case_detail_basis_type: "Тип на основ",
    case_detail_basis: "Основ",
    case_detail_articles: "Членови",
    case_detail_public_prosecutor_case: "Предмет на јавно обвинителство",
    case_detail_case_cost: "Трошок на предмет",
    case_detail_total_case_cost: "Вкупен трошок на предмет",
    case_detail_mitigating_factors: "Олеснителни околности",
    case_detail_plea_deal: "Спогодба за признавање вина",
    case_detail_duration: "Времетраење",
    case_detail_days: "дена",
    case_detail_severity_ratio: "Однос на тежина",
    case_detail_sentence_severity: "Тежина на пресуда",
    case_detail_appeal: "Жалба",
    case_detail_overview: "Преглед",
    case_detail_case_summary: "Резиме на предметот",
    case_detail_case_details: "Детали за предметот",
    case_detail_key_insights: "Клучни увиди",
    case_detail_timeline: "Временска линија",
    case_detail_no_timeline: "Сè уште нема временска линија за овој предмет.",
    case_detail_related_cases: "Поврзани предмети",
    case_detail_not_provided: "Не е достапно",
    case_detail_no_related_cases: "Сè уште нема поврзани предмети.",
    case_directory_search_criteria: "Kriteriumi za prebaruvanje",
    case_directory_filters_active: "aktivni filtri",
    case_directory_download_document: "Prezemi dokument",
    case_directory_relevance: "Relevantnost",
  },

  AL: {
    nav_about: "Rreth nesh",
    nav_data: "Të dhëna",
    nav_dashboard: "Paneli",
    nav_research: "Kërkim",
    nav_contact: "Kontakt",
    nav_login: "Hyrje",
    hero_eyebrow: "Platformë Inteligjence Gjyqësore",
    hero_title: "Platformë Inteligjence Gjyqësore",
    btn_get_insights: "Shiko analizat",
    mission_title: "Fuqizimi i drejtësisë\npërmes\nnjohurive inteligjente.",
    mission_desc:
      "Duke përqafuar inovacionin, ne avancojmë vendimmarrjen ligjore, ulim varësinë nga sistemet e vjetra dhe sigurojmë që drejtësia të jetë efikase dhe e drejtë.",
    feature_search_title: "Kërkim i avancuar",
    feature_search_desc:
      "Opsione të avancuara kërkimi me filtra, fjalë kyçe dhe analizë kontekstuale për të gjetur shpejt çështjet dhe precedentët më të rëndësishëm.",
    feature_ai_title: "Njohuri me AI",
    feature_ai_desc:
      "Analizë me AI për të zbuluar modele, parashikuar rezultate dhe kuptuar më mirë kontekstin për vendime më të sigurta.",
    feature_reporting_title: "Raporte të personalizuara",
    feature_reporting_desc:
      "Raporte profesionale që bashkojnë kërkimin dhe analitikën në një format të qartë dhe të përdorshëm.",
    partners_label: "PARTNERËT TANË",
    newsletter_title: "Abonohu në newsletter",
    newsletter_desc: "Qëndro i përditësuar me njohuritë më të reja ligjore.",
    newsletter_placeholder: "Shkruaj email-in",
    newsletter_btn: "Abonohu",
    footer_about_heading: "Rreth JusticiaAI",
    footer_about_text:
      "JusticiaAI i kthen të dhënat gjyqësore dhe ligjore në njohuri të qarta dhe të qasshme që mbështesin transparencën, efikasitetin dhe vendimmarrjen më të mirë.",
    footer_nav_heading: "Navigimi",
    footer_follow_heading: "Na ndiqni",
    footer_link_home: "Ballina",
    footer_rights: "© 2026 JusticiaAI. Të gjitha të drejtat e rezervuara.",
    expertise_title: "Fushat e ekspertizës",
    expertise_1_title: "Dokumentimi i rasteve",
    expertise_1_desc:
      "Organizo të dhënat gjyqësore, parashtresat dhe dokumentet ligjore në mënyrë të strukturuar dhe të qasshme.",
    expertise_2_title: "Analizë ligjore",
    expertise_2_desc:
      "Shndërro të dhënat gjyqësore në njohuri të qarta që mbështesin interpretimin dhe vendimmarrjen ligjore.",
    expertise_3_title: "Inteligjencë gjyqësore",
    expertise_3_desc:
      "Ndjek procedurat, aktivitetin ligjor dhe modelet e rëndësishme përmes një platforme moderne të bazuar në të dhëna.",
    expertise_4_title: "Rishikim i pajtueshmërisë",
    expertise_4_desc:
      "Mbështet transparencën dhe llogaridhënien me mjete të ndërtuara për mbikëqyrje dhe verifikim.",
    expertise_5_title: "Mbikëqyrje institucionale",
    expertise_5_desc:
      "Ofron pamje më të qartë mbi institucionet gjyqësore, strukturat dhe të dhënat administrative ligjore.",
    expertise_6_title: "Mbështetje për praktikën",
    expertise_6_desc:
      "Ndihmo profesionistët ligjorë të punojnë më shpejt me informacion të organizuar dhe njohuri inteligjente.",
    research_hero_label: "Kërkim dhe njohuri",
    research_hero_title: "Kërkim gjyqësor, analiza dhe inteligjencë ligjore",
    research_hero_subtitle:
      "Eksploroni publikime, analiza eksperte dhe komente gjyqësore të paraqitura në një format editorial modern të krijuar për qartësi, profesionalizëm dhe qasje.",
    research_row_publications: "Publikime",
    research_row_analyses: "Analiza dhe komente",
    research_type_publications: "Publikime",
    research_type_report: "Raport",
    research_type_analysis: "Analizë",
    research_type_opinion: "Opinion",
    research_type_commentary: "Koment",
    research_pub_1_title: "Procesi i Berlinit dhe rruga përpara",
    research_pub_1_snippet:
      "Analizë e përfundimeve të kryesimit dhe ndikimit të tyre mbi Procesin e Berlinit 2025.",
    research_pub_2_title: "Nga qëndrueshmëria te ripërtëritja: perspektiva ekonomike",
    research_pub_2_snippet:
      "Takimet vjetore të vitit 2025 shënuan një pikë kthese në strategjinë ekonomike globale.",
    research_pub_3_title: "Samiti G7 2025: bashkëpunim strategjik",
    research_pub_3_snippet:
      "Ndryshimet në Kananaskis, Kanada, po ndodhin në një kohë pasigurie të madhe gjeopolitike.",
    research_pub_4_title: "Investimi në klimë për rritje",
    research_pub_4_snippet:
      "Raportimi i ri i OECD dhe UNDP tregon se si veprimi klimatik mund të nxisë rritjen ekonomike.",
    research_pub_5_title: "Eurobarometri: besimi në institucionet e BE-së",
    research_pub_5_snippet:
      "Më shumë se gjysma e evropianëve kanë besim te BE-ja, niveli më i lartë që nga viti 2014.",
    research_analysis_1_title: "Direktivat për përgjegjësinë e AI",
    research_analysis_1_snippet:
      "Orientim në kuadrin e ri të BE-së për përgjegjësinë civile në sistemet e inteligjencës artificiale.",
    research_analysis_2_title: "Vlefshmëria e kontratave inteligjente",
    research_analysis_2_snippet:
      "Shqyrtim i zbatueshmërisë juridike të marrëveshjeve të bazuara në blockchain në të drejtën tregtare.",
    research_analysis_3_title: "Karta e të drejtave digjitale",
    research_analysis_3_snippet:
      "Ndryshime të propozuara në ligjet e privatësisë së të dhënave që mbrojnë të drejtat e qytetarëve në metaverse.",
    research_analysis_4_title: "Analitikë gjyqësore",
    research_analysis_4_snippet:
      "Përdorimi i të dhënave të mëdha për të përmirësuar menaxhimin e çështjeve dhe për të ulur vonesat në gjykata.",
    research_analysis_5_title: "Protokolle ndërkufitare",
    research_analysis_5_snippet:
      "Standardizimi i procedurave të e-provave ndërmjet shteteve për zgjidhje më të shpejtë.",
    data_tab_courts: "Gjykatat",
    data_tab_judges: "Gjyqtarët",
    data_tab_cases: "Rastet",
    status_active: "Aktive",
    status_inactive: "Jo aktive",
    status_closed: "Mbyllur",
    status_unknown: "E panjohur",
    court_directory_search_label: "Kërko gjykata",
    court_directory_search_placeholder: "Kërko sipas gjykatës, adresës, telefonit ose faqes web",
    court_directory_matching_records: "rezultate përputhëse",
    court_directory_loading_directory: "Po ngarkohet direktoria e gjykatave...",
    court_directory_filter_eyebrow: "Filtra",
    court_directory_refine_results: "Përpunoni rezultatet",
    court_directory_reset: "Rivendos",
    court_directory_court_name: "Emri i gjykatës",
    court_directory_court_name_placeholder: "Shkruaj emrin e gjykatës",
    court_directory_court_type: "Lloji i gjykatës",
    court_directory_all_court_types: "Të gjitha llojet e gjykatave",
    court_directory_jurisdiction: "Juridiksioni",
    court_directory_all_jurisdictions: "Të gjitha juridiksionet",
    court_directory_status: "Statusi",
    court_directory_all_statuses: "Të gjitha statuset",
    court_directory_sort: "Rendit",
    court_directory_per_page: "Për faqe",
    court_directory_sort_name_asc: "Emri A-Z",
    court_directory_sort_name_desc: "Emri Z-A",
    court_directory_sort_jurisdiction: "Juridiksioni",
    court_directory_sort_status: "Statusi",
    court_directory_preparing_records: "Po përgatiten të dhënat...",
    court_directory_showing_results: "Duke shfaqur",
    court_directory_of: "nga",
    court_directory_loading_title: "Po ngarkohen gjykatat",
    court_directory_loading_desc: "Direktoria publike po merr të dhënat më të fundit nga databaza.",
    court_directory_error_title: "Gjykatat nuk mund të ngarkoheshin",
    court_directory_empty_title: "Asnjë gjykatë nuk përputhet me këta filtra",
    court_directory_empty_desc: "Ndrysho filtrat ose rivendosi për të parë të gjithë drejtorinë.",
    court_directory_open_profile: "Hap profilin",
    court_directory_official_site: "Faqja zyrtare",
    court_directory_no_website: "Nuk ka faqe web",
    pagination_previous: "Mbrapa",
    pagination_next: "Përpara",
    court_detail_loading: "Po ngarkohet gjykata...",
    court_detail_not_found: "Gjykata nuk u gjet",
    court_detail_back: "Kthehu te gjykatat",
    court_detail_visit_website: "Vizito faqen web",
    court_detail_about_fallback: "Ende nuk është shtuar një përshkrim për këtë gjykatë.",
    court_detail_address: "Adresa",
    court_detail_phone: "Telefoni",
    court_detail_jurisdiction: "Juridiksioni",
    court_detail_top_case_types: "Top 3 llojet e rasteve",
    court_detail_total_cases: "Rastet totale",
    court_detail_total_cases_per_year: "Rastet totale për vit",
    court_detail_avg_time: "Koha mesatare për lloj rasti",
    court_detail_avg_cost: "Kostoja mesatare për lloj rasti",
    court_detail_recent_cases: "Rastet më të fundit",
    court_detail_recent_cases_caption: "Shfaqen 10 rastet më të fundit të gjykatës",
    court_detail_case_id: "ID e rastit",
    court_detail_type: "Lloji",
    court_detail_subtype: "Nënlloji",
    court_detail_basis_type: "Baza e rastit",
    court_detail_filing_date: "Data e paraqitjes",
    court_detail_status: "Statusi",
    court_detail_not_provided: "Nuk është dhënë",
    court_detail_no_chart_data: "Ende nuk ka të dhëna për grafikun.",
    court_detail_no_distribution: "Ende nuk ka të dhëna për shpërndarjen.",
    court_detail_no_metrics: "Ende nuk ka metrika për këtë regjistrim.",
    court_detail_no_cases: "Ende nuk ka raste për këtë gjykatë.",
    judge_directory_search_label: "Kërko gjyqtarë",
    judge_directory_search_placeholder: "Kërko sipas gjyqtarit, fushës ose vitit",
    judge_directory_matching_records: "rezultate përputhëse",
    judge_directory_loading_directory: "Po ngarkohet direktoria e gjyqtarëve...",
    judge_directory_filter_eyebrow: "Filtra",
    judge_directory_refine_results: "Përpunoni rezultatet",
    judge_directory_reset: "Rivendos",
    judge_directory_name: "Emri i gjyqtarit",
    judge_directory_name_placeholder: "Shkruaj emrin e gjyqtarit",
    judge_directory_area: "Fusha e punës",
    judge_directory_all_areas: "Të gjitha fushat",
    judge_directory_year_from: "Nga viti",
    judge_directory_year_to: "Deri në vit",
    judge_directory_sort: "Rendit",
    judge_directory_per_page: "Për faqe",
    judge_directory_sort_name_asc: "Emri A-Z",
    judge_directory_sort_name_desc: "Emri Z-A",
    judge_directory_sort_area: "Fusha",
    judge_directory_sort_year_desc: "Zgjedhja më e re",
    judge_directory_sort_year_asc: "Zgjedhja më e vjetër",
    judge_directory_preparing_records: "Po përgatiten të dhënat...",
    judge_directory_showing_results: "Duke shfaqur",
    judge_directory_of: "nga",
    judge_directory_loading_title: "Po ngarkohen gjyqtarët",
    judge_directory_loading_desc: "Direktoria publike po merr të dhënat më të fundit për gjyqtarët nga databaza.",
    judge_directory_error_title: "Gjyqtarët nuk mund të ngarkoheshin",
    judge_directory_empty_title: "Asnjë gjyqtar nuk përputhet me këta filtra",
    judge_directory_empty_desc: "Ndrysho filtrat ose rivendosi për të parë të gjithë drejtorinë.",
    judge_directory_role: "Gjyqtar",
    judge_directory_elected_short: "Zgjedhur",
    judge_directory_area_label: "Fusha",
    judge_directory_year_label: "Viti i zgjedhjes",
    judge_directory_not_provided: "Nuk është dhënë",
    judge_directory_open_profile: "Hap profilin",
    case_directory_search_label: "Kërko raste",
    case_directory_search_placeholder: "Kërko sipas ID-së së rastit, gjykatës, gjyqtarit, fushës ligjore ose përshkrimit",
    case_directory_matching_records: "rezultate përputhëse",
    case_directory_loading_directory: "Po ngarkohet direktoria e rasteve...",
    case_directory_recent_limit_note: "Si parazgjedhje shfaqen 100 rastet më të fundit",
    case_directory_filter_eyebrow: "Filtra",
    case_directory_refine_results: "Përpunoni rezultatet",
    case_directory_reset: "Rivendos",
    case_directory_court: "Gjykata",
    case_directory_court_placeholder: "Shkruaj emrin e gjykatës",
    case_directory_judge: "Gjyqtari",
    case_directory_judge_placeholder: "Shkruaj emrin e gjyqtarit",
    case_directory_legal_area: "Fusha ligjore",
    case_directory_all_areas: "Të gjitha fushat ligjore",
    case_directory_status: "Statusi",
    case_directory_all_statuses: "Të gjitha statuset",
    case_directory_date_from: "Data nga",
    case_directory_date_to: "Data deri",
    case_directory_preparing_records: "Po përgatiten të dhënat...",
    case_directory_showing_results: "Duke shfaqur",
    case_directory_of: "nga",
    case_directory_sort: "Rendit",
    case_directory_sort_recent: "Më të fundit",
    case_directory_sort_oldest: "Më të vjetrat",
    case_directory_sort_court: "Gjykata",
    case_directory_sort_judge: "Gjyqtari",
    case_directory_sort_status: "Statusi",
    case_directory_per_page: "Për faqe",
    case_directory_loading_title: "Po ngarkohen rastet",
    case_directory_loading_desc: "Direktoria publike po merr të dhënat më të fundit për rastet nga databaza.",
    case_directory_error_title: "Rastet nuk mund të ngarkoheshin",
    case_directory_empty_title: "Asnjë rast nuk përputhet me këta filtra",
    case_directory_empty_desc: "Ndrysho filtrat ose rivendosi për të parë rastet përkatëse.",
    case_directory_open_case: "Hap rastin",
    case_detail_loading: "Po ngarkohet rasti...",
    case_detail_not_found: "Rasti nuk u gjet",
    case_detail_back: "Kthehu te rastet",
    case_detail_court: "Gjykata",
    case_detail_judge: "Gjyqtari",
    case_detail_legal_area: "Fusha ligjore",
    case_detail_decision_date: "Data e vendimit",
    case_detail_case_type: "Lloji i rastit",
    case_detail_case_subtype: "Nënlloji i rastit",
    case_detail_basis_type: "Lloji i bazës",
    case_detail_basis: "Baza",
    case_detail_articles: "Nenet",
    case_detail_public_prosecutor_case: "Rasti i prokurorisë publike",
    case_detail_case_cost: "Kostoja e rastit",
    case_detail_total_case_cost: "Kostoja totale e rastit",
    case_detail_mitigating_factors: "Rrethana lehtësuese",
    case_detail_plea_deal: "Marrëveshje pranimi faji",
    case_detail_duration: "Kohëzgjatja",
    case_detail_days: "ditë",
    case_detail_severity_ratio: "Raporti i ashpërsisë",
    case_detail_sentence_severity: "Ashpërsia e dënimit",
    case_detail_appeal: "Ankesa",
    case_detail_overview: "Përmbledhje",
    case_detail_case_summary: "Përmbledhja e rastit",
    case_detail_case_details: "Detajet e rastit",
    case_detail_key_insights: "Njohuri kryesore",
    case_detail_timeline: "Kronologjia",
    case_detail_no_timeline: "Ende nuk ka kronologji për këtë rast.",
    case_detail_related_cases: "Raste të ngjashme",
    case_detail_not_provided: "Nuk është dhënë",
    case_detail_no_related_cases: "Ende nuk ka raste të ngjashme.",
    case_directory_search_criteria: "Kriteret e kerkimit",
    case_directory_filters_active: "filtra aktive",
    case_directory_download_document: "Shkarko dokumentin",
    case_directory_relevance: "Relevanca",
  },
};
