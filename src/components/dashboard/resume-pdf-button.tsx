"use client";

type ResumeSummary = {
  title: string;
  ats: number;
  keyword: number;
  personalInfo?: unknown;
  summary?: string | null;
  skills?: unknown;
  workExperience?: unknown;
  education?: unknown;
  projects?: unknown;
  certifications?: unknown;
};

type Props = {
  resumes: ResumeSummary[];
};

export function ResumePdfButton({ resumes }: Props) {
  function asString(value: unknown) {
    return typeof value === "string" ? value : "";
  }

  function asStringArray(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item)).filter(Boolean);
  }

  function parseTextItems(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null && "text" in item) {
          return String((item as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .filter(Boolean);
  }

  function writeWrappedLines(
    doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>,
    lines: string[],
    x: number,
    y: number,
    maxWidth: number,
    lineHeight = 5,
  ) {
    let nextY = y;
    for (const line of lines) {
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, x, nextY);
      nextY += wrapped.length * lineHeight;
    }
    return nextY;
  }

  function drawSectionTitle(
    doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>,
    title: string,
    x: number,
    y: number,
  ) {
    doc.setTextColor(0, 110, 210);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), x, y);
    return y + 5;
  }

  function drawBulletSection(
    doc: InstanceType<(typeof import("jspdf"))["jsPDF"]>,
    title: string,
    items: string[],
    x: number,
    y: number,
    width: number,
  ) {
    let cursor = drawSectionTitle(doc, title, x, y);
    doc.setTextColor(45, 55, 72);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    const safeItems = items.length ? items : ["Not provided"];
    const lines = safeItems.map((item) => `- ${item}`);
    cursor = writeWrappedLines(doc, lines, x, cursor, width);
    return cursor + 4;
  }

  async function handleExport() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ format: "a4", unit: "mm" });
    const resume = resumes[0];

    if (!resumes.length) {
      doc.setFontSize(12);
      doc.text("No resume data available yet.", 16, 20);
    } else {
      const personal = (resume.personalInfo ?? {}) as {
        fullName?: unknown;
        email?: unknown;
        phone?: unknown;
        address?: unknown;
        languages?: unknown;
        awards?: unknown;
      };
      const fullName = asString(personal.fullName) || "Your Name";
      const email = asString(personal.email) || "email@example.com";
      const phone = asString(personal.phone);
      const address = asString(personal.address);
      const summary = asString(resume.summary) || "Professional summary not provided.";
      const skills = asStringArray(resume.skills);
      const experienceItems = parseTextItems(resume.workExperience);
      const educationItems = parseTextItems(resume.education);
      const projectItems = parseTextItems(resume.projects);
      const certificationItems = parseTextItems(resume.certifications);
      const awardItems = parseTextItems(personal.awards);
      const languageItems = asStringArray(personal.languages);

      doc.setFont("times", "bold");
      doc.setTextColor(20, 27, 45);
      doc.setFontSize(20);
      doc.text(fullName, 16, 22);

      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 70, 90);
      const summaryLines = doc.splitTextToSize(summary, 112);
      doc.text(summaryLines, 16, 30);

      doc.setFont("times", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 27, 45);
      const contactLines = [
        `Address: ${address || "Not provided"}`,
        `Phone: ${phone || "Not provided"}`,
        `Email: ${email}`,
      ];
      doc.text(contactLines, 132, 22);

      // Add more breathing room below the header block.
      let leftY = 60;
      let rightY = 60;
      const leftX = 16;
      const rightX = 132;
      const leftWidth = 104;
      const rightWidth = 62;

      leftY = drawBulletSection(doc, "Experience", experienceItems, leftX, leftY, leftWidth);
      leftY = drawBulletSection(doc, "Education", educationItems, leftX, leftY, leftWidth);
      leftY = drawBulletSection(doc, "Projects", projectItems, leftX, leftY, leftWidth);

      rightY = drawBulletSection(doc, "Skills", skills, rightX, rightY, rightWidth);
      rightY = drawBulletSection(doc, "Awards", awardItems, rightX, rightY, rightWidth);
      rightY = drawBulletSection(doc, "Languages", languageItems, rightX, rightY, rightWidth);
      rightY = drawBulletSection(
        doc,
        "Certifications",
        certificationItems,
        rightX,
        rightY,
        rightWidth,
      );

      const footerY = Math.max(leftY, rightY) + 6;
      doc.setDrawColor(220, 226, 236);
      doc.line(16, footerY, 194, footerY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `ATS Score: ${resume.ats}/100 | Keyword Match: ${resume.keyword}/100 | Generated by SmartCV AI`,
        16,
        footerY + 5,
      );
    }

    doc.save("smartcv-resume.pdf");
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
    >
      Export Resume PDF
    </button>
  );
}
