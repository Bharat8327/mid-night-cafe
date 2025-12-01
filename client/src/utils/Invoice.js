import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
export const generateCafeInvoice = (order, cafe, owner, customer) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(51, 102, 153);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

  const margin = 30;
  let y = 40;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${order.id}`, pageWidth - margin - 150, y);
  doc.text(`Date: ${order.date}`, pageWidth - margin - 150, y + 14);

  const imgWidth = 100;
  const imgHeight = 80;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(cafe.name, margin, y);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(cafe.address, margin, y + 18);

  y += 60;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Details :-', margin, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${customer.name || '-'}`, margin, y);
  y += 14;
  doc.text(`Mobile: ${customer.mobile || '-'}`, margin, y);
  y += 14;
  doc.text(`Location: ${customer.address || '-'}`, margin, y);
  y += 20;

  // Items Heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Items List :-', margin, y);
  y += 8;

  // Table rows
  const itemRows = (order.items || []).map((item) => [
    item.name,
    item.category || '-',
    String(item.quantity || 0),
    Number(item.price || 0).toFixed(2),
    (Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2),
  ]);
  const head = [['Item', 'Category', 'Qty', 'Unit Price', 'Total']];

  autoTable(doc, {
    startY: y + 6,
    head,
    body: itemRows,
    theme: 'striped',
    headStyles: {
      fillColor: [51, 102, 153],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: { fontSize: 10 },
    margin: { left: margin, right: margin },
  });

  let finalY =
    doc.lastAutoTable && doc.lastAutoTable.finalY
      ? doc.lastAutoTable.finalY + 12
      : y + itemRows.length * 16 + 12;

  const computedSubtotal = (order.items || []).reduce(
    (acc, it) => acc + Number(it.price || 0) * Number(it.quantity || 0),
    0,
  );
  const gstRate = 0.05; // 5%
  const gstAmount = computedSubtotal * gstRate;
  const computedTotal = computedSubtotal + gstAmount;

  const totalsValueX = pageWidth - margin;
  const totalsLabelX = totalsValueX - 140;

  doc.setFontSize(11);

  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal:', totalsLabelX, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(computedSubtotal.toFixed(2), totalsValueX, finalY, {
    align: 'right',
  });

  finalY += 14;
  doc.setFont('helvetica', 'bold');
  doc.text('GST (5%):', totalsLabelX, finalY);
  doc.setFont('helvetica', 'normal');
  doc.text(gstAmount.toFixed(2), totalsValueX, finalY, { align: 'right' });

  finalY += 14;
  doc.setFont('helvetica', 'bold');
  doc.text('Total (Inclusive of Tax):', totalsLabelX - 19, finalY);
  doc.text(computedTotal.toFixed(2), totalsValueX, finalY, {
    align: 'right',
  });

  finalY += 28;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method :-', margin, finalY);
  finalY += 14;
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Transaction ID: ${Math.random()
      .toString(36)
      .substring(2, 12)
      .toUpperCase()}`,
    margin,
    finalY,
  );
  finalY += 14;
  doc.text(`PayPal Email: payment@midnightcafe.com`, margin, finalY);

  finalY += 30;

  doc.setDrawColor(0);
  doc.setLineWidth(1);
  doc.line(margin, finalY, pageWidth - margin, finalY);
  finalY += 20;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Rules And Regulations :-', margin, finalY);
  finalY += 18;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('• All Prices Inclusive Of Applicable Taxes.', margin, finalY);
  finalY += 14;
  doc.text('• Payment Due Upon Delivery.', margin, finalY);
  finalY += 14;
  doc.text(
    '• Goods Once Sold Will Not Be Refunded Unless Quality Issues.',
    margin,
    finalY,
  );
  finalY += 14;

  doc.setFont('helvetica', 'normal');
  doc.text('• For Queries Contact Us At ', margin, finalY);

  const normalWidth = doc.getTextWidth('• For Queries Contact Us At ');
  doc.setFont('helvetica', 'bold');
  doc.text('cafe@example.com', margin + normalWidth, finalY);

  doc.setFont('helvetica', 'normal');
  finalY += 40;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Invoice Generated Date :- ${
      new Date().toLocaleDateString('en-IN').split('T')[0]
    }`,
    margin,
    finalY,
  );
  doc.text(
    `Authorized Signature :- ${owner.name || 'Authorized Person'}`,
    pageWidth - margin - 250,
    finalY,
  );

  finalY += 14;
  doc.text(
    `Date: ${new Date().toLocaleDateString('en-IN').split('T')[0]}`,
    pageWidth - margin - 250,
    finalY,
  );

  // Save PDF
  doc.save(`MidnightCafe_Invoice_${order.id}.pdf`);
};
