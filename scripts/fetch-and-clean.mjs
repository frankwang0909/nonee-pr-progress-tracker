#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCES = [
  { key: 'nov-2025', sheetId: '1Zq7eovhjfSTZkRm6WwMkRLYSGW5LgiSDEf6WBHudvcA', gid: '342524790' },
  { key: 'oct-2025', sheetId: '10CBcIhFt3q5iQwZwvDcGntF1l2pnNfwW0ehqvPp_oMU', gid: '0' },
  { key: 'sep', sheetId: '1doyD3zSDi6D-dUsx0lkIzbYHmkFL06ay24-mKvMDjTA', gid: '327230977' },
  { key: 'aug', sheetId: '1e6NVJS8ZZQ1zB5n--C2AjsZS7jFXnp3lesM0KHQBuNM', gid: '327230977' },
  { key: 'jul', sheetId: '1Sxq-4-k34GdfRcsvJa2Ply4u9pqEpgFkmiewOur_BW8', gid: '1137435725' },
  { key: 'jun', sheetId: '18n_DsN0ui1YGqlygIUmF9VIV43ZhpsSWdaEVSTxB-vk', gid: '0' },
  { key: 'may', sheetId: '1ax_Xvp01lg3sFRkZioz5w_c5oGlVLwbNkhgmxMw7GN4', gid: '1137435725' },
  { key: 'apr', sheetId: '1m_CSwVXZLAyzw1jiDA6k0WgZH_fk2DBDy39TPcLWE30', gid: '0' },
  { key: 'mar', sheetId: '1P0sJOc11nCG3bl8jn0wY4XmhAKhmj-i5B7Yr6_tA9v8', gid: '0' },
  { key: 'feb', sheetId: '19VoIhvQo5X7SRT9MNW9DPAP7WKgrLE5cgC7giYLctCM', gid: '0' },
  { key: 'jan', sheetId: '1ioxtqGnbHi6khSQ4ErvA1SgLgJgmo2LbPxEb01YRRx8', gid: '397033753' },
  { key: 'dec-new', sheetId: '1EPQOzLb40oqopWieywnMRieBarW7nWn9IIOk1l479w0', gid: '634181719' },
  { key: 'nov', sheetId: '1vQ2OOq4aEjZYcAyGWKRBGWj7-6YKeFHP_4dsJTt-Py0', gid: '342524790' },
  { key: 'oct', sheetId: '1V2pSzVcpuWTBT89SaaJaQ0nlLq85vTcfmOh8uhlgeIc', gid: '1837103431' },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_AOR_LAG_DAYS = 180;
const MAX_FD_LAG_DAYS = 650;
const MAX_P1_LAG_DAYS = 400;
const MAX_P2_LAG_DAYS = 550;
const MAX_ECOPR_LAG_DAYS = 700;
const MAX_PRCARD_LAG_DAYS = 900;
const MIN_FRONTIER_SAMPLE_COUNT = 1;

const SHIFTED_FD_SOURCE_KEYS = new Set(['may', 'jun', 'jul', 'aug', 'sep', 'oct-2025', 'nov-2025']);
const FEB_MAR_FD_SOURCE_KEYS = new Set(['feb', 'mar']);
const JAN_FD_SOURCE_KEYS = new Set(['jan']);

const urlForSource = (source) =>
  `https://docs.google.com/spreadsheets/d/${source.sheetId}/gviz/tq?tqx=out:json&gid=${source.gid}`;

const normalizeHeader = (header, index) => {
  if (!header || typeof header !== 'string') {
    return `col_${index + 1}`;
  }

  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/_{2,}/g, '_');
};

const parseDateString = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const gvizMatch = trimmed.match(/^Date\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (gvizMatch) {
    const year = Number(gvizMatch[1]);
    const month = Number(gvizMatch[2]);
    const day = Number(gvizMatch[3]);
    const parsed = new Date(year, month, day);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  const dmyMonth = trimmed.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (dmyMonth) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  if (/^\d+$/.test(trimmed)) return null;

  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(trimmed)) {
    const parsed = new Date(trimmed.replace(/\//g, '-'));
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }

  return null;
};

const parseCell = (cell) => {
  if (!cell) return null;
  const raw = cell.v ?? cell.f;
  if (raw === null || raw === undefined) return null;

  if (typeof raw === 'string') {
    const maybeDate = parseDateString(raw);
    if (maybeDate) return maybeDate;
    return raw.trim();
  }

  if (typeof raw === 'number') {
    if (typeof cell.f === 'string') {
      const maybeDate = parseDateString(cell.f);
      if (maybeDate) return maybeDate;
    }
    return raw;
  }

  return null;
};

const extractPayload = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('GViz payload not found');
  return JSON.parse(text.slice(start, end + 1));
};

const rowToValues = (row) => (row.c ?? []).map((cell) => parseCell(cell));

const findHeaderRow = (rows) =>
  rows.findIndex((row) => {
    const lowerCells = row
      .filter((cell) => typeof cell === 'string')
      .map((cell) => cell.toLowerCase());

    if (!lowerCells.length) return false;

    const hasName = lowerCells.some((cell) => /\bname\b/.test(cell));
    const hasProvince = lowerCells.some((cell) => /\bprovince\b/.test(cell));
    const hasPnpOrStream = lowerCells.some(
      (cell) => /\bpnp\b/.test(cell) || /\bstream\b/.test(cell),
    );

    return hasName && (hasProvince || hasPnpOrStream);
  });

const looksLikeDateString = (value) =>
  Boolean(parseDateString(value)) || /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value);

const isMostlyEmpty = (row) => row.filter((cell) => cell !== null && cell !== '').length < 2;

const isDataRow = (row) => {
  const name = row.name;
  if (typeof name === 'string' && looksLikeDateString(name)) return false;
  if (typeof name === 'string' && name.toLowerCase() === 'total') return false;

  const nonEmpty = Object.values(row).filter((value) => value !== null && value !== '').length;
  return nonEmpty >= 2 && Boolean(name);
};

const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const toValidIso = (value) => {
  if (typeof value !== 'string') return null;
  if (!isIsoDate(value)) return null;
  const parsed = new Date(value);
  const year = parsed.getUTCFullYear();
  if (Number.isNaN(parsed.getTime())) return null;
  if (year < 2010 || year > 2035) return null;
  return value;
};

const parseLocalDate = (value) => {
  if (!isIsoDate(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const diffDaysFloor = (fromDate, toDate) => {
  const from = parseLocalDate(fromDate);
  const to = parseLocalDate(toDate);
  if (!from || !to) return null;
  return Math.floor((to.getTime() - from.getTime()) / DAY_MS);
};

const findSubmissionHeaderDate = (row, maxScan) => {
  const todayIso = new Date().toISOString().slice(0, 10);
  const limit = Math.max(0, Math.min(maxScan, row.length, 8));

  for (let i = 0; i < limit; i += 1) {
    const cell = row[i];
    if (typeof cell !== 'string') continue;
    const iso = toValidIso(cell);
    if (iso && iso <= todayIso) return iso;
  }

  return null;
};

const toValidDate = (value) => {
  if (typeof value !== 'string') return null;
  if (!isIsoDate(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  if (year < 2020 || year > 2035) return null;
  return parsed;
};

const toLocalDayString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeAdr = (value) => {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.length < 3) return '';

  const lower = trimmed.toLowerCase();
  const placeholders = new Set(['-', 'n/a', 'na', 'none', 'no', 'nil', '0', 'false', '无', '没有']);
  if (placeholders.has(lower)) return '';

  if (toValidDate(trimmed)) return trimmed;

  const keywords = ['adr', 'return', '补料', '补件'];
  if (keywords.some((k) => lower.includes(k))) return trimmed;

  if (/^\d+$/.test(trimmed) || trimmed.length > 80) return '';
  return trimmed;
};

const extractAdr = (record) => {
  const priorityKeys = ['adr_if_any_return_date', 'adr'];
  for (const key of priorityKeys) {
    const normalized = normalizeAdr(record[key]);
    if (normalized) return normalized;
  }

  for (const [key, value] of Object.entries(record)) {
    if (typeof value !== 'string') continue;
    if (!/adr|return/i.test(key)) continue;
    const normalized = normalizeAdr(value);
    if (normalized) return normalized;
  }

  return '';
};

const normalizeReason = (adr) => {
  if (!adr) return '';
  const raw = adr.trim();
  if (!raw) return '';
  if (toValidDate(raw)) return 'returned (date-only marker)';

  const cleaned = raw
    .replace(/\s+/g, ' ')
    .replace(/[:：]\s*/g, ': ')
    .replace(/[。.!]+$/g, '')
    .trim();

  const lower = cleaned.toLowerCase();
  if (lower === 'returned') return 'Returned (unspecified)';
  if (lower === 'return') return 'Return (unspecified)';
  return cleaned;
};

const ABBR_EXPLANATIONS = new Map([
  ['ADR', 'Additional Documents Requested/Required'],
  ['BC', 'Birth Certificate'],
  ['BIL', 'Biometrics Instruction Letter'],
  ['PCC', 'Police Clearance Certificate'],
  ['IMM5406', 'Additional Family Information form'],
  ['IMM5669', 'Schedule A - Background/Declaration'],
  ['PF', 'Procedural Fairness'],
  ['NRT', 'No Reportable Trace'],
]);

const expandAbbreviationToken = (abbr) => {
  const full = ABBR_EXPLANATIONS.get(abbr);
  if (!full) return abbr;
  return `${abbr} (${full})`;
};

const normalizeReturnReason = (adr) => {
  const cleaned = normalizeReason(adr);
  if (!cleaned) return '';
  if (cleaned === 'returned (date-only marker)') return cleaned;

  const lower = cleaned.toLowerCase();
  const hasAdr = /\badr\b/i.test(cleaned);
  const hasReturn = /\breturn(?:ed)?\b/i.test(cleaned);
  const reasons = [];

  if (/imm\s*[- ]?5406/i.test(cleaned)) {
    reasons.push(`${expandAbbreviationToken('IMM5406')} issue`);
  }
  if (/imm\s*[- ]?5669/i.test(cleaned) || /schedule\s*a/i.test(cleaned)) {
    reasons.push(`${expandAbbreviationToken('IMM5669')} / Schedule A issue`);
  }
  if (/\bpcc\b|police\s*(clearance|certificate)/i.test(lower)) {
    reasons.push(`${expandAbbreviationToken('PCC')} issue`);
  }
  if (/birth\s*cert/i.test(lower) || /\bbc\b/.test(lower)) {
    reasons.push(`${expandAbbreviationToken('BC')} issue`);
  }
  if (/name\s*mismatch/i.test(lower)) {
    reasons.push('Name mismatch');
  }
  if (/family\s+information|family\s+info|missing\s+family/i.test(lower)) {
    reasons.push('Family information missing');
  }
  if (/\bbil\b|biometric|bio.?metric/.test(lower)) {
    reasons.push(`${expandAbbreviationToken('BIL')} / biometrics fee issue`);
  }
  if (/procedural\s*fairness|\bpf\b/.test(lower)) {
    reasons.push(`${expandAbbreviationToken('PF')} concern`);
  }
  if (/nrt/.test(lower)) {
    reasons.push(`${expandAbbreviationToken('NRT')} flagged for review`);
  }

  const uniqueReasons = Array.from(new Set(reasons));
  if (uniqueReasons.length > 0) {
    if (hasAdr) return `${expandAbbreviationToken('ADR')} - ${uniqueReasons.join('; ')}`;
    if (hasReturn) return `Returned - ${uniqueReasons.join('; ')}`;
    return uniqueReasons.join('; ');
  }

  // Fallback: keep cleaned text but expand key abbreviations for readability.
  let enriched = cleaned;
  const orderedAbbr = [...ABBR_EXPLANATIONS.keys()].sort((a, b) => b.length - a.length);
  orderedAbbr.forEach((abbr) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    enriched = enriched.replace(regex, (match) => expandAbbreviationToken(match.toUpperCase()));
  });
  return enriched;
};

const getRecordSourceKey = (record) => record.__sourceKey ?? null;

const extractDateFromKeys = (record, keys) => {
  const candidates = [];
  for (const key of keys) {
    const parsed = toValidDate(record[key]);
    if (parsed) candidates.push(parsed);
  }

  if (!candidates.length) return null;
  return candidates.sort((a, b) => a.getTime() - b.getTime()).at(-1) ?? null;
};

const extractAorDate = (record) => {
  const candidates = [];

  for (const [key, value] of Object.entries(record)) {
    if (!/aor/i.test(key)) continue;
    const parsed = toValidDate(value);
    if (parsed) candidates.push(parsed);
  }

  for (const key of ['col_5', 'col_6', 'col_7']) {
    const parsed = toValidDate(record[key]);
    if (parsed) candidates.push(parsed);
  }

  if (!candidates.length) return null;
  return candidates.sort((a, b) => a.getTime() - b.getTime()).at(-1) ?? null;
};

const extractFdDate = (record) => {
  const sourceKey = getRecordSourceKey(record);
  if (sourceKey === 'dec-new') {
    return extractDateFromKeys(record, ['col_12', 'fd', 'final_decision', 'final']);
  }
  if (sourceKey && FEB_MAR_FD_SOURCE_KEYS.has(sourceKey)) {
    return extractDateFromKeys(record, ['fd', 'final_decision', 'final', 'col_17']);
  }
  if (sourceKey && JAN_FD_SOURCE_KEYS.has(sourceKey)) {
    return extractDateFromKeys(record, ['fd', 'final_decision', 'final', 'col_15']);
  }
  if (sourceKey && SHIFTED_FD_SOURCE_KEYS.has(sourceKey)) {
    return extractDateFromKeys(record, ['fd', 'final_decision', 'final']);
  }
  return extractDateFromKeys(record, ['fd', 'final_decision', 'final', 'col_14']);
};

const extractP1Date = (record) => {
  const sourceKey = getRecordSourceKey(record);
  if (sourceKey === 'jan') {
    return extractDateFromKeys(record, ['p1', 'portal1', 'portal_1', 'col_16']);
  }
  if (sourceKey && FEB_MAR_FD_SOURCE_KEYS.has(sourceKey)) {
    // Feb/Mar layout: FD, P1, P2, PPR, eCOPR, PR Card
    return extractDateFromKeys(record, ['p1', 'portal1', 'portal_1', 'col_18']);
  }
  return extractDateFromKeys(record, ['p1', 'portal1', 'portal_1']);
};

const extractP2Date = (record) => {
  const sourceKey = getRecordSourceKey(record);
  if (sourceKey === 'dec-new') {
    return extractDateFromKeys(record, ['col_14', 'p2', 'portal2', 'portal_2']);
  }
  if (sourceKey === 'jan') {
    return extractDateFromKeys(record, ['p2', 'portal2', 'portal_2', 'col_17']);
  }
  if (sourceKey && FEB_MAR_FD_SOURCE_KEYS.has(sourceKey)) {
    // Feb/Mar layout: FD, P1, P2, PPR, eCOPR, PR Card
    return extractDateFromKeys(record, ['p2', 'portal2', 'portal_2', 'col_19']);
  }
  return extractDateFromKeys(record, ['p2', 'portal2', 'portal_2']);
};

const extractEcoprDate = (record) => {
  const sourceKey = getRecordSourceKey(record);
  if (sourceKey === 'dec-new') {
    return extractDateFromKeys(record, ['col_13', 'ecopr', 'e_copr', 'copr', 'col_18']);
  }
  if (sourceKey === 'jan') {
    return extractDateFromKeys(record, ['ecopr', 'e_copr', 'copr', 'col_18']);
  }
  if (sourceKey && FEB_MAR_FD_SOURCE_KEYS.has(sourceKey)) {
    // Feb/Mar layout: FD, P1, P2, PPR, eCOPR, PR Card
    return extractDateFromKeys(record, ['ecopr', 'e_copr', 'copr', 'col_21']);
  }
  return extractDateFromKeys(record, ['ecopr', 'e_copr', 'copr']);
};

const extractPrCardDate = (record) => {
  const sourceKey = getRecordSourceKey(record);
  if (sourceKey === 'jan') {
    return extractDateFromKeys(record, [
      'pr_card',
      'prcard',
      'pr_card_date',
      'card_received',
      'pr_received',
      'col_19',
    ]);
  }
  if (sourceKey && FEB_MAR_FD_SOURCE_KEYS.has(sourceKey)) {
    // Feb/Mar layout: FD, P1, P2, PPR, eCOPR, PR Card
    return extractDateFromKeys(record, [
      'pr_card',
      'prcard',
      'pr_card_date',
      'card_received',
      'pr_received',
      'col_22',
    ]);
  }
  // For other sheets, only trust explicit PR Card-like headers.
  return extractDateFromKeys(record, [
    'pr_card',
    'prcard',
    'pr_card_date',
    'card_received',
    'pr_received',
  ]);
};

const isValidPrCardStage = (record, submission, prCardDate) => {
  if (!isStageLagWithin(submission, prCardDate, MAX_PRCARD_LAG_DAYS)) return false;
  const ecoprDate = extractEcoprDate(record);
  if (!ecoprDate) return false;
  return prCardDate.getTime() >= ecoprDate.getTime();
};

const shouldApplyAorLagFilter = (record) => getRecordSourceKey(record) !== 'apr';

const isStageLagWithin = (from, to, maxDays) => {
  const lagDays = Math.floor((to.getTime() - from.getTime()) / DAY_MS);
  return lagDays >= 0 && lagDays <= maxDays;
};

const getFrontierRecordIdentity = (record, submission) =>
  [
    record.__sourceKey ?? '',
    String(record.name ?? '').trim().toLowerCase(),
    String(record.province ?? '').trim().toLowerCase(),
    String(record.pnp_category ?? record.stream ?? '').trim().toLowerCase(),
    toLocalDayString(submission),
  ].join('|');

const buildStageFrontierByDay = (records, getStageDate, isValidStage) => {
  const map = new Map();

  for (const record of records) {
    const submission = toValidDate(record.__submissionDate) ?? toValidDate(record.__firstDate);
    const stageDate = getStageDate(record);
    if (!submission || !stageDate) continue;
    if (!isValidStage(record, submission, stageDate)) continue;

    const stageDay = toLocalDayString(stageDate);
    const submissionDay = toLocalDayString(submission);
    const identity = getFrontierRecordIdentity(record, submission);
    const existing = map.get(submissionDay);

    if (!existing) {
      map.set(submissionDay, { identities: new Set([identity]), latestStageDay: stageDay });
      continue;
    }

    existing.identities.add(identity);
    if (stageDay > existing.latestStageDay) {
      existing.latestStageDay = stageDay;
    }
  }

  return Array.from(map.entries())
    .map(([submissionDay, value]) => {
      if (value.identities.size < MIN_FRONTIER_SAMPLE_COUNT) return null;
      return {
        submissionDay,
        stageDay: value.latestStageDay,
        sampleCount: value.identities.size,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.submissionDay.localeCompare(b.submissionDay));
};

const parseSource = async (source) => {
  const url = urlForSource(source);
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Fetch failed for ${source.key} (${response.status})`);
  }

  const text = await response.text();
  const payload = extractPayload(text);
  const rows = (payload?.table?.rows ?? []).map(rowToValues);
  const headerIndex = findHeaderRow(rows);

  const headerRow = headerIndex >= 0 ? rows[headerIndex] : rows[0] ?? [];
  const headers = headerRow.map(normalizeHeader);

  let currentSubmissionDateForRecords = null;
  const records = [];

  rows.slice(Math.max(headerIndex + 1, 0)).forEach((row) => {
    const headerDate = findSubmissionHeaderDate(row, 3);
    const nonEmpty = row.filter((cell) => cell !== null && cell !== '').length;
    const looksLikeSubmissionHeader = Boolean(headerDate) && nonEmpty <= 3;

    if (looksLikeSubmissionHeader) {
      currentSubmissionDateForRecords = headerDate;
      return;
    }

    if (isMostlyEmpty(row)) return;

    const record = {};
    headers.forEach((key, idx) => {
      record[key] = row[idx] ?? null;
    });

    record.__sourceKey = source.key;
    record.__source = `https://docs.google.com/spreadsheets/d/${source.sheetId}/edit?gid=${source.gid}`;
    record.__submissionDate = currentSubmissionDateForRecords;

    const allDateCandidates = Object.values(record)
      .map((value) => (typeof value === 'string' ? toValidIso(value) : null))
      .filter(Boolean)
      .sort();

    record.__firstDate = allDateCandidates[0] ?? null;

    if (isDataRow(record)) {
      records.push(record);
    }
  });

  return {
    source,
    rowsCount: rows.length,
    headers,
    records,
    fetchedAt: new Date().toISOString(),
  };
};

const aggregateDashboard = (records) => {
  const aorFrontier = buildStageFrontierByDay(records, extractAorDate, (record, submission, stageDate) => {
    if (!shouldApplyAorLagFilter(record)) return true;
    const lag = diffDaysFloor(toLocalDayString(submission), toLocalDayString(stageDate));
    return lag !== null && lag >= MIN_AOR_LAG_DAYS;
  });

  const p1Frontier = buildStageFrontierByDay(records, extractP1Date, (_record, submission, stageDate) =>
    isStageLagWithin(submission, stageDate, MAX_P1_LAG_DAYS),
  );

  const fdFrontier = buildStageFrontierByDay(records, extractFdDate, (_record, submission, stageDate) =>
    isStageLagWithin(submission, stageDate, MAX_FD_LAG_DAYS),
  );

  const p2Frontier = buildStageFrontierByDay(records, extractP2Date, (_record, submission, stageDate) =>
    isStageLagWithin(submission, stageDate, MAX_P2_LAG_DAYS),
  );

  const ecoprFrontier = buildStageFrontierByDay(records, extractEcoprDate, (_record, submission, stageDate) =>
    isStageLagWithin(submission, stageDate, MAX_ECOPR_LAG_DAYS),
  );

  const prCardFrontier = buildStageFrontierByDay(records, extractPrCardDate, (record, submission, stageDate) =>
    isValidPrCardStage(record, submission, stageDate),
  );

  const returnedRecords = records.filter((record) => {
    const adr = extractAdr(record);
    if (!adr) return false;
    return /(return|returned|补料|补件|adr)/i.test(adr);
  });

  const reasonCounter = new Map();
  returnedRecords.forEach((record) => {
    const reason = normalizeReturnReason(extractAdr(record));
    if (!reason) return;
    reasonCounter.set(reason, (reasonCounter.get(reason) ?? 0) + 1);
  });

  const returnReasons = Array.from(reasonCounter.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const getLatest = (frontier) => {
    if (!frontier.length) return null;
    const latest = frontier[frontier.length - 1];
    return {
      submissionDate: latest.submissionDay,
      stageDate: latest.stageDay,
      sampleCount: latest.sampleCount,
    };
  };

  return {
    asOf: new Date().toISOString(),
    totalRecords: records.length,
    progress: {
      aor: getLatest(aorFrontier),
      fd: getLatest(fdFrontier),
      p1: getLatest(p1Frontier),
      p2: getLatest(p2Frontier),
      ecopr: getLatest(ecoprFrontier),
      prCard: getLatest(prCardFrontier),
    },
    returns: {
      count: returnedRecords.length,
      reasons: returnReasons,
    },
  };
};

const main = async () => {
  await mkdir(join(process.cwd(), 'data/raw'), { recursive: true });
  await mkdir(join(process.cwd(), 'data/clean'), { recursive: true });

  const sourceResults = [];

  for (const source of SOURCES) {
    const result = await parseSource(source);
    sourceResults.push(result);

    await writeFile(
      join(process.cwd(), 'data/raw', `${source.key}.json`),
      JSON.stringify(result, null, 2),
      'utf8',
    );

    process.stdout.write(`Fetched ${source.key}: ${result.records.length} records\n`);
  }

  const allRecords = sourceResults.flatMap((item) => item.records);
  const dashboardSummary = aggregateDashboard(allRecords);

  await writeFile(join(process.cwd(), 'data/clean', 'records.json'), JSON.stringify(allRecords, null, 2), 'utf8');
  await writeFile(
    join(process.cwd(), 'data/dashboard-summary.json'),
    JSON.stringify(dashboardSummary, null, 2),
    'utf8',
  );

  process.stdout.write(`Done. totalRecords=${allRecords.length}\n`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
