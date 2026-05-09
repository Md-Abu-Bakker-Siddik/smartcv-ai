type ScoreInput = {
  summary: string;
  skills: string[];
  experienceYears: number;
  keywordMatches: number;
};

function normalizeScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateAtsScore(input: ScoreInput) {
  const summaryScore = input.summary.length >= 120 ? 20 : input.summary.length >= 60 ? 12 : 5;
  const skillsScore = Math.min(input.skills.length * 4, 28);
  const experienceScore = Math.min(input.experienceYears * 5, 25);
  const keywordScore = Math.min(input.keywordMatches * 3, 27);

  const total = normalizeScore(summaryScore + skillsScore + experienceScore + keywordScore);

  const tips: string[] = [];
  if (summaryScore < 12) tips.push("Write a stronger professional summary with 2-3 measurable outcomes.");
  if (skillsScore < 16) tips.push("Add more role-specific technical and soft skills.");
  if (experienceScore < 10) tips.push("Expand work experience with quantified achievements.");
  if (keywordScore < 15) tips.push("Match more job-description keywords in skills and experience.");
  if (tips.length === 0) tips.push("Great baseline. Tailor this resume per job for higher ATS relevance.");

  return { total, tips };
}
