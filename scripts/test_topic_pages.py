import os

clusters = [
    ("comparisons", 75),
    ("guides", 62),
    ("concepts", 60),
    ("news", 36),
    ("internals", 19),
    ("story", 19),
    ("orchestration", 9),
    ("use-cases", 9),
    ("memory", 5),
]

for key, expected in clusters:
    path = os.path.join('docs', 'blog', 'topics', key, 'index.html')
    if not os.path.exists(path):
        print(f"Missing topic page: {key}")
        continue
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    cards = c.count('<article class="card')
    print(f"Topic '{key}': expected {expected}, found {cards} cards. Clean footer: {'AgentHive ↗' in c}")

