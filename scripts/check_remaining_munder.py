import os

found = []
for root, _, files in os.walk('docs'):
    for f in files:
        if f.endswith(('.html', '.xml')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
                if 'munder difflin' in c.lower() or 'munderdiffl.in' in c.lower():
                    found.append(p)

print(f"Total files with Munder Difflin or munderdiffl.in: {len(found)}")
for p in found[:15]:
    print("  ", p)

