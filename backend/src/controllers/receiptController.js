'use strict';

const Tesseract = require('tesseract.js');

// Basic categories and keywords for simple classification
const CATEGORIES = {
  food: ["restaurant", "cafe", "pizza", "burger", "food", "snack", "starbucks", "diner", "kfc", "mcd"],
  transportation: ["uber", "ola", "bus", "train", "taxi", "flight", "cab", "metro", "fuel", "gas", "diesel"],
  shopping: ["mall", "store", "shopping", "amazon", "flipkart", "purchase"],
  entertainment: ["movie", "cinema", "concert", "theatre", "ticket"],
  utilities: ["electricity", "water", "internet", "broadband", "phone", "mobile", "utility", "bill"],
  healthcare: ["doctor", "medicine", "hospital", "pharmacy", "medical"],
  education: ["book", "course", "school", "education", "learning"],
};

function pickCategory(text) {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'other';
}

function extractAmount(text) {
  // Try to prioritize a line that says total/grand total
  const lines = text.split(/\r?\n/);
  const totalLine = lines.find(l => /grand\s*total|total\s*amount|amount\s*due|total/i.test(l));
  const candidates = [];
  const scan = (str) => {
    const regex = /(?:rs\.?\s*|inr\s*|₹\s*|\$\s*)?(\d{1,3}(?:[\,\s]\d{2,3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/gi;
    let m;
    while ((m = regex.exec(str)) !== null) {
      const raw = m[1].replace(/[,\s]/g, '');
      const val = parseFloat(raw);
      if (!Number.isNaN(val)) candidates.push(val);
    }
  };
  if (totalLine) scan(totalLine);
  if (!candidates.length) scan(text);
  if (!candidates.length) return 0;
  // Heuristic: pick the max value as total
  return Math.max(...candidates);
}

function extractDate(text) {
  const m = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
  if (!m) return new Date().toISOString().slice(0, 10);
  const raw = m[0].replace(/\//g, '-');
  // Normalize dd-mm-yyyy to yyyy-mm-dd for consistency
  const parts = raw.split('-');
  if (parts[0].length === 4) return raw; // already yyyy-mm-dd
  const [dd, mm, yyyy] = parts;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function extractDescription(text) {
  const line = text.split(/\r?\n/).find(l => l && l.trim());
  return line ? line.trim().slice(0, 140) : 'Unknown';
}

function parseTransaction(text) {
  const amount = extractAmount(text);
  const date = extractDate(text);
  const category = pickCategory(text);
  const description = extractDescription(text);
  return {
    description,
    category,
    type: amount > 0 ? 'expense' : 'income',
    amount,
    date,
  };
}

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Perform OCR using tesseract.js directly from buffer
    const { data } = await Tesseract.recognize(req.file.buffer, 'eng');
    const rawText = data && data.text ? data.text : '';

    const transaction = parseTransaction(rawText || '');

    return res.json({ transaction, rawText });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process receipt', message: err.message });
  }
};
