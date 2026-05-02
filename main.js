/**
 * main.js – Pixolai
 * Tool logic for all built-in tools.
 * Each tool section is self-contained — easy to add more.
 */

/* ══════════════════════════════════════════
   UTILITY HELPERS
══════════════════════════════════════════ */

/** Copy text to clipboard and show feedback */
function copyToClipboard(text, msgEl) {
  if (!text.trim()) return;
  navigator.clipboard.writeText(text).then(() => {
    if (msgEl) { msgEl.textContent = '✓ Copied to clipboard!'; setTimeout(() => { msgEl.textContent = ''; }, 2200); }
  }).catch(() => {
    if (msgEl) { msgEl.textContent = 'Could not copy — please copy manually.'; msgEl.classList.add('error'); }
  });
}

/** Set message on tool msg element */
function setMsg(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('error', isError);
  if (!isError && text) setTimeout(() => { el.textContent = ''; }, 2500);
}

/* ══════════════════════════════════════════
   JSON FORMATTER TOOL
   File: /tools/json-formatter.html
══════════════════════════════════════════ */
function initJsonFormatter() {
  const input  = document.getElementById('json-input');
  const output = document.getElementById('json-output');
  const msg    = document.getElementById('json-msg');
  if (!input || !output) return;

  function format(indent) {
    try {
      const parsed = JSON.parse(input.value);
      output.textContent = JSON.stringify(parsed, null, indent);
      setMsg(msg, '✓ Formatted successfully');
    } catch (e) {
      output.textContent = '';
      setMsg(msg, '✗ Invalid JSON: ' + e.message, true);
    }
  }

  document.getElementById('btn-format')?.addEventListener('click', () => format(2));
  document.getElementById('btn-minify')?.addEventListener('click', () => format(0));
  document.getElementById('btn-copy-json')?.addEventListener('click', () => copyToClipboard(output.textContent, msg));
  document.getElementById('btn-clear-json')?.addEventListener('click', () => {
    input.value = ''; output.textContent = ''; msg.textContent = '';
  });

  /* Sample JSON */
  document.getElementById('btn-sample')?.addEventListener('click', () => {
    input.value = JSON.stringify({
      name: "Pixolai",
      version: "1.0.0",
      tools: ["JSON Formatter", "Base64 Encoder", "Timestamp Converter"],
      active: true,
      meta: { author: "You", year: 2025 }
    });
    format(2);
  });

  /* Live format on paste */
  input.addEventListener('paste', () => {
    setTimeout(() => { if (input.value.trim()) format(2); }, 60);
  });
}

/* ══════════════════════════════════════════
   BASE64 ENCODER/DECODER TOOL
   File: /tools/base64-encoder.html
══════════════════════════════════════════ */
function initBase64() {
  const input  = document.getElementById('b64-input');
  const output = document.getElementById('b64-output');
  const msg    = document.getElementById('b64-msg');
  if (!input || !output) return;

  document.getElementById('btn-encode')?.addEventListener('click', () => {
    try {
      output.textContent = btoa(unescape(encodeURIComponent(input.value)));
      setMsg(msg, '✓ Encoded');
    } catch (e) { setMsg(msg, '✗ Encoding failed: ' + e.message, true); }
  });

  document.getElementById('btn-decode')?.addEventListener('click', () => {
    try {
      output.textContent = decodeURIComponent(escape(atob(input.value.trim())));
      setMsg(msg, '✓ Decoded');
    } catch (e) { setMsg(msg, '✗ Invalid Base64 string', true); }
  });

  document.getElementById('btn-copy-b64')?.addEventListener('click', () => copyToClipboard(output.textContent, msg));
  document.getElementById('btn-clear-b64')?.addEventListener('click', () => {
    input.value = ''; output.textContent = ''; msg.textContent = '';
  });
  document.getElementById('btn-swap-b64')?.addEventListener('click', () => {
    const tmp = input.value;
    input.value = output.textContent;
    output.textContent = tmp;
    msg.textContent = '';
  });
}

/* ══════════════════════════════════════════
   TIMESTAMP CONVERTER TOOL
   File: /tools/timestamp-converter.html
══════════════════════════════════════════ */
function initTimestamp() {
  const tsInput  = document.getElementById('ts-input');
  const tsOutput = document.getElementById('ts-output');
  const msg      = document.getElementById('ts-msg');
  if (!tsInput || !tsOutput) return;

  function renderResults(d) {
    if (isNaN(d.getTime())) { setMsg(msg, '✗ Invalid date or timestamp', true); tsOutput.textContent = ''; return; }
    const pad = n => String(n).padStart(2, '0');
    const iso = d.toISOString();
    const local = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    tsOutput.textContent = [
      `Unix (seconds)   : ${Math.floor(d.getTime()/1000)}`,
      `Unix (ms)        : ${d.getTime()}`,
      `ISO 8601 (UTC)   : ${iso}`,
      `Local datetime   : ${local}`,
      `UTC datetime     : ${d.toUTCString()}`,
      `Relative         : ${timeAgo(d)}`,
      `Day of week      : ${d.toLocaleDateString('en-US',{weekday:'long'})}`,
      `Week number      : ${getWeekNumber(d)}`,
    ].join('\n');
    setMsg(msg, '✓ Converted');
  }

  function timeAgo(d) {
    const diff = Date.now() - d.getTime();
    const abs = Math.abs(diff);
    const future = diff < 0;
    const units = [[31536e6,'year'],[2592e6,'month'],[86400e3,'day'],[3600e3,'hour'],[60e3,'minute'],[1e3,'second']];
    for (const [ms, unit] of units) {
      const n = Math.floor(abs/ms);
      if (n >= 1) return `${n} ${unit}${n>1?'s':''} ${future?'from now':'ago'}`;
    }
    return 'just now';
  }

  function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  document.getElementById('btn-convert-ts')?.addEventListener('click', () => {
    const val = tsInput.value.trim();
    if (!val) { setMsg(msg, 'Please enter a timestamp or date string.', true); return; }
    const num = Number(val);
    let d;
    if (!isNaN(num)) {
      d = new Date(num > 1e10 ? num : num * 1000); // handle seconds or ms
    } else {
      d = new Date(val);
    }
    renderResults(d);
  });

  document.getElementById('btn-now')?.addEventListener('click', () => {
    tsInput.value = Date.now();
    renderResults(new Date());
  });

  document.getElementById('btn-copy-ts')?.addEventListener('click', () => copyToClipboard(tsOutput.textContent, msg));
  document.getElementById('btn-clear-ts')?.addEventListener('click', () => {
    tsInput.value = ''; tsOutput.textContent = ''; msg.textContent = '';
  });
}

/* ══════════════════════════════════════════
   CONTACT FORM (UI only — no backend)
══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = '✓ Message sent!';
    btn.disabled = true;
    btn.style.background = 'var(--accent)';
    setTimeout(() => { form.reset(); btn.textContent = 'Send Message'; btn.disabled = false; btn.style.background = ''; }, 3500);
  });
}

/* ══════════════════════════════════════════
   INIT — auto-detect which tool is loaded
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initJsonFormatter();
  initBase64();
  initTimestamp();
  initContactForm();
});

/**
 * HOW TO ADD A NEW TOOL:
 * 1. Create /tools/my-tool.html (copy an existing tool file and rename IDs)
 * 2. Write an initMyTool() function here following the same pattern
 * 3. Call initMyTool() in the DOMContentLoaded block above
 * 4. Link to your new tool from index.html and the tools index
 */
