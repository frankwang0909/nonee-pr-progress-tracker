const stageLabels = [
	['aor', 'AOR'],
	['fd', 'Final Decision'],
	['p1', 'Portal 1'],
	['p2', 'Portal 2'],
	['ecopr', 'eCOPR'],
];

const abbreviations = [
  ['ADR', 'Additional Documents Requested/Required'],
  ['AINP', 'Alberta Immigrant Nominee Program'],
  ['AIP', 'Approval in Principle'],
  ['AIP', 'Atlantic Immigration Program'],
  ['AITP', 'Access to Information and Privacy'],
  ['AOR', 'Acknowledgement of receipt letter.'],
  ['AR', 'Arrival Date'],
  ['BC', 'Birth Certificate'],
  ['BIL', 'Biometrics Instruction Letter'],
  ['BOWP', 'Bridged Open Work Permit'],
  ['BVL', 'Biometric Validation Letter'],
  ['CAIPS', 'Computer-Assisted Immigration Processing System'],
  ['CBSA', 'Canada Border Services Agency'],
  ['CC', 'Credit Card'],
  ['CEC', 'Canadian Experience Class'],
  ['CELPIP', 'Canadian English Language Proficiency Index Program'],
  ['CHC', 'Canadian High Commission - refers to the Canadian embassies, Visa offices, and Consulates.'],
  ['CIC', 'Citizenship and Immigration, Canada'],
  ['CIO', 'Centralized Intake Office in Sydney Nova Scotia - where you sent your application. Sometimes it is mentioned as CIU (Centralized Intake Unit).'],
  ['CLB', 'Canadian Language Benchmark'],
  ['COB', 'Country of Birth'],
  ['COE', 'Certificate of employment'],
  ['COI', 'Certificate of Identity'],
  ['COPR', 'Confirmation of Permanent Residency'],
  ['CPC', 'Case Processing Center'],
  ['CRS', 'Comprehensive Ranking System'],
  ['CSIS', 'Canadian Security Intelligence Service'],
  ['CSQ', 'Certificate du Selection du Quebec (Quebec Certificate of Selection)'],
  ['DD', 'Demand Draft (Bank Draft / Certified Cheque / Money Order)'],
  ['DIO', 'Designated Immigration Officer'],
  ['DMP', 'Designated Medical Practitioner.'],
  ['ECA', 'Educational Credential Assessment'],
  ['eCoPR', 'Electronic Confirmation of Permanent Residence'],
  ['EE', 'Express Entry'],
  ['EESW', 'Express Entry Skilled Worker'],
  ['EOI', 'Expression of Interest'],
  ['FC', 'Family Class'],
  ['FC', 'Family Class'],
  ['FD', 'Final Decision'],
  ['FD', 'Fixed Deposit'],
  ['FN', 'Foreign National'],
  ['FPT', 'Federal, Provincial, Territorial'],
  ['FSL', 'French as a Second Language'],
  ['FST', 'Federal Skilled Trade'],
  ['FSW', 'Federal Skilled Worker'],
  ['GCMS', 'Global Case Management System'],
  ['GIC', 'Guaranteed Investment Certificate'],
  ['GU1', 'Ghost Update 1'],
  ['GU2', 'Ghost Update 2'],
  ['IA', 'Initial Assessment'],
  ['ICCRC', 'Immigration Consultants of Canada Regulatory Council'],
  ['IELTS', 'International English Language Testing System'],
  ['IG', 'International Graduate'],
  ['IME', 'Immigration Medical Examination'],
  ['IMM-CAT', 'Immigration Category'],
  ['IMP', 'International Mobility Program (Gov. of Canada Program, PNP & AIP)'],
  ['IRCC', 'Immigration, Refugees and Citizenship Canada'],
  ['IRPA', 'Immigration and Refugee Protection Act'],
  ['IRPR', 'Immigration and Refugee Protection Regulations'],
  ['ITA', 'Invitation to Apply'],
  ['JD', 'Job Description'],
  ['JVA', 'Job Vacancy Assessment'],
  ['LMIA', 'Labour Market Impact Assessment'],
  ['LOA', 'Letter of Acceptance'],
  ['LOI', 'Letter of Introduction'],
  ['MI', 'Ministerial Instructions'],
  ['MR', 'Medical Examination Request'],
  ['NCR', 'No Criminal Record'],
  ['NOA', 'Notice of Assessment'],
  ['NOC', 'National Occupation Classification'],
  ['NOI', 'Notification of Interest'],
  ['OINP', 'Ontario Immigrant Nominee Program'],
  ['OPR', 'Original Passport Request'],
  ['OREQ', 'Other Requirement'],
  ['PA', 'Principal Applicant'],
  ['PA', 'Privacy Act'],
  ['PAL', 'Pre-Arrival Letter'],
  ['PAL', 'Provincial Attestation Letter (student visa term)'],
  ['PCC', 'Police Clearance Certificate'],
  ['PEI', 'Preliminary Evaluation for Immigration'],
  ['PER', 'Confirmation of Positive Eligibility Review from CIO'],
  ['PER', 'Positive Eligibility Review'],
  ['PF (Letter)', 'Procedural Fairness (Letter)'],
  ['PGWP', 'Post Graduate Work Permit'],
  ['PHAC', 'Public Health Agency of Canada'],
  ['PI', 'Principal immigrant'],
  ['PNP', 'Province Nominee Program'],
  ['POB', 'Place of Birth'],
  ['POE', 'Port of Entry'],
  ['POF', 'Proof of Funds'],
  ['PPR', 'Passport Request'],
  ['PR', 'Permanent Resident'],
  ['PRC', 'Permanent Residency Card'],
  ['PRTD', 'Permanent Resident Travel Document'],
  ['PTR', 'Protected Temporary Resident'],
  ['RBVO', 'Received by Visa Office'],
  ['RCIC', 'Regulated Canadian Immigration Consultant'],
  ['RFV', 'Ready for visa'],
  ['ROI', 'Round of Invitations'],
  ['RPRF', 'Right of Permanent Residence Fees'],
  ['RTD', 'Refugee Travel Document'],
  ['RTS', 'Refugee Tracking System'],
  ['SAH', 'Sponsorship Agreement Holder'],
  ['SEC CRIM', 'Security criminal'],
  ['SIN', 'Social Insurance Number'],
  ['SINP', 'Saskatchewan Immigrant Nominee Program'],
  ['SLU', 'Second Level Update'],
  ['SOWP', 'Spousal Open Work Permit'],
  ['SP', 'Study Permit'],
  ['SW', 'Skill Worker'],
  ['TEER', 'Training, Education, Experience, and Responsibilities'],
  ['TFN', 'Temporary file number'],
  ['TFW', 'Temporary Foreign Worker'],
  ['TFWP', 'Temporary Foreign Worker Program (Gov. of Canada Program)'],
  ['TRF', 'Test Report Form'],
  ['TRP', 'Temporary Resident Permit'],
  ['TRV', 'Temporary Resident Visa'],
  ['UCI', 'Unique Client Identifier'],
  ['VAC', 'Visa Application Center'],
  ['VFS', 'Visa Facilitation Services'],
  ['VO', 'Visa Officer'],
  ['VO', 'Visa Office'],
  ['VOR', 'Visa Office-Referred (case)'],
  ['WES', 'World Education Services'],
  ['XREF', 'cross-referenced applicant'],
];

const processSteps = {
  zh: [
    'AOR: 目前趋势下，多数 AR 后约 140+ 天收到 AOR（会变化）；EE 通常提交后很快拿到 AOR。',
    'AOR 后：如已付生物信息费，会收到 BIL；未付可能先收到 ADR 要求补交 BIL 费用，或因材料缺失收到其他 ADR。',
    'Return 常见原因：出生证明问题、IMM5406/IMM5669 等表格信息缺失、PCC 问题、姓名不一致等。',
    'AOR 后 IRCC 会推进 Eligibility 与 Background：核验教育、NOC、工作经历、资金等申报信息。',
    'Eligibility 通过后可能收到 PAL（Pre-Arrival Letter）；登陆申请人也可能收到，但有时不会触发邮件。',
    'Medical 常与其他环节并行：境外即使 upfront medical 也不代表自动完成；登陆目前多为豁免，如 5 年内有 IME 可能无需重做。',
    '境外申请一般在体检被审阅并通过后，Medical 才会标记完成。',
    'Background（体检相关，登陆）：IRCC 可能向 RMO 请求体检状态；可能直接完成，也可能发 MR 重新体检，此阶段可能耗时较久。',
    'Background 其他子项会并行推进，例如 information sharing。',
    'Background（刑事）：若生物信息与 PCC 有效且无 NRT，criminality 通常可完成；有 NRT 时会进入人工复核，可能出现 ghost update。',
    'Background（安审）：Eligibility passed 或 recommended passed 后可能进入 security；常规安审通常几天到几周，非常规则进入更深入审查。',
    '若未进入 comprehensive security check，Background 完成后通常会到 FD。',
    '若进入 comprehensive check，通常没有明确时间线，是最不确定阶段。',
    'Landing（登陆）：Background 完成且 FD 后触发 Portal 1；境外通常是 PPR。',
    'Landing（登陆）：进入 Portal 2。',
    'Landing（登陆）：PR Card 阶段。通常第 14-16 步合称 landing process。',
  ],
  en: [
    'AOR: Under current trends, most applicants receive AOR ~140+ days after AR (subject to change); EE applicants typically receive AOR shortly after submission.',
    'After AOR: If biometrics fees were already paid, a BIL will be issued; otherwise an ADR for BIL fees may arrive first, or other ADRs for missing documents.',
    'Common Return reasons: birth certificate issues, missing fields in IMM5406/IMM5669, PCC issues, name inconsistencies, etc.',
    'After AOR, IRCC will advance Eligibility & Background: verifying education, NOC, work history, funds, and other declared information.',
    'After Eligibility is passed, a PAL (Pre-Arrival Letter) may be issued; inland applicants may also receive one, though sometimes without an email notification.',
    'Medical often runs in parallel: overseas applicants with upfront medical are not automatically cleared; inland applicants are mostly exempt — those with a valid IME within 5 years may not need to redo it.',
    'For overseas applicants, Medical is typically marked complete only after the exam has been reviewed and approved.',
    'Background (medical, inland): IRCC may request the RMO for exam status; may clear directly or trigger an MR for re-examination — this stage can be time-consuming.',
    'Other Background sub-items run in parallel, e.g., information sharing.',
    'Background (criminality): If biometrics and PCC are valid and there is no NRT, criminality can usually be cleared; NRT cases go to manual review and may produce ghost updates.',
    'Background (security): May enter security review after Eligibility passed/recommended; routine checks typically take days to weeks, non-routine cases enter deeper investigation.',
    'Without a comprehensive security check, Background is typically followed by FD.',
    'With a comprehensive security check, there is generally no clear timeline — this is the most uncertain stage.',
    'Landing (inland): Background complete and FD triggers Portal 1; overseas applicants typically receive a PPR.',
    'Landing (inland): Enter Portal 2.',
    'Landing (inland): PR Card stage. Steps 14–16 are collectively referred to as the landing process.',
  ],
};

const translations = {
  zh: {
    heroTitle:   'NON EE PR 进度看板',
    asOf:        '更新时间',
    sourceNote:  '数据来源：公开共享 Google Sheets 数据。',
    contribute:  '贡献数据 / 查看全部数据源',
    diagramTitle:'PR 流程图',
    processTitle:'PR 流程步骤',
    processTip:  '基于你提供的过去一年样本经验总结，实际流程会因个案而不同。',
    returnsTitle:'退件原因',
    returnCount: (n) => `总条数: ${n}`,
    abbrTitle:   '简写对应全称',
    abbrTip:     '按字母排序，保留重复缩写的多种含义。',
    abbrCol1:    '缩写',
    abbrCol2:    '全称',
    langBtn:     'EN',
    disclaimer:  '本看板数据来源于公开共享的 Google Sheets，仅供参考，不构成任何移民建议。实际情况可能因个案而异，请以官方渠道信息为准。',
    starBtn:     '觉得有用？给个 Star ⭐',
  },
  en: {
    heroTitle:   'NON EE PR Progress Dashboard',
    asOf:        'Last updated',
    sourceNote:  'Data source: Publicly shared Google Sheets data.',
    contribute:  'Contribute Data / View All Sources',
    diagramTitle:'PR Application Flowchart',
    processTitle:'PR Process Steps',
    processTip:  'Based on sample experience from the past year. Actual process may vary by individual case.',
    returnsTitle:'Return Reasons',
    returnCount: (n) => `Total: ${n}`,
    abbrTitle:   'Abbreviation Reference',
    abbrTip:     'Sorted alphabetically, with multiple meanings for duplicate abbreviations.',
    abbrCol1:    'Abbr.',
    abbrCol2:    'Full Name',
    langBtn:     '中文',
    disclaimer:  'Data on this dashboard is sourced from publicly shared Google Sheets and is for reference only. It does not constitute immigration advice. Actual outcomes may vary by case — always refer to official sources.',
    starBtn:     'Find it useful? Give it a Star ⭐',
  },
};

let currentLang = localStorage.getItem('lang') || 'en';
let lastSummary = null;

const asLocalDate = (iso) => {
  if (!iso) return '-';
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const asLocalTime = (iso) => {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(currentLang === 'zh' ? 'zh-CN' : 'en-CA', { hour12: false });
};

const compactReturnReasonLabel = (reason) =>
  String(reason || '').replaceAll('ADR (Additional Documents Requested/Required)', 'ADR');

const renderDashboard = (summary) => {
  const t = translations[currentLang];
  const asOfNode = document.getElementById('asOf');
  const progressGrid = document.getElementById('progressGrid');
  const returnCount = document.getElementById('returnCount');
  const reasonChart = document.getElementById('reasonChart');

  asOfNode.textContent = `${t.asOf}: ${asLocalTime(summary.asOf)}`;

  progressGrid.innerHTML = '';
  stageLabels.forEach(([key, title]) => {
    const item = summary.progress[key];
    const card = document.createElement('article');
    card.className = 'card';
    const stageLabel = currentLang === 'zh' ? '阶段更新日' : 'Stage date';
    card.innerHTML = `
      <h3>${title}</h3>
      <div class="value">${item?.submissionDate ? asLocalDate(item.submissionDate) : '-'}</div>
      <div class="meta">${stageLabel}: ${item?.stageDate ? asLocalDate(item.stageDate) : '-'}</div>
    `;
    progressGrid.appendChild(card);
  });

  returnCount.textContent = t.returnCount(summary.returns.count);

  const sortedReasons = [...(summary.returns.reasons || [])].sort((a, b) => b.count - a.count);
  reasonChart.innerHTML = '';
  if (!sortedReasons.length) {
    const empty = document.createElement('div');
    empty.className = 'reason-empty';
    empty.textContent = currentLang === 'zh' ? '暂无可用原因' : 'No data available';
    reasonChart.appendChild(empty);
    return;
  }

  const maxCount = Math.max(...sortedReasons.map((row) => row.count), 1);
  sortedReasons.forEach((row) => {
    const ratio = Math.max(6, Math.round((row.count / maxCount) * 100));
    const displayReason = compactReturnReasonLabel(row.reason);
    const item = document.createElement('div');
    item.className = 'reason-row';
    item.innerHTML = `
      <div class="reason-label">${displayReason}</div>
      <div class="reason-bar-wrap">
        <div class="reason-bar" style="width:${ratio}%"></div>
        <span class="reason-value">${row.count}</span>
      </div>
    `;
    reasonChart.appendChild(item);
  });
};

const renderAbbreviations = () => {
  const tbody = document.getElementById('abbrTableBody');
  const rows = [...abbreviations].sort((a, b) => {
    const keyCmp = a[0].localeCompare(b[0], 'en', { sensitivity: 'base' });
    if (keyCmp !== 0) return keyCmp;
    return a[1].localeCompare(b[1], 'en', { sensitivity: 'base' });
  });

  tbody.innerHTML = '';
  rows.forEach(([abbr, full]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${abbr}</strong></td><td>${full}</td>`;
    tbody.appendChild(tr);
  });
};

const renderProcessSteps = () => {
  const list = document.getElementById('processList');
  list.innerHTML = '';
  processSteps[currentLang].forEach((step) => {
    const li = document.createElement('li');
    li.textContent = step;
    list.appendChild(li);
  });
};

const applyTranslations = () => {
  const t = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key in t) el.textContent = t[key];
  });
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = t.langBtn;
};

const setLang = (lang) => {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  renderProcessSteps();
  if (lastSummary) renderDashboard(lastSummary);
};

const boot = async () => {
  applyTranslations();
  renderAbbreviations();
  renderProcessSteps();

  document.getElementById('langToggle').addEventListener('click', () => {
    setLang(currentLang === 'zh' ? 'en' : 'zh');
  });

  const res = await fetch('./data/dashboard-summary.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`读取 summary 失败: ${res.status}`);
  }
  lastSummary = await res.json();
  renderDashboard(lastSummary);
};

boot().catch((error) => {
  document.body.innerHTML = `<pre>加载失败: ${error.message}</pre>`;
});
