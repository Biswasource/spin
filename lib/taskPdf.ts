import jsPDF from 'jspdf';

export interface TaskPDFData {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
  assignedName?: string;
  assignedEmail?: string;
  assignedRole?: string;
}

const STATUS_LABELS: Record<string, { label: string; textRgb: [number, number, number]; bgRgb: [number, number, number] }> = {
  'todo': { label: 'To Do', textRgb: [75, 85, 99], bgRgb: [243, 244, 246] },
  'in-progress': { label: 'In Progress', textRgb: [29, 78, 216], bgRgb: [239, 246, 255] },
  'done': { label: 'Completed', textRgb: [21, 128, 61], bgRgb: [240, 253, 244] },
};

const PRIORITY_LABELS: Record<string, { label: string; textRgb: [number, number, number]; bgRgb: [number, number, number] }> = {
  'low': { label: 'Low Priority', textRgb: [21, 128, 61], bgRgb: [240, 253, 244] },
  'medium': { label: 'Medium Priority', textRgb: [180, 83, 9], bgRgb: [255, 251, 235] },
  'high': { label: 'High Priority', textRgb: [185, 28, 28], bgRgb: [254, 242, 242] },
};

export function generateTaskPDF(task: TaskPDFData): jsPDF {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pW = pdf.internal.pageSize.getWidth();   // 210mm
  const pH = pdf.internal.pageSize.getHeight();  // 297mm
  const lm = 20; // left margin
  const rm = 20; // right margin
  const cw = pW - lm - rm; // 170mm
  let y = 0;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pH - 25) {
      pdf.addPage();
      y = 22;
      drawSubHeader();
    }
  };

  const drawSubHeader = () => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text('SPINTECH  ·  TASK SPECIFICATION (CONTINUED)', lm, y);
    pdf.setDrawColor(230, 230, 226);
    pdf.setLineWidth(0.3);
    pdf.line(lm, y + 3, pW - rm, y + 3);
    y += 10;
  };

  // 1. Top Decorative Brand Bar
  pdf.setFillColor(26, 26, 26); // charcoal
  pdf.rect(0, 0, pW, 4, 'F');
  pdf.setFillColor(190, 242, 100); // lime accent strip
  pdf.rect(0, 0, 45, 4, 'F');

  y = 20;

  // 2. Main Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(26, 26, 26);
  pdf.text('SpinTech', lm, y);

  // Subtitle next to logo
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(130, 130, 130);
  pdf.text('TASK SPECIFICATION & REPORT', lm + 30, y - 0.5);

  // Generated date right aligned
  const genDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  pdf.text(`Generated: ${genDate}`, pW - rm, y - 0.5, { align: 'right' });

  y += 5;
  pdf.setDrawColor(228, 228, 224);
  pdf.setLineWidth(0.4);
  pdf.line(lm, y, pW - rm, y);

  y += 12;

  // 3. Task Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(26, 26, 26);
  const titleLines = pdf.splitTextToSize(task.title || 'Untitled Task', cw);
  pdf.text(titleLines, lm, y);
  y += titleLines.length * 8 + 4;

  // 4. Status, Priority & Due Date Badges
  const statusCfg = STATUS_LABELS[task.status] || STATUS_LABELS['todo'];
  const priorityCfg = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS['medium'];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const drawBadge = (text: string, textRgb: [number, number, number], bgRgb: [number, number, number], currentX: number): number => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    const textWidth = pdf.getStringUnitWidth(text) * 8.5 / pdf.internal.scaleFactor;
    const badgeW = textWidth + 8;
    const badgeH = 7;

    pdf.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    pdf.roundedRect(currentX, y - 4.5, badgeW, badgeH, 1.5, 1.5, 'F');
    pdf.setDrawColor(textRgb[0], textRgb[1], textRgb[2]);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(currentX, y - 4.5, badgeW, badgeH, 1.5, 1.5, 'S');

    pdf.setTextColor(textRgb[0], textRgb[1], textRgb[2]);
    pdf.text(text, currentX + 4, y + 0.3);
    return badgeW + 3;
  };

  let badgeX = lm;
  badgeX += drawBadge(statusCfg.label, statusCfg.textRgb, statusCfg.bgRgb, badgeX);
  badgeX += drawBadge(priorityCfg.label, priorityCfg.textRgb, priorityCfg.bgRgb, badgeX);

  if (task.dueDate) {
    const formattedDue = new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const dueLabel = (isOverdue ? 'Overdue: ' : 'Due: ') + formattedDue;
    const dueColor: [number, number, number] = isOverdue ? [185, 28, 28] : [75, 85, 99];
    const dueBg: [number, number, number] = isOverdue ? [254, 242, 242] : [243, 244, 246];
    drawBadge(dueLabel, dueColor, dueBg, badgeX);
  }

  y += 11;

  // 5. Structured Data Table: Task Overview
  checkPageBreak(50);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text('TASK OVERVIEW', lm, y);
  y += 4;

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Task ID', value: task.id || 'N/A' },
    { label: 'Assigned To', value: task.assignedName ? `${task.assignedName}${task.assignedRole ? ` (${task.assignedRole})` : ''}` : 'Unassigned' },
    { label: 'Employee Email', value: task.assignedEmail || 'N/A' },
    { label: 'Current Status', value: statusCfg.label },
    { label: 'Priority Level', value: priorityCfg.label },
    {
      label: 'Due Date',
      value: task.dueDate
        ? `${new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}${isOverdue ? ' [OVERDUE]' : ''}`
        : 'Not specified',
    },
  ];

  if (task.createdAt) {
    rows.push({
      label: 'Created Date',
      value: new Date(task.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
  }

  const rowH = 7.5;
  const col1W = 45;
  const col2W = cw - col1W;

  rows.forEach((r, idx) => {
    checkPageBreak(rowH + 2);
    // alternating background
    if (idx % 2 === 0) {
      pdf.setFillColor(250, 250, 248);
      pdf.rect(lm, y, cw, rowH, 'F');
    }

    // outer border line
    pdf.setDrawColor(235, 235, 230);
    pdf.setLineWidth(0.2);
    pdf.line(lm, y + rowH, pW - rm, y + rowH);

    // Label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(110, 110, 110);
    pdf.text(r.label, lm + 3, y + 5);

    // Value
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    const valText = pdf.splitTextToSize(r.value, col2W - 6);
    pdf.text(valText[0] || '', lm + col1W + 3, y + 5);

    y += rowH;
  });

  y += 8;

  // 6. Description Section
  checkPageBreak(40);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text('TASK DESCRIPTION & REQUIREMENTS', lm, y);
  y += 5;

  const descContent = (task.description || '').trim() || 'No specific description provided by the administrator.';
  const descLines = pdf.splitTextToSize(descContent, cw - 8);
  const descBoxH = Math.max(22, descLines.length * 5.2 + 8);

  // If description fits on current page
  if (y + descBoxH < pH - 25) {
    pdf.setFillColor(252, 252, 250);
    pdf.roundedRect(lm, y, cw, descBoxH, 2, 2, 'F');
    pdf.setDrawColor(228, 228, 222);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(lm, y, cw, descBoxH, 2, 2, 'S');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(45, 45, 45);
    pdf.text(descLines, lm + 4, y + 6);
    y += descBoxH + 10;
  } else {
    // Multi-line description spanning page breaks
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(45, 45, 45);

    for (let i = 0; i < descLines.length; i++) {
      checkPageBreak(6);
      pdf.text(descLines[i], lm + 3, y);
      y += 5.5;
    }
    y += 8;
  }

  // 7. Footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    const footerY = pH - 10;

    pdf.setDrawColor(230, 230, 225);
    pdf.setLineWidth(0.3);
    pdf.line(lm, footerY - 4, pW - rm, footerY - 4);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(150, 150, 150);
    pdf.text('SpinTech Employee Portal  ·  Confidential & Proprietary', lm, footerY);
    pdf.text(`Page ${i} of ${totalPages}`, pW - rm, footerY, { align: 'right' });
  }

  return pdf;
}
