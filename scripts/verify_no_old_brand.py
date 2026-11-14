import os

terms = ['munderdiffl.in', 'Munder Difflin', 'agenthive.local']
found = {t: [] for t in terms}

for root, _, files in os.walk('docs'):
    for f in files:
        if f.endswith(('.html', '.xml')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                for t in terms:
                    if t.lower() in c.lower():
                        found[t].append(p)

for t, flist in found.items():
    print(f'Term "{t}": {len(flist)} occurrences')
    for p in flist[:5]:
        print('  ', p)

