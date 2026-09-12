import { ExperimentData, StudentDetails } from '../types';
import { generateTallyScreenshot } from '../utils/tallyCanvasGenerator';

export const INITIAL_STUDENT: StudentDetails = {
  registerNumber: '2513101040136',
  name: 'Barathwamanimethra S',
  rollNumber: '23UAC045',
  className: 'III B.Com (Computer Applications)',
  section: 'Section A',
  subjectName: 'Computerized Accounting - Tally ERP.9',
  institutionName: 'Department of Commerce & Computer Applications',
  academicYear: '2025 - 2026',
  defaultDate: '12 / 07 / 2026',
};

// Variation datasets to provide realistic changes for different students
const VENDOR_VARIANTS = [
  { supplier: 'TECH DISTRIBUTORS', customer: 'SMART SOLUTIONS', item: 'HP LAPTOP' },
  { supplier: 'ZENITH INFOTECH', customer: 'APEX DIGITAL SYSTEMS', item: 'DELL INSPIRON LAPTOP' },
  { supplier: 'MICRO SYSTEMS PVT LTD', customer: 'GLOBAL TRADERS', item: 'LENOVO THINKPAD' },
  { supplier: 'HORIZON ENTERPRISES', customer: 'SPECTRUM INFOSYS', item: 'ACER ASPIRE NOTEBOOK' },
];

const PAYROLL_VARIANTS = [
  {
    mgrName: 'ARUN',
    mgrRole: 'MANAGER',
    mgrPay: 40000,
    staffName: 'PRIYA',
    staffRole: 'OFFICE STAFF',
    staffPay: 25000,
    daPct: 10,
    hraPct: 20,
    pfPct: 12,
    ptax: 200,
  },
  {
    mgrName: 'RAMESH',
    mgrRole: 'FINANCE MANAGER',
    mgrPay: 45000,
    staffName: 'DEEPA',
    staffRole: 'ACCOUNTS EXECUTIVE',
    staffPay: 28000,
    daPct: 12,
    hraPct: 20,
    pfPct: 12,
    ptax: 200,
  },
  {
    mgrName: 'KARTHIK',
    mgrRole: 'PROJECT MANAGER',
    mgrPay: 42000,
    staffName: 'ANANYA',
    staffRole: 'ADMIN ASSISTANT',
    staffPay: 26000,
    daPct: 10,
    hraPct: 25,
    pfPct: 12,
    ptax: 200,
  },
  {
    mgrName: 'SURESH',
    mgrRole: 'GENERAL MANAGER',
    mgrPay: 48000,
    staffName: 'KAVITHA',
    staffRole: 'HR ASSISTANT',
    staffPay: 27000,
    daPct: 10,
    hraPct: 20,
    pfPct: 12,
    ptax: 200,
  },
];

const JOB_COST_VARIANTS = [
  {
    printer: 'XYZ PRINTERS',
    client: 'ABC Company',
    itemCount: '5,000 brochures',
    paperCost: 30000,
    inkCost: 8000,
    labourCost: 20000,
    maintCost: 5000,
    transCost: 2000,
  },
  {
    printer: 'PRIME GRAPHICS',
    client: 'Apex Industries',
    itemCount: '8,000 product catalogs',
    paperCost: 36000,
    inkCost: 9500,
    labourCost: 24000,
    maintCost: 6000,
    transCost: 2500,
  },
  {
    printer: 'ROYAL PRESS WORKS',
    client: 'Zenith College',
    itemCount: '6,500 annual prospectuses',
    paperCost: 32000,
    inkCost: 8500,
    labourCost: 21000,
    maintCost: 5500,
    transCost: 2200,
  },
  {
    printer: 'MODERN OFFSET PRINTERS',
    client: 'Metro Enterprises',
    itemCount: '10,000 marketing leaflets',
    paperCost: 40000,
    inkCost: 11000,
    labourCost: 25000,
    maintCost: 7000,
    transCost: 3000,
  },
];

export function generateDynamicExperiments(
  student: StudentDetails,
  seed: number = 0
): ExperimentData[] {
  const regNo = student.registerNumber.trim() || '2513101040136';
  const vIndex = Math.abs(seed) % 4;
  const vendor = VENDOR_VARIANTS[vIndex];
  const payroll = PAYROLL_VARIANTS[vIndex];
  const job = JOB_COST_VARIANTS[vIndex];

  // Calculated payroll figures
  const mgrDA = (payroll.mgrPay * payroll.daPct) / 100;
  const mgrHRA = (payroll.mgrPay * payroll.hraPct) / 100;
  const mgrGross = payroll.mgrPay + mgrDA + mgrHRA;
  const mgrPF = (payroll.mgrPay * payroll.pfPct) / 100;
  const mgrDed = mgrPF + payroll.ptax;
  const mgrNet = mgrGross - mgrDed;

  const staffDA = (payroll.staffPay * payroll.daPct) / 100;
  const staffHRA = (payroll.staffPay * payroll.hraPct) / 100;
  const staffGross = payroll.staffPay + staffDA + staffHRA;
  const staffPF = (payroll.staffPay * payroll.pfPct) / 100;
  const staffDed = staffPF + payroll.ptax;
  const staffNet = staffGross - staffDed;

  // Job cost calculations
  const directTotal = job.paperCost + job.inkCost + job.labourCost;
  const indirectTotal = job.maintCost + job.transCost;
  const jobTotal = directTotal + indirectTotal;

  // Default dates for experiments
  const dateBase = student.defaultDate || '12 / 07 / 2026';

  return [
    // ----------------------------------------------------
    // EXPERIMENT 1
    // ----------------------------------------------------
    {
      id: 1,
      exNo: '01',
      date: dateBase,
      title: 'CREATION OF COMPANY IN TALLY ERP.9 WITH CONTROL SETUP',
      aim: 'To create a new company in Tally.ERP 9 and protect it with a TallyVault password, as part of learning company-level security and control setup.',
      procedureSteps: [
        'Open Tally.ERP 9 from the desktop icon.',
        'On the Startup screen, click Work in Educational Mode since we are using the free version of the software.',
        'From the Gateway of Tally, go to Company Info and select Create Company.',
        `Type your register number (${regNo}) as the Company Name. The Financial Year and Books Beginning date are auto-filled as 1-4-2026, and the country is set to India.`,
        'Under Security Control, click the TallyVault Password box and type a password to lock the company data. Retype the same password in Repeat Password to confirm it. Tally also shows a password-strength meter (Weak / Strong) so you know how safe your password is.',
        'Press Ctrl+A (or click Accept) to save the company.',
        'Return to the Gateway of Tally and confirm that your company name appears in the list — this shows the company has been created and secured successfully.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 1,
          imageUrl: generateTallyScreenshot({
            screenType: 'startup',
            regNo,
            companyName: `${regNo} EX:1`,
          }),
          caption: 'Startup Screen — Select Work in Educational Mode',
        },
        {
          stepIndex: 3,
          imageUrl: generateTallyScreenshot({
            screenType: 'company_create',
            regNo,
            companyName: `${regNo} EX:1`,
          }),
          caption: 'Company Creation Screen with TallyVault Password & Controls',
        },
        {
          stepIndex: 5,
          imageUrl: generateTallyScreenshot({
            screenType: 'company_created_gateway',
            regNo,
            companyName: `${regNo} EX:1`,
          }),
          caption: 'Gateway of Tally — Active Company Displayed',
        },
      ],
      outputImages: [
        {
          id: 'ex1_out_1',
          title: 'TallyVault Login & Gateway Verification',
          imageUrl: generateTallyScreenshot({
            screenType: 'company_vault',
            regNo,
            companyName: `${regNo} EX:1`,
          }),
          caption: 'Output: Prompt for TallyVault Password upon Company Access',
        },
      ],
      result: `A new company was created in Tally.ERP 9 and successfully secured with a TallyVault password and feature controls.`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 2
    // ----------------------------------------------------
    {
      id: 2,
      exNo: '02',
      date: dateBase,
      title: 'CREATION OF SINGLE AND MULTIPLE LEDGERS',
      aim: 'To create single and multiple ledger accounts inside a Tally company for recording various business transactions.',
      procedureSteps: [
        `Open a new company ${regNo} Ex2 from the Gateway of Tally.`,
        'Go to Gateway of Tally → Accounts Info → Ledgers.',
        'To create just one ledger at a time, choose Single Ledger → Create. Type the name Rent A/c and set its group as Indirect Expenses, since rent is a running business expense. Leave the opening balance blank and press Ctrl+A to save.',
        'To create several ledgers together, choose Multiple Ledgers → Create instead. In the table, type each ledger name and choose its group in the next column: Bank A/c under Bank Accounts, Capital A/c under Capital Account, Cash A/c under Cash-in-Hand, and Salary A/c under Indirect Expenses.',
        'Press Ctrl+A to save all the ledgers at once.',
      ],
      tables: [
        {
          title: 'Master Ledgers to be Created',
          columns: ['S.No.', 'Ledger Name', 'Under Group', 'Nature'],
          rows: [
            ['1', 'Bank A/c (SBI Bank)', 'Bank Accounts', 'Asset'],
            ['2', 'Capital A/c', 'Capital Account', 'Liability'],
            ['3', 'Cash A/c', 'Cash-in-Hand', 'Current Asset'],
            ['4', 'Rent A/c', 'Indirect Expenses', 'Expense'],
            ['5', 'Salary A/c', 'Indirect Expenses', 'Expense'],
            ['6', 'Ravi Traders A/c', 'Sundry Debtors', 'Asset'],
          ],
        },
      ],
      inlineScreenshots: [
        {
          stepIndex: 1,
          imageUrl: generateTallyScreenshot({
            screenType: 'company_create',
            regNo,
            companyName: `${regNo} Ex2`,
          }),
          caption: 'Company Creation for Ledger Exercise',
        },
        {
          stepIndex: 2,
          imageUrl: generateTallyScreenshot({
            screenType: 'single_ledger',
            regNo,
            companyName: `${regNo} Ex2`,
          }),
          caption: 'Single Ledger Creation — Rent A/c under Indirect Expenses',
        },
        {
          stepIndex: 4,
          imageUrl: generateTallyScreenshot({
            screenType: 'multi_ledger',
            regNo,
            companyName: `${regNo} Ex2`,
          }),
          caption: 'Multiple Ledgers Creation — Chart of Accounts',
        },
      ],
      outputImages: [
        {
          id: 'ex2_out_1',
          title: 'Ledger Display and Multiple Ledger Chart',
          imageUrl: generateTallyScreenshot({
            screenType: 'ledger_display',
            regNo,
            companyName: `${regNo} Ex2`,
          }),
          caption: 'Output: Full List of Created Ledgers under All Items',
        },
      ],
      result: `Single and multiple ledger accounts were created successfully in Tally.ERP 9.`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 3
    // ----------------------------------------------------
    {
      id: 3,
      exNo: '03',
      date: dateBase,
      title: 'CREATION OF DEFAULT VOUCHERS — PAYMENT, RECEIPT, CONTRA AND JOURNAL',
      aim: 'To record four common types of accounting vouchers — Payment, Receipt, Contra and Journal — for everyday business transactions in Tally.ERP 9.',
      tables: [
        {
          title: 'Transactions to be Recorded',
          columns: ['S.No.', 'Transaction', 'Voucher Type', 'Amount (₹)'],
          rows: [
            ['1', 'Paid Office Rent in cash', 'Payment (F5)', '5,000'],
            ['2', 'Received cash from Ravi Traders (on account)', 'Receipt (F6)', '80,000'],
            ['3', 'Cash deposited into SBI Bank', 'Contra (F4)', '10,000'],
            ['4', 'Salary due but not yet paid', 'Journal (F7)', '3,000'],
          ],
        },
      ],
      procedureSteps: [
        `Open the company ${regNo} Ex3.`,
        'Before entering any voucher, first create the ledgers you will need: Cash A/c, Office Rent A/c, Outstanding Salary A/c, Ravi Traders A/c, Salary A/c and SBI Bank A/c, each under its correct group.',
        'Go to Gateway of Tally → Accounting Vouchers.',
        'Press F5 for Payment. Set Account as Cash, add Office Rent A/c under Particulars, enter ₹5,000 and save.',
        'Press F6 for Receipt. Set Account as Cash, add Ravi Traders A/c under Particulars, enter ₹80,000 and save.',
        'Press F4 for Contra. Set Account as Cash, and transfer ₹10,000 into SBI Bank A/c, then save.',
        'Press F7 for Journal. Debit Salary A/c and credit Outstanding Salary A/c with ₹3,000, then save.',
        'Open Display → Day Book to see all four vouchers listed together and cross-check the amounts.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 3,
          imageUrl: generateTallyScreenshot({
            screenType: 'voucher_payment',
            regNo,
            companyName: `${regNo} Ex3`,
          }),
          caption: 'Payment Voucher Entry (F5) — Office Rent Paid',
        },
        {
          stepIndex: 4,
          imageUrl: generateTallyScreenshot({
            screenType: 'voucher_receipt',
            regNo,
            companyName: `${regNo} Ex3`,
          }),
          caption: 'Receipt Voucher Entry (F6) — Cash Received',
        },
        {
          stepIndex: 5,
          imageUrl: generateTallyScreenshot({
            screenType: 'voucher_contra',
            regNo,
            companyName: `${regNo} Ex3`,
          }),
          caption: 'Contra Voucher Entry (F4) — Bank Deposit',
        },
        {
          stepIndex: 6,
          imageUrl: generateTallyScreenshot({
            screenType: 'voucher_journal',
            regNo,
            companyName: `${regNo} Ex3`,
          }),
          caption: 'Journal Voucher Entry (F7) — Outstanding Expense Adjustment',
        },
      ],
      outputImages: [
        {
          id: 'ex3_out_1',
          title: 'Day Book Verification Report',
          imageUrl: generateTallyScreenshot({
            screenType: 'day_book',
            regNo,
            companyName: `${regNo} Ex3`,
          }),
          caption: 'Output: Day Book Displaying All 4 Recorded Vouchers',
        },
      ],
      result: `The Payment, Receipt, Contra and Journal vouchers were recorded successfully in Tally.ERP 9.`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 4
    // ----------------------------------------------------
    {
      id: 4,
      exNo: '04',
      date: dateBase,
      title: 'CREATION OF INVENTORY WITH STOCK GROUP AND STOCK ITEMS',
      aim: 'To organise inventory in Tally.ERP 9 by creating Stock Groups, Units of Measure, and Stock Items with opening balances.',
      question: `Create a company named "${regNo}_EX-04" in Tally.ERP 9. Enable inventory features and create the following Stock Groups and Stock Items with appropriate Units of Measure and opening balances.`,
      tables: [
        {
          title: 'Stock Groups to Create',
          columns: ['S.NO', 'Stock Group', 'Under'],
          rows: [
            ['1.', 'Electronics', 'Primary'],
            ['2.', 'Furniture', 'Primary'],
            ['3.', 'Stationery', 'Primary'],
          ],
        },
        {
          title: 'Stock Items with Opening Balance as on 1-4-2026',
          columns: ['S.NO', 'Stock Item', 'Under Group', 'Unit', 'Opening Qty', 'Rate (₹)', 'Opening Value (₹)'],
          rows: [
            ['1.', 'LED TV', 'Electronics', 'Nos', '10', '20,000', '2,00,000'],
            ['2.', 'Refrigerator', 'Electronics', 'Nos', '5', '15,000', '75,000'],
            ['3.', 'Office Chair', 'Furniture', 'Nos', '20', '2,000', '40,000'],
            ['4.', 'Wooden Table', 'Furniture', 'Nos', '8', '5,000', '40,000'],
            ['5.', 'A4 Paper', 'Stationery', 'Box', '50', '250', '12,500'],
            ['6.', 'Pen', 'Stationery', 'Nos', '100', '10', '1,000'],
          ],
        },
      ],
      procedureSteps: [
        `Open Tally.ERP 9 and select the company ${regNo}_EX-04.`,
        'Go to Gateway of Tally → Inventory Info.',
        'Choose Stock Groups → Create. Create primary groups: Electronics, Furniture, Stationery.',
        'Choose Units of Measure → Create. Add units: Nos (Numbers) and Box (Boxes).',
        'Choose Stock Items → Multi Stock Item Creation.',
        'Enter each item with its stock group, unit of measurement, opening quantity, and rate.',
        'Verify all opening balances calculate automatically (Total: ₹3,68,500).',
        'Press Ctrl + A to save the stock items.',
        'Check Display → Stock Summary to confirm the closing balance inventory valuation.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 2,
          imageUrl: generateTallyScreenshot({
            screenType: 'stock_group_create',
            regNo,
            companyName: `${regNo}_EX-04`,
          }),
          caption: 'Multiple Stock Group Creation Screen',
        },
        {
          stepIndex: 4,
          imageUrl: generateTallyScreenshot({
            screenType: 'multi_stock_item',
            regNo,
            companyName: `${regNo}_EX-04`,
          }),
          caption: 'Multi Stock Item Creation with Opening Balances',
        },
      ],
      outputImages: [
        {
          id: 'ex4_out_1',
          title: 'Stock Summary Report',
          imageUrl: generateTallyScreenshot({
            screenType: 'stock_summary',
            regNo,
            companyName: `${regNo}_EX-04`,
          }),
          caption: 'Output: Stock Summary Closing Balance (₹3,68,500.00)',
        },
      ],
      result: `The required stock groups and stock items were successfully created in Tally.ERP 9.`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 5
    // ----------------------------------------------------
    {
      id: 5,
      exNo: '05',
      date: dateBase,
      title: 'CREATION OF PURCHASE ORDER AND SALES ORDER VOUCHER',
      aim: 'To record Purchase Order and Sales Order vouchers for goods ordered from a supplier and by a customer in Tally.ERP 9.',
      question: `COMPANY: ${regNo}_EX-05\nGODOWN: Main Location | UNIT: NOS | STOCK ITEM: ${vendor.item} | GROUP: ELECTRONICS\n\nPURCHASE ORDER:\nOn 10 July 2026, ABC Traders places a Purchase Order to ${vendor.supplier} for:\n${vendor.item} – 25 NOS @ ₹45,000 per Laptop | Delivery Date: 20 July 2026 | Total Value: ₹11,25,000\n\nSALES ORDER:\nOn 12 July 2026, ABC Traders receives a Sales Order from ${vendor.customer} for:\n${vendor.item} – 10 NOS @ ₹55,000 per Laptop | Delivery Date: 18 July 2026 | Total Value: ₹5,50,000`,
      procedureSteps: [
        `Open the company ${regNo}_EX-05 and go to Gateway of Tally.`,
        'Enable Order Processing: Press F11 → Inventory Features, and set Enable Purchase Order Processing to Yes and Enable Sales Order Processing to Yes.',
        'Go to Gateway of Tally → Order Vouchers (or Accounting Vouchers).',
        `Press Alt + F4 to open Purchase Order. Select Party Name as ${vendor.supplier}, Order No: 1, select ${vendor.item}, Quantity: 25 Nos, Rate: ₹45,000. Press Ctrl + A to save.`,
        `Press Alt + F5 to open Sales Order. Select Party Name as ${vendor.customer}, Order No: 1, select ${vendor.item}, Quantity: 10 Nos, Rate: ₹55,000. Press Ctrl + A to save.`,
        'Check Statements of Inventory → Sales Order → Order Details to confirm pending customer orders.',
        'Check Statements of Inventory → Purchase Order → Order Details to confirm pending supplier orders.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 3,
          imageUrl: generateTallyScreenshot({
            screenType: 'purchase_order',
            regNo,
            companyName: `${regNo}_EX-05`,
          }),
          caption: `Purchase Order Entry — ${vendor.supplier} (25 Nos @ ₹45,000)`,
        },
        {
          stepIndex: 4,
          imageUrl: generateTallyScreenshot({
            screenType: 'sales_order',
            regNo,
            companyName: `${regNo}_EX-05`,
          }),
          caption: `Sales Order Entry — ${vendor.customer} (10 Nos @ ₹55,000)`,
        },
      ],
      outputImages: [
        {
          id: 'ex5_out_1',
          title: 'Sales & Purchase Orders Outstanding Reports',
          imageUrl: generateTallyScreenshot({
            screenType: 'order_details_sales',
            regNo,
            companyName: `${regNo}_EX-05`,
          }),
          caption: 'Output: Sales Order & Purchase Order Outstanding Statement',
        },
      ],
      result: `The Purchase Order and Sales Order vouchers were created and verified successfully in Tally.ERP 9.`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 6
    // ----------------------------------------------------
    {
      id: 6,
      exNo: '06',
      date: dateBase,
      title: 'CREATION OF PAYROLL, PAY HEADS, ATTENDANCE AND REPORTS',
      aim: 'To create payroll information, pay heads, attendance records and generate salary reports using Tally.ERP 9.',
      tables: [
        {
          title: 'Employee Master Details',
          columns: ['Employee Name', 'Group', 'Basic Pay (₹)', 'Attendance'],
          rows: [
            [payroll.mgrName, 'Managers', payroll.mgrPay.toLocaleString('en-IN'), '30 Days'],
            [payroll.staffName, 'Employees', payroll.staffPay.toLocaleString('en-IN'), '30 Days'],
          ],
        },
        {
          title: 'Pay Heads Structure & Computation',
          columns: ['Pay Head Type', 'Pay Head Name', 'Calculation Type', 'Formula / Value'],
          rows: [
            ['Earnings', 'Basic Pay', 'On Attendance', 'Fixed per month'],
            ['Earnings', 'DA', 'As Computed Value', `${payroll.daPct}% on Basic Pay`],
            ['Earnings', 'HRA', 'As Computed Value', `${payroll.hraPct}% on Basic Pay`],
            ['Deductions', 'PF', 'As Computed Value', `${payroll.pfPct}% on Basic Pay`],
            ['Deductions', 'Professional Tax', 'Flat Rate', `₹${payroll.ptax} flat`],
          ],
        },
      ],
      procedureSteps: [
        `Open the company ${regNo}_EX-06 and press F11 → Accounting Features. Set Maintain Payroll to Yes.`,
        'Go to Gateway of Tally → Payroll Info.',
        'Create Employee Groups: Managers and Employees.',
        `Create Employees: ${payroll.mgrName} under Managers and ${payroll.staffName} under Employees.`,
        'Create Attendance Type: Present (Attendance / Leave with Pay, measured in Days).',
        'Create Pay Heads: Basic Pay, DA, HRA, Provident Fund (PF), and Professional Tax (PT).',
        'Define Salary Details for each employee with the specified formulas.',
        'Go to Payroll Vouchers → Attendance (Ctrl + F5). Mark attendance as 30 days Present.',
        'Go to Payroll Voucher (Ctrl + F4) and use Payroll AutoFill to compute monthly salaries.',
        'View Pay Sheet and individual Pay Slips from Gateway of Tally → Display → Payroll Reports.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 3,
          imageUrl: generateTallyScreenshot({
            screenType: 'employee_create',
            regNo,
            companyName: `${regNo}_EX-06`,
          }),
          caption: 'Employee Creation under Respective Category',
        },
        {
          stepIndex: 5,
          imageUrl: generateTallyScreenshot({
            screenType: 'payhead_create',
            regNo,
            companyName: `${regNo}_EX-06`,
          }),
          caption: 'Pay Head Creation Screen (Earnings & Deductions)',
        },
        {
          stepIndex: 8,
          imageUrl: generateTallyScreenshot({
            screenType: 'payroll_voucher',
            regNo,
            companyName: `${regNo}_EX-06`,
          }),
          caption: 'Payroll Voucher AutoFill Calculation',
        },
      ],
      outputImages: [
        {
          id: 'ex6_out_1',
          title: 'Pay Sheet and Individual Pay Slip',
          imageUrl: generateTallyScreenshot({
            screenType: 'paysheet',
            regNo,
            companyName: `${regNo}_EX-06`,
          }),
          caption: `Output: Pay Sheet & Pay Slips (Net Pay: ${payroll.mgrName} ₹${mgrNet.toLocaleString('en-IN')}, ${payroll.staffName} ₹${staffNet.toLocaleString('en-IN')})`,
        },
      ],
      result: `Payroll, Pay Heads and Attendance records were created, and the monthly salary was processed successfully in Tally.ERP 9. (Net Pay — ${payroll.mgrName}: ₹${mgrNet.toLocaleString('en-IN')}, ${payroll.staffName}: ₹${staffNet.toLocaleString('en-IN')})`,
    },

    // ----------------------------------------------------
    // EXPERIMENT 7
    // ----------------------------------------------------
    {
      id: 7,
      exNo: '07',
      date: dateBase,
      title: 'JOB COSTING IN TALLY ERP.9',
      aim: 'To enable and maintain Job Costing in Tally.ERP 9 for calculating and analysing the total cost incurred for a specific job or project.',
      question: `${job.printer} has received an order to print ${job.itemCount} for ${job.client}. The management wants to calculate the total cost of this planning job using Job Costing in Tally.ERP 9.\nCreate the required Cost Category, Cost Centre, Ledgers, record the transactions, and display the Job Cost Report.`,
      tables: [
        {
          title: 'Job Costing Transactions',
          columns: ['S.NO', 'Transaction Description', 'Expense Type', 'Amount (₹)'],
          rows: [
            ['1', 'Purchased Printing paper in cash', 'Direct Expenses', job.paperCost.toLocaleString('en-IN')],
            ['2', 'Paid Printing Ink Charges', 'Direct Expenses', job.inkCost.toLocaleString('en-IN')],
            ['3', 'Paid Printing Labour charges', 'Direct Expenses', job.labourCost.toLocaleString('en-IN')],
            ['4', 'Paid Machine Maintenance Charges', 'Indirect Expenses', job.maintCost.toLocaleString('en-IN')],
            ['5', 'Paid Transportation Charges', 'Indirect Expenses', job.transCost.toLocaleString('en-IN')],
          ],
        },
      ],
      procedureSteps: [
        `Open the company ${regNo}_EX-07 and press F11 → Accounting Features.`,
        'Set Maintain Cost Centres to Yes and Use Cost Centre for Job Costing to Yes.',
        'Go to Gateway of Tally → Accounts Info → Cost Categories → Create. Create category: "Printing Jobs".',
        `Go to Cost Centres → Create. Create cost centre: "${job.client} - Brochure Job", Category: "Printing Jobs", Use for job costing: Yes.`,
        'Create required expense ledgers (Paper Purchase, Ink Charges, Labour Charges, Machine Maintenance, Transportation) and allocate each to Cost Centres.',
        'Record each transaction using Payment Voucher (F5), allocating each expense to the respective Job Cost Centre.',
        'View the Job Work Analysis and Cost Category Summary reports under Gateway of Tally → Display → Statements of Accounts → Cost Centres.',
      ],
      inlineScreenshots: [
        {
          stepIndex: 1,
          imageUrl: generateTallyScreenshot({
            screenType: 'job_costing_features',
            regNo,
            companyName: `${regNo}_EX-07`,
          }),
          caption: 'F11 Accounting Features — Enabling Cost Centres for Job Costing',
        },
        {
          stepIndex: 3,
          imageUrl: generateTallyScreenshot({
            screenType: 'cost_centre',
            regNo,
            companyName: `${regNo}_EX-07`,
          }),
          caption: `Cost Centre Creation — ${job.client} under Printing Jobs`,
        },
      ],
      outputImages: [
        {
          id: 'ex7_out_1',
          title: 'Cost Category Summary & Job Work Analysis',
          imageUrl: generateTallyScreenshot({
            screenType: 'job_work_analysis',
            regNo,
            companyName: `${regNo}_EX-07`,
          }),
          caption: `Output: Total Job Cost ₹${jobTotal.toLocaleString('en-IN')} (Direct: ₹${directTotal.toLocaleString('en-IN')} + Indirect: ₹${indirectTotal.toLocaleString('en-IN')})`,
        },
      ],
      result: `Using Job Costing, the total cost of printing ${job.itemCount} for ${job.client} was found to be ₹${jobTotal.toLocaleString('en-IN')} (₹${directTotal.toLocaleString('en-IN')} Direct Expenses + ₹${indirectTotal.toLocaleString('en-IN')} Indirect Expenses).`,
    },
  ];
}
