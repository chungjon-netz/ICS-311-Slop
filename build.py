import pathlib
s = pathlib.Path('src')
html = (s/'index.html').read_text()
js = '\n'.join((s/f).read_text() for f in ['graph.js','questions.js','grader.js','diagrams.js','app.js'])
html = html.replace('/*__CSS__*/', (s/'styles.css').read_text()).replace('/*__JS__*/', js.replace('</script>', '<\\/script>'))
pathlib.Path('dist').mkdir(exist_ok=True)
(pathlib.Path('dist')/'index.html').write_text(html)
print('ok', len(html))
