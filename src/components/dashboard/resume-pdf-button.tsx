"use client";

type ResumeSummary = {
  title: string;
  ats: number;
  keyword: number;
};

type Props = {
  resumes: ResumeSummary[];
};

export function ResumePdfButton({ resumes }: Props) {
  async function handleExport() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("SmartCV AI - Resume Report", 14, 20);

    let y = 32;
    if (!resumes.length) {
      doc.setFontSize(12);
      doc.text("No resume data available yet.", 14, y);
    } else {
      resumes.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${item.title}`, 14, y);
        y += 7;
        doc.setFontSize(10);
        doc.text(`ATS Score: ${item.ats}/100 | Keyword Match: ${item.keyword}/100`, 18, y);
        y += 10;
      });
    }

    doc.save("smartcv-resume-report.pdf");
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
