export type CaseTimelineEvent = {
  date: string; // ISO or display string
  title: string;
  active?: boolean;
};

export type CaseKpis = {
  complexity: "Low" | "Medium" | "High";
  successProb: number; // 0-100
};

export type CaseItem = {
  id: string;
  court: string;
  judge: string;
  legalArea: string;
  caseType: string;
  decisionDate: string; // display
  costEUR: number;
  durationDays: number;

  summary: string;
  timeline: CaseTimelineEvent[];

  kpis: CaseKpis;

  tags?: string[];
};

export const CASES: CaseItem[] = [
  // existing
  {
    id: "K-1023/24",
    court: "Basic Criminal Court Skopje",
    judge: "A. Petrovski",
    legalArea: "Criminal Area",
    caseType: "Criminal Adult",
    decisionDate: "2024-09-14",
    costEUR: 1250,
    durationDays: 210,
    summary:
      "The court examined evidence related to alleged abuse of office. The decision addresses procedural objections, evaluates witness statements, and outlines the reasoning behind the final outcome. The ruling discusses proportionality and mitigating factors in sentencing. The court examined evidence related to alleged abuse of office. The decision addresses procedural objections, evaluates witness statements, and outlines the reasoning behind the final outcome. The ruling discusses proportionality and mitigating factors in sentencing. ",
    timeline: [
      { date: "2024-01-18", title: "Case opened" },
      { date: "2024-03-02", title: "Evidence review" },
      { date: "2024-05-20", title: "Hearing" },
      { date: "2024-09-14", title: "Decision issued", active: true },
    ],
    kpis: { complexity: "High", successProb: 85 },
    tags: ["Abuse of Office", "Public Sector"],
  },
  {
    id: "K-778/23",
    court: "Basic Court Tetovo",
    judge: "E. Aliti",
    legalArea: "Criminal Area",
    caseType: "Criminal Adult",
    decisionDate: "2023-11-02",
    costEUR: 540,
    durationDays: 95,
    summary:
      "A concise ruling focused on admissibility of evidence and a plea agreement. The reasoning highlights procedural compliance and a reduced sanction due to cooperation.",
    timeline: [
      { date: "2023-07-12", title: "Case opened" },
      { date: "2023-09-01", title: "Plea discussions" },
      { date: "2023-11-02", title: "Decision issued", active: true },
    ],
    kpis: { complexity: "Medium", successProb: 72 },
    tags: ["Plea Deal"],
  },
  {
    id: "K-331/22",
    court: "Court of Appeal Skopje",
    judge: "M. Stojanova",
    legalArea: "Appeals",
    caseType: "Appeal",
    decisionDate: "2022-06-18",
    costEUR: 2100,
    durationDays: 340,
    summary:
      "Appeal decision reviewing first-instance reasoning. The court partially upheld and partially modified the judgment, focusing on legal qualification and proportionality. Lorem100 ",
    timeline: [
      { date: "2021-07-01", title: "First instance decision" },
      { date: "2021-08-15", title: "Appeal filed" },
      { date: "2022-06-18", title: "Appeal decision", active: true },
    ],
    kpis: { complexity: "High", successProb: 61 },
    tags: ["Appeal", "Modification"],
  },

  // new
  {
    id: "P-204/24",
    court: "Basic Civil Court Skopje",
    judge: "I. Dimitrova",
    legalArea: "Civil Area",
    caseType: "Civil Litigation",
    decisionDate: "2024-12-05",
    costEUR: 980,
    durationDays: 165,
    summary:
      "A contract dispute concerning delayed performance and alleged defects. The decision assesses documentary evidence, credibility of expert findings, and the allocation of burden of proof for damages and penalty clauses.",
    timeline: [
      { date: "2024-06-20", title: "Claim filed" },
      { date: "2024-07-11", title: "Service & response" },
      { date: "2024-09-03", title: "Expert report ordered" },
      { date: "2024-11-12", title: "Main hearing" },
      { date: "2024-12-05", title: "Decision issued", active: true },
    ],
    kpis: { complexity: "Medium", successProb: 68 },
    tags: ["Contract", "Damages", "Expert Report"],
  },
  {
    id: "P-88/23",
    court: "Basic Court Bitola",
    judge: "S. Trajkov",
    legalArea: "Civil Area",
    caseType: "Debt Collection",
    decisionDate: "2023-06-28",
    costEUR: 320,
    durationDays: 54,
    summary:
      "Proceedings on an unpaid invoice where the respondent disputed delivery and set-off. The ruling emphasizes evidentiary value of delivery notes and partial acknowledgment of debt, with interest calculated from default.",
    timeline: [
      { date: "2023-04-21", title: "Claim filed" },
      { date: "2023-05-08", title: "Response submitted" },
      { date: "2023-06-12", title: "Hearing" },
      { date: "2023-06-28", title: "Decision issued", active: true },
    ],
    kpis: { complexity: "Low", successProb: 79 },
    tags: ["Debt", "Invoice", "Interest"],
  },
  
  {
    id: "E-402/24",
    court: "Enforcement Department Skopje",
    judge: "T. Angelov",
    legalArea: "Enforcement",
    caseType: "Enforcement",
    decisionDate: "2024-08-26",
    costEUR: 260,
    durationDays: 33,
    summary:
      "Enforcement proceedings based on an enforceable title with objections related to payment already made. The decision clarifies scope of review in enforcement, accepts partial objection, and adjusts the enforcement amount.",
    timeline: [
      { date: "2024-07-23", title: "Enforcement requested" },
      { date: "2024-08-05", title: "Objection filed" },
      { date: "2024-08-26", title: "Ruling issued", active: true },
    ],
    kpis: { complexity: "Low", successProb: 76 },
    tags: ["Enforcement", "Objection", "Partial Payment"],
  },
  {
    id: "IP-9/25",
    court: "Basic Civil Court Skopje",
    judge: "B. Jovanov",
    legalArea: "Intellectual Property",
    caseType: "IP Dispute",
    decisionDate: "2025-03-06",
    costEUR: 2300,
    durationDays: 260,
    summary:
      "An IP dispute concerning trademark similarity and unfair competition. The court evaluates distinctiveness, likelihood of confusion, and market context, granting a tailored injunction and ordering publication of the outcome.",
    timeline: [
      { date: "2024-06-11", title: "Claim filed" },
      { date: "2024-08-02", title: "Interim injunction requested" },
      { date: "2024-11-19", title: "Hearing" },
      { date: "2025-03-06", title: "Decision issued", active: true },
    ],
    kpis: { complexity: "High", successProb: 62 },
    tags: ["Trademark", "Unfair Competition", "Injunction"],
  },
];

export function getCaseById(caseId: string): CaseItem | undefined {
  return CASES.find((c) => c.id.toLowerCase() === caseId.toLowerCase());
}

export function getRelatedCases(current: CaseItem): CaseItem[] {
  return CASES.filter(
    (c) =>
      c.id !== current.id &&
      (c.legalArea === current.legalArea || c.caseType === current.caseType)
  ).slice(0, 3);
}

export function getSimilarCases(current: CaseItem): CaseItem[] {
  // Simple similarity heuristic: shared tags > same court > same judge
  const currentTags = new Set(current.tags ?? []);
  const scored = CASES.filter((c) => c.id !== current.id).map((c) => {
    const sharedTags =
      (c.tags ?? []).reduce((acc, t) => acc + (currentTags.has(t) ? 1 : 0), 0) *
      3;
    const sameCourt = c.court === current.court ? 2 : 0;
    const sameJudge = c.judge === current.judge ? 2 : 0;
    const score = sharedTags + sameCourt + sameJudge;
    return { c, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.c);
}
