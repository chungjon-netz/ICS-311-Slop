// ======================= CRIB SHEET MARKDOWN RENDERER =======================
// Shared by the crib-sheet pages (course-crib.js) and the printable PDF pages
// (crib-print.js). Self-contained: no dependency on the rest of the site.
const cribEsc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

// ---- inline math: wrap equations that appear mid-sentence in <span class="m"> ----
const CRIB_OPS = new Set(['=', '≤', '≥', '<', '>', '≠', '≈', '∈', '∉', '⊆', '⊂', '+', '−', '×', '·', '/', '⇒', '⇔', '≡', 'mod', '∧', '∨', '±', '→', '←']);
const CRIB_REL = new Set(['=', '≤', '≥', '<', '>', '≠', '≈', '∈', '∉', '⊆', '⊂', '≡']);
const CRIB_MATHCH = /[ΘΩΣΠ√∞⌊⌋⌈⌉αβγδεφψπλμρστωθ²³⁴⁵⁶⁷⁸⁹⁰¹ⁿᵏʰⁱʲᵐᵖʳˣᵇᵈᵀᵉ₀₁₂₃₄₅₆₇₈₉₌ᵢⱼₖₗₘₙₚₛₜₓₕ^_′≤≥≠≈∈∉⇒⇔·×−=<>⟨⟩]/;
const CRIB_VAR = /^(\d+(\.\d+)?|[A-Za-z]|lg|ln|log|max|min|mod|cn|dn|bn|mn|nk|nW|nT|kn|…|⋯)$/;
const CRIB_FN = /^(lg|ln|log|max|min|mod)$/;
const CRIB_NOT = /^(\d+(e|st|nd|rd|th|s)|\([A-Za-z0-9&;]+\)|\d+\([a-z](,\s?[a-z])*\)|[A-Z]{2,}\d*[A-Z]?|\d{1,2}\/\d{1,2}(\/\d{2,4})?)$/;   // 4e, 2nd, (a), (PS2), 1(b, c), PS9, MT4, 09/09
function cribIsStrong(t){
  if (CRIB_NOT.test(t) || /[A-Z]{4,}/.test(t)) return false;   // procedure names like QUICKSORT′, PS9
  if (CRIB_MATHCH.test(t)) return true;
  const w = t.replace(/lg|ln|log|max|min|mod|Pr|exp/g, '');
  return !/[A-Za-z]{3,}/.test(w) && /[()[\]\/^_{}|!]/.test(t) && /[A-Za-z0-9]/.test(t);
}
function cribTokens(s){
  // split on spaces, but keep attached bracket groups like Θ(n lg n) or A[1..n] together
  const out = []; let cur = '', depth = 0;
  for (let i = 0; i < s.length; i++){
    const c = s[i];
    if (c === '⟨' || ('([{⌊⌈'.includes(c) && (depth || (i && !/\s/.test(s[i - 1]))))) depth++;
    else if (')]}⟩⌋⌉'.includes(c) && depth) depth--;
    if (/\s/.test(c) && !depth){ if (cur) out.push(cur); out.push(c); cur = ''; }
    else cur += c;
  }
  if (cur) out.push(cur);
  return out;
}
function cribSplitTok(raw){
  let t = raw.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"'), pre = '', post = '';
  const cnt = (s, ch) => s.split(ch).length - 1;
  for (;;){
    if (/^(\*\*|[*"“'‘])/.test(t)){ const m = t.match(/^(\*\*|.)/u)[0]; pre += m; t = t.slice(m.length); continue; }
    if (/^[([{]/.test(t) && cnt(t, t[0]) > cnt(t, {'(': ')', '[': ']', '{': '}'}[t[0]])){ pre += t[0]; t = t.slice(1); continue; }
    break;
  }
  for (;;){
    if (/(\*\*|[*.,;:?"”'’])$/.test(t) && !/\.\.$/.test(t) && !/lg\*$/.test(t)){ const m = t.match(/(\*\*|.)$/u)[0]; post = m + post; t = t.slice(0, -m.length); continue; }
    const l = t.slice(-1);
    if (/[)\]}]/.test(l) && cnt(t, l) > cnt(t, {')': '(', ']': '[', '}': '{'}[l])){ post = l + post; t = t.slice(0, -1); continue; }
    break;
  }
  const e = x => cribEsc(x);
  return {pre: e(pre), core: t, html: e(t), post: e(post)};
}
function cribMath(s){
  // s is already HTML-escaped text (code spans are \u0000n\u0000 placeholders)
  const parts = cribTokens(s), toks = [];
  parts.forEach(p => toks.push(/^\s$/.test(p) ? {sp: p} : Object.assign(cribSplitTok(p), {raw: p})));
  const W = toks.filter(t => !t.sp);
  W.forEach(t => {
    const c = t.core;
    t.cls = !c || /\u0000/.test(c) ? 'W' : CRIB_OPS.has(c) ? 'OP' : (cribIsStrong(c) || CRIB_VAR.test(c)) ? 'D' : 'W';
    t.strong = t.cls === 'D' && cribIsStrong(c);
  });
  let out = '', i = 0;
  const emit = t => t.pre + t.html + t.post;
  while (i < W.length){
    // try to grow an expression: [relation] operand (OP operand)*
    let j = i, hasOp = false, hasStrong = false, fn = false, end = -1;
    const operand = () => {
      let k = j;
      while (k < W.length && W[k].cls === 'D' && (k === j || !W[k].pre) && (k === j || !W[k - 1].post)){ hasStrong = hasStrong || W[k].strong; fn = fn || CRIB_FN.test(W[k].core); k++; }
      if (k === j) return false;
      j = k; end = k; return true;
    };
    if (W[j].cls === 'OP' && CRIB_REL.has(W[j].core) && !W[j].post){ j++; hasOp = true; }
    if (j < W.length && (j === i || !W[j].pre) && operand()){
      while (j < W.length && W[j].cls === 'OP' && !W[j].pre && !W[j - 1].post && !W[j].post){
        const save = j, sOp = hasOp; j++;
        if (!(j < W.length && !W[j].pre && operand())){ j = save; hasOp = sOp; break; }
        hasOp = true;
      }
    }
    const len = end - i;
    if (end > i && (hasOp || hasStrong || (fn && len >= 2))){
      const run = W.slice(i, end);
      let inner = run.map((t, k) => (k ? t.pre : '') + t.html + (k < run.length - 1 ? t.post : '')).join(' ');
      out += (out ? ' ' : '') + run[0].pre + `<span class="m">${inner}</span>` + run[run.length - 1].post;
      i = end;
    } else { out += (out ? ' ' : '') + emit(W[i]); i++; }
  }
  return out;
}
// x_(k+2) → x<sub>k+2</sub>, n^(log_b a) → n<sup>log<sub>b</sub> a</sup>
const cribUnwrap = x => /^[({]/.test(x) ? x.slice(1, -1) : x;
const cribScripts = s => s
  .replace(/(\b(?:[A-Za-z]|log|lg)|[α-ω])_(\(([^()]|\([^()]*\))*\)|\{[^{}]*\}|[A-Za-z0-9α-ω]+)/g, (m, b, x) => `${b}<sub>${cribUnwrap(x)}</sub>`)
  .replace(/\^(\(([^()]|\([^()]*\))*\)|\{[^{}]*\}|[A-Za-z0-9]+(?:\.\d+)?|[½εφ])/g, (m, x) => `<sup>${cribUnwrap(x)}</sup>`);

function cribInline(s){
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = cribScripts(cribMath(cribEsc(s)));
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^\w*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, '$1<i>$2</i>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${cribEsc(codes[i])}</code>`);
}
function cribList(lines){
  // lines: [{ind, ord, text}] → nested <ul>/<ol>
  let i = 0;
  const level = ind => {
    const ord = lines[i].ord; let out = '';
    while (i < lines.length && lines[i].ind >= ind){
      if (lines[i].ind > ind){ out = out.replace(/<\/li>$/, '') + level(lines[i].ind) + '</li>'; continue; }
      out += `<li>${cribInline(lines[i].text)}</li>`; i++;
    }
    return ord ? `<ol>${out}</ol>` : `<ul>${out}</ul>`;
  };
  return level(lines[0].ind);
}
// Markdown → array of blocks: HTML strings, or {h: level, html} for headings
function cribBlocks(md, blank = ''){
  const L = md.replace(/\r/g, '').split('\n'), out = [];
  const row = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const cell = c => c ? cribInline(c) : blank;
  for (let i = 0; i < L.length;){
    const l = L[i];
    if (!l.trim()){ i++; continue; }
    if (/^```/.test(l)){ const buf = []; i++; while (i < L.length && !/^```/.test(L[i])) buf.push(L[i++]); i++; out.push(`<pre><code>${cribEsc(buf.join('\n'))}</code></pre>`); continue; }
    const m = l.match(/^(#{1,3})\s+(.*)/);
    if (m){ out.push({h: m[1].length, html: cribInline(m[2])}); i++; continue; }
    if (/^---+\s*$/.test(l)){ i++; continue; }
    if (/^>/.test(l)){ const buf = []; while (i < L.length && /^>/.test(L[i])) buf.push(L[i++].replace(/^>\s?/, '')); out.push(`<div class="callout cyan">${cribInline(buf.join(' '))}</div>`); continue; }
    if (/^\|/.test(l) && L[i + 1] && /^\|[\s:|-]+\|?\s*$/.test(L[i + 1])){
      const head = row(l); i += 2; const body = [];
      while (i < L.length && /^\|/.test(L[i])) body.push(row(L[i++]));
      out.push(`<div class="crib-tw"><table class="tbl"><tr>${head.map(c => `<th>${cell(c)}</th>`).join('')}</tr>${body.map(r => `<tr>${r.map(c => `<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)){
      const items = [];
      while (i < L.length && L[i].trim() && !/^(```|#{1,3}\s|>|\|)/.test(L[i])){
        const lm = L[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
        if (lm) items.push({ind: lm[1].length, ord: /\d/.test(lm[2]), text: lm[3]});
        else if (items.length) items[items.length - 1].text += ' ' + L[i].trim();
        i++;
      }
      out.push(cribList(items)); continue;
    }
    const buf = [];
    while (i < L.length && L[i].trim() && !/^(#{1,3}\s|```|>|\||\s*([-*]|\d+\.)\s)/.test(L[i])) buf.push(L[i++].trim());
    out.push(`<p>${cribInline(buf.join(' '))}</p>`);
  }
  return out;
}
