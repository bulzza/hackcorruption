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
  | "research_analysis_5_snippet";

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
  },
};
