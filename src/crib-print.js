// ======================= PRINTABLE 2-PAGE CRIB SHEET =======================
// CRIB_PRINT = {name, date, covers, color, md} is injected by build.py.
// Lays out small cards into 2 landscape pages × 4 columns. Cards never split:
// each is placed whole into a column, and the largest font size that fits all
// cards on exactly 2 pages is chosen. The result is reported on <html data-fit>
// so build.py can verify it before printing to PDF.
(function(){
  const P = CRIB_PRINT, PAGES = 2, COLS = 4, root = document.getElementById('root');
  const st = document.documentElement.style;
  st.setProperty('--acc', P.color); st.setProperty('--acc2', P.dark); st.setProperty('--accl', P.color + '99'); st.setProperty('--accbg', P.color + '14');
  // ---- markdown → cards: "## Section" labels the next card, "### Title" starts a card ----
  let title = '', intro = '', sec = null, card = null; const cards = [];
  cribBlocks(P.md, '—').forEach(b => {
    if (typeof b !== 'string'){
      if (b.h === 1) title = b.html;
      else if (b.h === 2){ sec = b.html; card = null; }
      else { cards.push(card = {sec, title: b.html, body: ''}); sec = null; }
      return;
    }
    if (!card && !sec && !cards.length){ intro += b.replace(/^<div class="callout cyan">|<\/div>$/g, ''); return; }
    if (!card){ cards.push(card = {sec, title: '', body: ''}); sec = null; }
    card.body += b;
  });
  const cardHTML = c => `<div class="pc">${c.sec ? `<div class="ps">${c.sec}</div>` : ''}${c.title ? `<div class="pt">${c.title}</div>` : ''}${c.body}</div>`;
  const sheet = n => `<div class="sheet"><div class="hd"><h1>${title}</h1><span class="sub">${n === 1 ? intro : P.covers}</span><span class="pg">page ${n} / ${PAGES}</span></div><div class="cols">${'<div class="col"></div>'.repeat(COLS)}</div></div>`;
  function attempt(pt){
    root.style.fontSize = pt + 'pt';
    root.innerHTML = Array.from({length: PAGES}, (_, i) => sheet(i + 1)).join('');
    const cols = [...root.querySelectorAll('.col')], tmp = document.createElement('div');
    let c = 0;
    // content bottom of the column vs its height, with a 1.5% safety margin for print rounding
    const over = col => col.lastElementChild.getBoundingClientRect().bottom - col.getBoundingClientRect().top > col.clientHeight * 0.985;
    for (const cd of cards){
      tmp.innerHTML = cardHTML(cd); const el = tmp.firstChild;
      cols[c].appendChild(el);
      while (over(cols[c])){
        cols[c].removeChild(el);
        if (++c >= cols.length){ lastFail = `${pt}pt: "${el.textContent.slice(0, 30)}" h=${el.offsetHeight} col=${cols[0].clientHeight}`; return null; }   // ran out of columns on page 2
        cols[c].appendChild(el);
      }
    }
    // anything wider than its column (code lines, tables) means this font size is too big
    const wide = [...root.querySelectorAll('pre,table,.pc')].find(e => e.scrollWidth > e.clientWidth + 1);
    if (wide){ lastFail = `${pt}pt: too wide "${wide.textContent.slice(0, 30)}"`; return null; }
    return {cols, used: c + 1};
  }
  let fit = null, pt, lastFail = '';
  for (pt = 10; pt >= 5.6; pt = Math.round((pt - 0.1) * 10) / 10){ fit = attempt(pt); if (fit) break; }
  // ---- verification report ----
  const rep = {ok: !!fit, pt, cards: cards.length, columnsUsed: fit ? fit.used : 0, problems: fit ? [] : ['does not fit on 2 pages; last attempt ' + lastFail]};
  if (fit){
    root.querySelectorAll('pre,table').forEach(el => { if (el.scrollWidth > el.clientWidth + 1) rep.problems.push('clipped: ' + el.textContent.slice(0, 40)); });
    root.querySelectorAll('.pc').forEach((el, i) => { if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) rep.problems.push('card ' + i + ' overflows: ' + el.textContent.slice(0, 40)); });
    root.querySelectorAll('.sheet').forEach((s, i) => { if (s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1) rep.problems.push('page ' + (i + 1) + ' overflows'); });
    if (fit.used <= COLS) rep.problems.push('page 2 is empty');
    const clone = root.cloneNode(true); clone.querySelectorAll('code,pre').forEach(e => e.remove());
    const text = clone.textContent;
    [[/\*\*/, '**'], [/`/, 'backtick'], [/\$[A-Za-z\\{]/, 'raw LaTeX $'], [/[A-Za-z0-9)]_[A-Za-z0-9({]/, 'raw _ subscript'], [/\^[A-Za-z0-9(]/, 'raw ^ superscript'], [/\|/, 'pipe'], [/undefined|NaN|\[object/, 'JS artifact'], [/^#|\n#/, 'heading marker'], [/\uFFFD/, 'replacement char']]
      .forEach(([re, what]) => { const m = text.match(re); if (m) rep.problems.push(what + ' near "' + text.slice(Math.max(0, m.index - 25), m.index + 25) + '"'); });
    root.querySelectorAll('.pc').forEach((el, i) => { if (!el.textContent.trim()) rep.problems.push('empty card ' + i); });
    root.querySelectorAll('td,th').forEach(el => { if (!el.textContent.trim()) rep.problems.push('empty table cell'); });
  }
  rep.ok = rep.ok && !rep.problems.length;
  document.documentElement.dataset.fit = JSON.stringify(rep);
})();
