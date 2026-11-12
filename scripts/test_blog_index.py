with open('docs/blog/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

print('Check feed link:', '/blog/feed.xml' in c)
print('Check Munder Difflin in index.html:', 'Munder Difflin' in c)
print('Check agenthive.local in index.html:', 'agenthive.local' in c)
print('Check footer link AgentHive ↗:', 'AgentHive ↗' in c)
print('Check Ayush Singh in footer:', 'Ayush Singh' in c)

chips = [
    'All<span class="ct">294</span>',
    'comparisons<span class="ct">75</span>',
    'guides<span class="ct">62</span>',
    'concepts<span class="ct">60</span>',
    'news<span class="ct">36</span>',
    'internals<span class="ct">19</span>',
    'story<span class="ct">19</span>',
    'orchestration<span class="ct">9</span>',
    'use-cases<span class="ct">9</span>',
    'memory<span class="ct">5</span>'
]

print('\n=== Verifying All 10 Topic Cluster Chips ===')
for chip in chips:
    print(f'  {chip}: {chip in c}')

# Check card count
articles = c.count('<article class="card')
print(f'\nTotal article cards in docs/blog/index.html: {articles}')

# Check footer text
footer_idx = c.find('<footer class="site-foot">')
if footer_idx != -1:
    print('\n=== Footer HTML Preview ===')
    print(c[footer_idx:footer_idx+700])
