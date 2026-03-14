export type CourtMetric = {
  label: string;
  value: string;
  tone?: "good" | "warn" | "bad";
  info?: string;
};

export type CourtCaseRow = {
  id: string;
  recordKey?: string;
  type: string;
  subtype: string;
  basisType: string;
  filingDate: string;
  status: "Unknown" | "Active" | "Closed";
};

export type CourtChartItem = {
  label: string;
  value: number;
  color: string;
};

export type CourtItem = {
  id: string;
  name: string;
  cardTag: string;
  type: string;
  address: string;
  phones: string[];
  jurisdiction: string;
  website: string;
  about: string;
  metrics: CourtMetric[];
  caseTypes: CourtChartItem[];
  casesPerYear: CourtChartItem[];
  avgTimeByType: CourtChartItem[];
  avgCostByType: CourtChartItem[];
  cases: CourtCaseRow[];
};

const baseMetrics: CourtMetric[] = [
  {
    label: "Total Cases",
    value: "1,249",
    tone: "good",
    info: "Total cases handled in the latest reporting year.",
  },
  {
    label: "Clearance Rate",
    value: "88%",
    tone: "good",
    info: "Resolved cases vs. incoming cases.",
  },
  {
    label: "Active Cases",
    value: "142",
    tone: "warn",
    info: "Currently open cases.",
  },
  {
    label: "Avg Duration",
    value: "245 days",
    tone: "warn",
    info: "Average duration from filing to decision.",
  },
  {
    label: "Reversal Rate",
    value: "12%",
    tone: "good",
    info: "Share of decisions reversed on appeal.",
  },
  {
    label: "Total Judges",
    value: "24",
    info: "Number of judges assigned to the court.",
  },
];

const baseCaseTypes: CourtChartItem[] = [
  { label: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e \u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438", value: 6, color: "#3b6f95" },
  { label: "Misdemeanor", value: 4, color: "#9ac6e5" },
  { label: "Civil", value: 3, color: "#e7a24a" },
];

const baseCasesPerYear: CourtChartItem[] = [
  { label: "2020", value: 850, color: "#3b6f95" },
  { label: "2021", value: 920, color: "#3b6f95" },
  { label: "2022", value: 880, color: "#3b6f95" },
  { label: "2023", value: 1050, color: "#3b6f95" },
  { label: "2024", value: 1120, color: "#3b6f95" },
];

const baseAvgTime: CourtChartItem[] = [
  {
    label:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    value: 230,
    color: "#4f78a8",
  },
  {
    label:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0440\u0430\u043a\u043e\u0442, \u0441\u0435\u043c\u0435\u0458\u0441\u0442\u0432\u043e \u0438 \u043c\u043b\u0430\u0434\u0438\u043d\u0430\u0442\u0430",
    value: 90,
    color: "#78b8b1",
  },
];

const baseAvgCost: CourtChartItem[] = [
  {
    label:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    value: 2800,
    color: "#4f78a8",
  },
  {
    label:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0440\u0430\u043a\u043e\u0442, \u0441\u0435\u043c\u0435\u0458\u0441\u0442\u0432\u043e \u0438 \u043c\u043b\u0430\u0434\u0438\u043d\u0430\u0442\u0430",
    value: 800,
    color: "#78b8b1",
  },
];

const baseCases: CourtCaseRow[] = [
  {
    id: "K-2010/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "15.10.2025",
    status: "Unknown",
  },
  {
    id: "K-1959/25",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "15.12.2025",
    status: "Unknown",
  },
  {
    id: "PPK-C-2659/25",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "15.12.2025",
    status: "Unknown",
  },
  {
    id: "K-1023/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "15.11.2024",
    status: "Closed",
  },
  {
    id: "K-1307/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "11.11.2024",
    status: "Closed",
  },
  {
    id: "K-1924/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0440\u0430\u043a\u043e\u0442, \u0441\u0435\u043c\u0435\u0458\u0441\u0442\u0432\u043e \u0438 \u043c\u043b\u0430\u0434\u0438\u043d\u0430\u0442\u0430",
    filingDate: "19.11.2024",
    status: "Closed",
  },
  {
    id: "K-1861/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "02.12.2024",
    status: "Closed",
  },
  {
    id: "K-2023/24",
    type: "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u043e",
    subtype: "\u043f\u043e\u043b\u043d\u043e\u043b\u0435\u0442\u043d\u0438",
    basisType:
      "\u041a\u0440\u0438\u0432\u0438\u0447\u043d\u0438 \u0434\u0435\u043b\u0430 \u043f\u0440\u043e\u0442\u0438\u0432 \u0431\u0435\u0437\u0431\u0435\u0434\u043d\u043e\u0441\u0442\u0430 \u0432\u043e \u0458\u0430\u0432\u043d\u0438\u043e\u0442 \u0441\u043e\u043e\u0431\u0440\u0430\u045c\u0430\u0458",
    filingDate: "28.11.2024",
    status: "Closed",
  },
];

const baseDetail = {
  type: "Basic Court",
  about:
    "The Basic Criminal Court Skopje is the largest court of first instance in the country, handling criminal matters for the broader Skopje region. It operates with a commitment to transparency, efficiency, and the rule of law.",
  metrics: baseMetrics,
  caseTypes: baseCaseTypes,
  casesPerYear: baseCasesPerYear,
  avgTimeByType: baseAvgTime,
  avgCostByType: baseAvgCost,
  cases: baseCases,
};

export const COURTS: CourtItem[] = [
  {
    id: "basic-court-prilep",
    name: "\u041e\u0441\u043d\u043e\u0432\u0435\u043d \u0441\u0443\u0434 \u041f\u0440\u0438\u043b\u0435\u043f",
    cardTag: "BASIC COURTS",
    address: "Bulevar Goce Delchev 6, Skopje",
    phones: ["(02) 3292-633"],
    jurisdiction: "Jurisdiction: Skopje, Centar, Karpos, Gjorce Petrov",
    website: "https://court.gov.mk/prilep",
    ...baseDetail,
  },
  {
    id: "basic-court-shtip",
    name: "Basic Court Shtip",
    cardTag: "BASIC COURTS",
    address: "ul. General Mihajlo Apostolski br.18",
    phones: ["(032) 391-827"],
    jurisdiction: "Jurisdiction: 3 Municipalities",
    website: "https://court.gov.mk/shtip",
    ...baseDetail,
  },
  {
    id: "basic-court-kumanovo",
    name: "Basic Court Kumanovo",
    cardTag: "BASIC COURTS",
    address: "ul. 11-ti Oktomvri 6b.",
    phones: ["(031) 411-555", "(031) 422-876"],
    jurisdiction: "Jurisdiction: 4 Municipalities",
    website: "https://court.gov.mk/kumanovo",
    ...baseDetail,
  },
  {
    id: "basic-court-skopje-1",
    name: "Basic Court Skopje 1",
    cardTag: "BASIC COURTS WITH EXTENDED JURISDICTION",
    address: "Bulevar Goce Delchev 6, Skopje",
    phones: ["(02) 3292-633"],
    jurisdiction: "Jurisdiction: Skopje, Centar, Karpos, Gjorce Petrov",
    website: "https://court.gov.mk/skopje1",
    ...baseDetail,
  },
  {
    id: "basic-court-skopje-2",
    name: "Basic Court Skopje 2",
    cardTag: "BASIC COURTS WITH EXTENDED JURISDICTION",
    address: "Bulevar Partizanski Odredi 21, Skopje",
    phones: ["(02) 3098-222"],
    jurisdiction: "Jurisdiction: Skopje, Aerodrom, Kisela Voda",
    website: "https://court.gov.mk/skopje2",
    ...baseDetail,
  },
  {
    id: "basic-court-bitola",
    name: "Basic Court Bitola",
    cardTag: "BASIC COURTS",
    address: "ul. Marsal Tito 10, Bitola",
    phones: ["(047) 228-701"],
    jurisdiction: "Jurisdiction: 3 Municipalities",
    website: "https://court.gov.mk/bitola",
    ...baseDetail,
  },
  {
    id: "basic-court-tetovo",
    name: "Basic Court Tetovo",
    cardTag: "BASIC COURTS",
    address: "ul. Ilindenska 5, Tetovo",
    phones: ["(044) 356-440"],
    jurisdiction: "Jurisdiction: 5 Municipalities",
    website: "https://court.gov.mk/tetovo",
    ...baseDetail,
  },
  {
    id: "basic-court-ohrid",
    name: "Basic Court Ohrid",
    cardTag: "BASIC COURTS",
    address: "ul. Sveti Kliment 9, Ohrid",
    phones: ["(046) 261-113"],
    jurisdiction: "Jurisdiction: 2 Municipalities",
    website: "https://court.gov.mk/ohrid",
    ...baseDetail,
  },
  {
    id: "basic-court-veles",
    name: "Basic Court Veles",
    cardTag: "BASIC COURTS",
    address: "ul. Kocho Racin 18, Veles",
    phones: ["(043) 215-219"],
    jurisdiction: "Jurisdiction: 2 Municipalities",
    website: "https://court.gov.mk/veles",
    ...baseDetail,
  },
  {
    id: "basic-court-strumica",
    name: "Basic Court Strumica",
    cardTag: "BASIC COURTS",
    address: "ul. Blagoj Jankov 12, Strumica",
    phones: ["(034) 331-901"],
    jurisdiction: "Jurisdiction: 4 Municipalities",
    website: "https://court.gov.mk/strumica",
    ...baseDetail,
  },
  {
    id: "basic-court-gostivar",
    name: "Basic Court Gostivar",
    cardTag: "BASIC COURTS",
    address: "ul. Ilinden 14, Gostivar",
    phones: ["(042) 214-330"],
    jurisdiction: "Jurisdiction: 3 Municipalities",
    website: "https://court.gov.mk/gostivar",
    ...baseDetail,
  },
];

export function getCourtById(courtId: string): CourtItem | undefined {
  return COURTS.find((c) => c.id.toLowerCase() === courtId.toLowerCase());
}
