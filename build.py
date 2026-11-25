import json, os, pathlib, re, shutil, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8')
s = pathlib.Path('src')
html = (s/'index.html').read_text(encoding='utf-8')
crib = 'const CRIB_MD = ' + json.dumps({f'mt{n}': pathlib.Path(f'MT{n}-Crib-Sheet.md').read_text(encoding='utf-8') for n in range(1, 5)}, ensure_ascii=False) + ';'
js = '\n'.join([crib] + [(s/f).read_text(encoding='utf-8') for f in ['graph.js','questions.js','grader.js','course-code.js','links.js','diagrams.js','course-mt1.js','course-mt2.js','course-mt3.js','course-after.js','course-final.js','course-learn.js','course-learn2.js','deep.js','course-w1-6.js','course-w7-11.js','course-w7-11-prof.js','course-mt4-prof.js','lecture.js','course.js','course-ps.js','crib-md.js','course-crib.js','learn-chapters.js','learn-mt4-units.js','learn-mt4-gen.js','course-learn-mt4.js','app.js']])
html = html.replace('/*__CSS__*/', (s/'styles.css').read_text(encoding='utf-8')).replace('/*__JS__*/', js.replace('</script>', '<\\/script>'))
pathlib.Path('dist').mkdir(exist_ok=True)
(pathlib.Path('dist')/'index.html').write_text(html, encoding='utf-8')
print('ok', len(html))

# ---- printable 2-page crib sheets: build/print/mtN.html (+ dist/pdf/MTN-Crib-Sheet.pdf with --pdf) ----
EXAMS = {1: ('Wed 09/09', 'Topics 1–4, 7', '#2563eb', '#1e3a8a'), 2: ('Wed 10/07', 'Topics 5, 6, 8, 9, 11', '#e11d48', '#881337'),
         3: ('Wed 10/28', 'Topics 10, 12', '#16a34a', '#14532d'), 4: ('Wed 11/25', 'Topics 13, 14, 16–19', '#7c3aed', '#4c1d95')}
tpl, md_js, pr_js = (s/'crib-print.html').read_text(encoding='utf-8'), (s/'crib-md.js').read_text(encoding='utf-8'), (s/'crib-print.js').read_text(encoding='utf-8')
out = pathlib.Path('build/print'); out.mkdir(parents=True, exist_ok=True)
for n, (date, covers, color, dark) in EXAMS.items():
    data = {'name': f'Midterm {n}', 'date': date, 'covers': f'Midterm {n} · {date} · {covers}', 'color': color, 'dark': dark,
            'md': pathlib.Path(f'MT{n}-Crib-Print.md').read_text(encoding='utf-8')}
    page = tpl.replace('/*__JS__*/', '\n'.join([md_js, 'const CRIB_PRINT = ' + json.dumps(data, ensure_ascii=False) + ';', pr_js]).replace('</script>', '<\\/script>'))
    (out/f'mt{n}.html').write_text(page, encoding='utf-8')

if '--pdf' in sys.argv:
    chrome = os.environ.get('CHROME') or next((p for p in [r'C:\Program Files\Google\Chrome\Application\chrome.exe', r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
              '/usr/bin/google-chrome', '/usr/bin/chromium'] if os.path.exists(p)), None) or shutil.which('chrome')
    assert chrome, 'set CHROME to a Chrome/Edge executable'
    pdfdir = pathlib.Path('dist/pdf'); pdfdir.mkdir(parents=True, exist_ok=True)
    base = ['--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=4000']
    bad = 0
    for n in EXAMS:
        url = (out/f'mt{n}.html').resolve().as_uri()
        dom = subprocess.run([chrome, *base, '--dump-dom', url], capture_output=True, text=True, encoding='utf-8').stdout
        m = re.search(r'data-fit="([^"]*)"', dom)
        rep = json.loads(m.group(1).replace('&quot;', '"').replace('&amp;', '&')) if m else {'ok': False, 'problems': ['no report']}
        pdf = pdfdir/f'MT{n}-Crib-Sheet.pdf'
        subprocess.run([chrome, *base, '--no-pdf-header-footer', f'--print-to-pdf={pdf.resolve()}', url], capture_output=True)
        pages = len(re.findall(rb'/Type\s*/Page[^s]', pdf.read_bytes())) if pdf.exists() else 0
        ok = rep['ok'] and pages == 2
        bad += not ok
        print(f'MT{n}: {"OK " if ok else "FAIL"} pages={pages} font={rep.get("pt")}pt cards={rep.get("cards")} columns={rep.get("columnsUsed")}/8', *rep.get('problems', []), sep='\n  ')
    sys.exit(1 if bad else 0)
