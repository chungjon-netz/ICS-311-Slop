import pathlib
s = pathlib.Path('src')
html = (s/'index.html').read_text()
js = '\n'.join((s/f).read_text() for f in ['graph.js','questions.js','grader.js','course-code.js','links.js','diagrams.js','course-mt1.js','course-mt2.js','course-mt3.js','course-after.js','course-final.js','course-learn.js','course-learn2.js','course.js','app.js'])
html = html.replace('/*__CSS__*/', (s/'styles.css').read_text()).replace('/*__JS__*/', js.replace('</script>', '<\\/script>'))
pathlib.Path('dist').mkdir(exist_ok=True)
(pathlib.Path('dist')/'index.html').write_text(html)
print('ok', len(html))
