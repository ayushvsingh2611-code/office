with open('docs/blog/feed.xml', 'r', encoding='utf-8') as f:
    c = f.read()

print('feed.xml length:', len(c))
print('feed.xml starts with <?xml:', c.startswith('<?xml'))
print('Contains AgentHive Blog:', 'AgentHive Blog' in c)
print('Contains Ayush Singh:', 'Ayush Singh' in c)
print('Contains /blog/feed.xml:', '/blog/feed.xml' in c)
print('Contains munderdiffl or agenthive.local:', 'munderdiffl' in c.lower() or 'agenthive.local' in c.lower())
print('Total <entry> tags:', c.count('<entry>'))
