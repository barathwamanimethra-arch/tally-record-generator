/**
 * Tally ERP.9 Simulated Screenshot Generator
 * Generates crisp, realistic Tally ERP.9 interface screenshots with customized Register Number,
 * Company Name, and appropriate screen layouts (Company Creation, Gateway, Vouchers, Ledger, Inventory, Payroll, Job Costing).
 */

export interface TallyScreenConfig {
  screenType:
    | 'startup'
    | 'company_create'
    | 'company_created_gateway'
    | 'company_vault'
    | 'gateway_accounts_info'
    | 'single_ledger'
    | 'multi_ledger'
    | 'ledger_display'
    | 'voucher_payment'
    | 'voucher_receipt'
    | 'voucher_contra'
    | 'voucher_journal'
    | 'day_book'
    | 'inventory_info'
    | 'stock_group_create'
    | 'multi_stock_item'
    | 'stock_summary'
    | 'purchase_order'
    | 'sales_order'
    | 'order_details_sales'
    | 'order_details_purchase'
    | 'payroll_features'
    | 'employee_group'
    | 'employee_create'
    | 'payhead_create'
    | 'attendance_type'
    | 'payroll_voucher'
    | 'paysheet'
    | 'payslip'
    | 'job_costing_features'
    | 'cost_category'
    | 'cost_centre'
    | 'job_cost_voucher'
    | 'cost_category_summary'
    | 'job_work_analysis';
  regNo: string;
  companyName?: string;
  customTitle?: string;
  details?: Record<string, string | number>;
}

export function generateTallyScreenshot(config: TallyScreenConfig): string {
  const canvas = document.createElement('canvas');
  const width = 1100;
  const height = 640;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const regNo = config.regNo || '2513101040136';
  const cmpName = config.companyName || `${regNo} EX-01`;

  // Draw background - Windows window frame
  ctx.fillStyle = '#0a3a33';
  ctx.fillRect(0, 0, width, height);

  // Top header bar of Tally ERP 9
  ctx.fillStyle = '#0f524a';
  ctx.fillRect(0, 0, width, 32);

  // Top header menu buttons
  ctx.fillStyle = '#b7e4c7';
  ctx.font = '11px sans-serif';
  ctx.fillText('P:Print   E:Export   M:E-Mail   O:Upload   S:TallyShop   G:Language   K:Keyboard   K:Control Centre   H:Support Centre   H:Help', 15, 20);

  // Close/Min/Max buttons on top right
  ctx.fillStyle = '#1b4332';
  ctx.fillRect(width - 50, 6, 40, 20);
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px sans-serif';
  ctx.fillText('✕', width - 25, 21);

  // Second row - Screen title & Company indicator
  ctx.fillStyle = '#145a50';
  ctx.fillRect(0, 32, width, 26);
  ctx.fillStyle = '#e5f6df';
  ctx.font = 'bold 12px sans-serif';

  let screenTitle = 'Gateway of Tally';
  if (config.screenType.includes('company_create')) screenTitle = 'Company Creation';
  else if (config.screenType.includes('vault')) screenTitle = 'TallyVault Password';
  else if (config.screenType.includes('ledger')) screenTitle = 'Ledger Creation / Display';
  else if (config.screenType.includes('voucher') || config.screenType.includes('payment') || config.screenType.includes('receipt')) screenTitle = 'Accounting Voucher Creation';
  else if (config.screenType.includes('day_book')) screenTitle = 'Day Book';
  else if (config.screenType.includes('stock') || config.screenType.includes('inventory')) screenTitle = 'Inventory Info / Stock Items';
  else if (config.screenType.includes('order')) screenTitle = 'Order Voucher Creation';
  else if (config.screenType.includes('payroll') || config.screenType.includes('payslip') || config.screenType.includes('paysheet')) screenTitle = 'Payroll Voucher / Report';
  else if (config.screenType.includes('job') || config.screenType.includes('cost')) screenTitle = 'Job Costing / Cost Centre';

  ctx.fillText(screenTitle, 15, 50);

  // Company Name in center header
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 12px sans-serif';
  const cmpText = `Company : ${cmpName}`;
  const cmpMetrics = ctx.measureText(cmpText);
  ctx.fillText(cmpText, (width - cmpMetrics.width) / 2, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '11px sans-serif';
  ctx.fillText('Ctrl + M', width - 80, 50);

  // Right sidebar - Tally Function keys
  const sidebarWidth = 140;
  const mainWidth = width - sidebarWidth;
  ctx.fillStyle = '#114b43';
  ctx.fillRect(mainWidth, 58, sidebarWidth, height - 100);

  // Sidebar buttons
  const fKeys = [
    'F1: Select Cmp',
    'F1: Shut Cmp',
    'F2: Date',
    'F2: Period',
    'F3: Company',
    'F4: Contra',
    'F5: Payment',
    'F6: Receipt',
    'F7: Journal',
    'F8: Sales',
    'F9: Purchase',
    'F10: Rev Jnl',
    'F11: Features',
    'F12: Configure'
  ];
  ctx.fillStyle = '#74c0b4';
  ctx.font = '10px sans-serif';
  fKeys.forEach((key, i) => {
    ctx.fillText(key, mainWidth + 10, 85 + i * 28);
    ctx.strokeStyle = '#0d3d36';
    ctx.beginPath();
    ctx.moveTo(mainWidth, 95 + i * 28);
    ctx.lineTo(width, 95 + i * 28);
    ctx.stroke();
  });

  // Main work area
  const workAreaY = 58;
  const workAreaH = height - 100;
  ctx.fillStyle = '#e3ebd9'; // classic tally soft green/beige
  ctx.fillRect(0, workAreaY, mainWidth, workAreaH);

  // Render specific content depending on screen type
  drawScreenContent(ctx, config, mainWidth, workAreaY, workAreaH, regNo, cmpName);

  // Bottom Tally Footer
  const footerY = height - 42;
  ctx.fillStyle = '#0a3832';
  ctx.fillRect(0, footerY, width, 42);

  // Tally ERP 9 branding logo text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic bold 13px sans-serif';
  ctx.fillText('Tally', 20, footerY + 20);
  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = '#94d2bd';
  ctx.fillText('POWER OF SIMPLICITY', 20, footerY + 32);

  ctx.fillStyle = '#20695d';
  ctx.fillRect(70, footerY + 8, 100, 26);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Tally.ERP 9', 85, footerY + 25);

  // Footer status info
  ctx.fillStyle = '#a7c4bc';
  ctx.font = '10px monospace';
  ctx.fillText(`Series A Release 6.6.3 (Latest) | Educational Mode | Gateway Server | localhost:9999 | User: ${regNo}`, 190, footerY + 25);

  return canvas.toDataURL('image/png');
}

function drawScreenContent(
  ctx: CanvasRenderingContext2D,
  config: TallyScreenConfig,
  w: number,
  y: number,
  h: number,
  regNo: string,
  cmpName: string
) {
  const st = config.screenType;

  if (st === 'startup') {
    // Startup educational mode dialog
    ctx.fillStyle = '#d4e0ce';
    ctx.fillRect(w * 0.15, y + 40, w * 0.7, 240);
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.15, y + 40, w * 0.7, 240);

    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(w * 0.15, y + 40, w * 0.7, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Startup - Licensing Operations', w * 0.15 + 15, y + 58);

    ctx.fillStyle = '#1b4332';
    ctx.font = '12px sans-serif';
    const opts = [
      'A : Activate Your License',
      'V : Reactivate Your Existing License',
      'G : Get a Rental License',
      'C : Configure Existing License',
      'L : Login as Remote Tally.NET User',
      'W : Work in Educational Mode  (Active Selection)'
    ];
    opts.forEach((opt, idx) => {
      if (opt.includes('Educational Mode')) {
        ctx.fillStyle = '#ffbe0b';
        ctx.fillRect(w * 0.15 + 10, y + 78 + idx * 26, w * 0.7 - 20, 22);
        ctx.fillStyle = '#081c15';
        ctx.font = 'bold 12px sans-serif';
      } else {
        ctx.fillStyle = '#1b4332';
        ctx.font = '12px sans-serif';
      }
      ctx.fillText(opt, w * 0.15 + 20, y + 94 + idx * 26);
    });
  } else if (st === 'company_create') {
    // Company Creation Form
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#1e3a2f';
    ctx.fillText('Directory       :  C:\\Tally.ERP9\\Data', 30, y + 30);
    ctx.fillText(`Name            :  ${cmpName}`, 30, y + 55);
    ctx.fillText(`Mailing Name    :  ${cmpName}`, 30, y + 80);
    ctx.fillText(`Address         :  No. 12, College Road, Lab Campus`, 30, y + 105);
    ctx.fillText('Country         :  India', 30, y + 130);
    ctx.fillText('State           :  Tamil Nadu', 30, y + 155);
    ctx.fillText('Pincode         :  600001', 30, y + 180);
    ctx.fillText(`Register No     :  ${regNo}`, 30, y + 205);

    // Right side col
    ctx.fillText('Financial year begins from :  1-4-2026', w * 0.52, y + 55);
    ctx.fillText('Books beginning from       :  1-4-2026', w * 0.52, y + 80);
    ctx.fillText('Security Control', w * 0.52, y + 120);
    ctx.fillText('TallyVault Password (if any) :  ••••••••', w * 0.52, y + 145);
    ctx.fillText('Use Security Control         :  Yes', w * 0.52, y + 170);

    // Bottom Accept dialog
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(w * 0.7, y + 260, 160, 60);
    ctx.strokeStyle = '#2e7d32';
    ctx.strokeRect(w * 0.7, y + 260, 160, 60);
    ctx.fillStyle = '#1b5e20';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Accept ?', w * 0.7 + 55, y + 285);
    ctx.fillText('Yes or No', w * 0.7 + 50, y + 305);
  } else if (st === 'company_created_gateway' || st === 'gateway_accounts_info') {
    // Gateway of Tally menu
    ctx.fillStyle = '#1b4332';
    ctx.font = '11px monospace';
    ctx.fillText('Current Period: 1-4-2026 to 31-3-2027', 25, y + 25);
    ctx.fillText('Current Date  : Wednesday, 1 Apr, 2026', 25, y + 42);

    ctx.fillText('List of Selected Companies:', 25, y + 70);
    ctx.font = 'bold 12px monospace';
    ctx.fillText(cmpName, 25, y + 95);
    ctx.font = '11px monospace';
    ctx.fillText('Date of Last Entry: No Vouchers Entered', 25, y + 115);

    // Center Gateway Menu Box
    const menuX = w * 0.52;
    const menuW = 280;
    ctx.fillStyle = '#0f5132';
    ctx.fillRect(menuX, y + 30, menuW, 28);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Gateway of Tally', menuX + 80, y + 49);

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(menuX, y + 58, menuW, 280);
    ctx.strokeStyle = '#0f5132';
    ctx.strokeRect(menuX, y + 58, menuW, 280);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Masters', menuX + 20, y + 80);
    ctx.fillStyle = '#0d6efd';
    ctx.fillText('  Accounts Info.', menuX + 25, y + 102);
    ctx.fillText('  Inventory Info.', menuX + 25, y + 124);
    ctx.fillStyle = '#000000';
    ctx.fillText('Transactions', menuX + 20, y + 150);
    ctx.fillText('  Accounting Vouchers', menuX + 25, y + 172);
    ctx.fillText('  Inventory Vouchers', menuX + 25, y + 194);
    ctx.fillText('Reports', menuX + 20, y + 220);
    ctx.fillText('  Balance Sheet', menuX + 25, y + 242);
    ctx.fillText('  Profit & Loss A/c', menuX + 25, y + 264);
    ctx.fillText('  Stock Summary', menuX + 25, y + 286);
    ctx.fillText('  Display', menuX + 25, y + 308);
    ctx.fillText('  Quit', menuX + 25, y + 330);
  } else if (st.includes('ledger')) {
    // Ledger creation / table screen
    ctx.fillStyle = '#1e3a2f';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Multi Ledger Creation / Display - ${cmpName}`, 25, y + 25);
    ctx.fillText('Under Group : All Items', 25, y + 45);

    // Table
    const tableY = y + 60;
    ctx.fillStyle = '#114b43';
    ctx.fillRect(20, tableY, w - 40, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('S.No.', 30, tableY + 16);
    ctx.fillText('Name of Ledger', 80, tableY + 16);
    ctx.fillText('Under Group', 380, tableY + 16);
    ctx.fillText('Opening Balance (Dr/Cr)', w - 240, tableY + 16);

    const ledgers = [
      { no: 1, name: 'Bank A/c (SBI Bank)', group: 'Bank Accounts', bal: '1,50,000.00 Dr' },
      { no: 2, name: 'Capital Account', group: 'Capital Account', bal: '2,00,000.00 Cr' },
      { no: 3, name: 'Cash A/c', group: 'Cash-in-Hand', bal: '50,000.00 Dr' },
      { no: 4, name: 'Office Rent A/c', group: 'Indirect Expenses', bal: '0.00' },
      { no: 5, name: 'Salary A/c', group: 'Indirect Expenses', bal: '0.00' },
      { no: 6, name: 'Outstanding Salary A/c', group: 'Current Liabilities', bal: '3,000.00 Cr' },
      { no: 7, name: 'Ravi Traders A/c', group: 'Sundry Debtors', bal: '80,000.00 Dr' },
      { no: 8, name: 'Furniture A/c', group: 'Fixed Assets', bal: '40,000.00 Dr' }
    ];

    ledgers.forEach((l, idx) => {
      const rowY = tableY + 24 + idx * 26;
      ctx.fillStyle = idx % 2 === 0 ? '#f4f8f3' : '#eaf1e8';
      ctx.fillRect(20, rowY, w - 40, 26);
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '11px monospace';
      ctx.fillText(String(l.no), 35, rowY + 17);
      ctx.fillText(l.name, 80, rowY + 17);
      ctx.fillText(l.group, 380, rowY + 17);
      ctx.fillText(l.bal, w - 230, rowY + 17);
    });
  } else if (st.includes('voucher') || st.includes('day_book')) {
    // Accounting Voucher Entry (Payment, Receipt, Contra, Journal)
    const vType = st.includes('payment')
      ? 'Payment'
      : st.includes('receipt')
      ? 'Receipt'
      : st.includes('contra')
      ? 'Contra'
      : st.includes('journal')
      ? 'Journal'
      : 'Day Book';

    ctx.fillStyle = '#0f5132';
    ctx.fillRect(20, y + 15, 180, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${vType} Voucher No. 1`, 30, y + 31);

    ctx.fillStyle = '#114b43';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Company: ${cmpName}`, 220, y + 31);
    ctx.fillText('Date: 1-Apr-2026 (Wednesday)', w - 220, y + 31);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, y + 50, w - 40, 240);
    ctx.strokeStyle = '#2d6a4f';
    ctx.strokeRect(20, y + 50, w - 40, 240);

    ctx.fillStyle = '#1e3a2f';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Account : Cash / Bank', 35, y + 75);
    ctx.fillText('Current Balance: ₹ 75,000.00 Dr', 35, y + 95);

    // Table line
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(20, y + 115);
    ctx.lineTo(w - 20, y + 115);
    ctx.stroke();

    ctx.fillText('Particulars', 40, y + 135);
    ctx.fillText('Debit (₹)', w - 220, y + 135);
    ctx.fillText('Credit (₹)', w - 120, y + 135);

    ctx.font = '11px monospace';
    if (vType === 'Payment') {
      ctx.fillText('Office Rent A/c', 40, y + 165);
      ctx.fillText('5,000.00', w - 220, y + 165);
      ctx.fillText('Narration: Being office rent paid by cash.', 40, y + 250);
    } else if (vType === 'Receipt') {
      ctx.fillText('Ravi Traders A/c', 40, y + 165);
      ctx.fillText('80,000.00', w - 120, y + 165);
      ctx.fillText('Narration: Being cash received from Ravi Traders on account.', 40, y + 250);
    } else if (vType === 'Contra') {
      ctx.fillText('SBI Bank A/c', 40, y + 165);
      ctx.fillText('10,000.00', w - 220, y + 165);
      ctx.fillText('Narration: Being cash deposited into SBI Bank account.', 40, y + 250);
    } else {
      ctx.fillText('Salary A/c', 40, y + 165);
      ctx.fillText('3,000.00', w - 220, y + 165);
      ctx.fillText('To Outstanding Salary A/c', 55, y + 190);
      ctx.fillText('3,000.00', w - 120, y + 190);
      ctx.fillText('Narration: Being salary due for the month.', 40, y + 250);
    }
  } else if (st.includes('order')) {
    // Purchase or Sales Order
    const isPO = st.includes('purchase');
    ctx.fillStyle = '#0f5132';
    ctx.fillRect(20, y + 15, 220, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(isPO ? 'Purchase Order Creation: No. 1' : 'Sales Order Creation: No. 1', 30, y + 31);

    ctx.fillStyle = '#1e3a2f';
    ctx.font = '11px sans-serif';
    ctx.fillText(`Party A/c Name : ${isPO ? 'Tech Distributors' : 'Smart Solutions'}`, 30, y + 65);
    ctx.fillText(`Order No       : ORD-${regNo.slice(-4)}-01`, 30, y + 85);
    ctx.fillText('Delivery Date  : 20-July-2026', w - 240, y + 65);

    // Items table
    const tableY = y + 105;
    ctx.fillStyle = '#114b43';
    ctx.fillRect(20, tableY, w - 40, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Item Description', 35, tableY + 16);
    ctx.fillText('Due Date', 340, tableY + 16);
    ctx.fillText('Quantity', 480, tableY + 16);
    ctx.fillText('Rate per', 600, tableY + 16);
    ctx.fillText('Amount (₹)', w - 150, tableY + 16);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, tableY + 24, w - 40, 150);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '11px monospace';
    ctx.fillText('HP LAPTOP (Core i5, 16GB, 512GB SSD)', 35, tableY + 50);
    ctx.fillText(isPO ? '20-Jul-2026' : '18-Jul-2026', 340, tableY + 50);
    ctx.fillText(isPO ? '25 Nos' : '10 Nos', 480, tableY + 50);
    ctx.fillText(isPO ? '₹ 45,000.00' : '₹ 55,000.00', 600, tableY + 50);
    ctx.fillText(isPO ? '₹ 11,25,000.00' : '₹ 5,50,000.00', w - 150, tableY + 50);
  } else if (st.includes('payroll') || st.includes('payslip') || st.includes('paysheet')) {
    // Payroll voucher or payslip
    ctx.fillStyle = '#0f5132';
    ctx.fillRect(20, y + 15, 240, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Payroll Voucher / Payslip Display', 30, y + 31);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, y + 50, w - 40, 260);
    ctx.strokeStyle = '#2d6a4f';
    ctx.strokeRect(20, y + 50, w - 40, 260);

    ctx.fillStyle = '#1e3a2f';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Company: ${cmpName} | Reg: ${regNo}`, 35, y + 75);
    ctx.fillText('Pay Period: 1-Apr-2026 to 30-Apr-2026', 35, y + 95);

    // Earnings vs Deductions Table
    ctx.fillStyle = '#114b43';
    ctx.fillRect(35, y + 115, (w - 70) / 2, 22);
    ctx.fillRect(35 + (w - 70) / 2, y + 115, (w - 70) / 2, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Earnings (Arun - Manager)', 45, y + 130);
    ctx.fillText('Deductions', 45 + (w - 70) / 2, y + 130);

    ctx.fillStyle = '#000000';
    ctx.font = '11px monospace';
    ctx.fillText('Basic Pay        : ₹ 40,000.00', 45, y + 155);
    ctx.fillText('DA (10%)         : ₹  4,000.00', 45, y + 175);
    ctx.fillText('HRA (20%)        : ₹  8,000.00', 45, y + 195);
    ctx.fillText('Total Earnings   : ₹ 52,000.00', 45, y + 225);

    const rX = 45 + (w - 70) / 2;
    ctx.fillText('PF (12%)          : ₹  4,800.00', rX, y + 155);
    ctx.fillText('Professional Tax  : ₹    200.00', rX, y + 175);
    ctx.fillText('Total Deductions  : ₹  5,000.00', rX, y + 195);
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#1b5e20';
    ctx.fillText('NET PAY PAYABLE   : ₹ 47,000.00', rX, y + 230);
  } else {
    // Default Job Costing or Cost Category
    ctx.fillStyle = '#0f5132';
    ctx.fillRect(20, y + 15, 260, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Job Costing Analysis Report', 30, y + 31);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, y + 50, w - 40, 260);
    ctx.fillStyle = '#1e3a2f';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Job: XYZ PRINTERS - Brochure Printing (5000 Nos) | ${cmpName}`, 35, y + 75);

    ctx.font = '11px monospace';
    ctx.fillText('1. Direct Expenses: Printing Paper         : ₹ 30,000.00', 45, y + 110);
    ctx.fillText('2. Direct Expenses: Printing Ink Charges   : ₹  8,000.00', 45, y + 130);
    ctx.fillText('3. Direct Expenses: Labour Charges         : ₹ 20,000.00', 45, y + 150);
    ctx.fillText('4. Indirect Exp   : Machine Maintenance    : ₹  5,000.00', 45, y + 170);
    ctx.fillText('5. Indirect Exp   : Transportation Charges : ₹  2,000.00', 45, y + 190);

    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('TOTAL JOB COST BOOKED                      : ₹ 65,000.00', 45, y + 230);
  }
}
