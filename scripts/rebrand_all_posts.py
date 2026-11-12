import json
import re

with open('scratch_all_294_posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

print(f"Rebranding {len(posts)} posts in catalog...")

def clean_text(text):
    if not text:
        return ""
    # Product name replacements
    t = text.replace('Munder Difflin', 'AgentHive')
    t = t.replace('munder difflin', 'AgentHive')
    t = t.replace('munderdiffl.in', 'agenthive')
    t = t.replace('MUNDER DIFFLIN', 'AGENTHIVE')
    t = t.replace('Munder Difflin&#39;s', "AgentHive's")
    t = t.replace("Munder Difflin's", "AgentHive's")
    return t

for p in posts:
    p['title'] = clean_text(p['title'])
    p['description'] = clean_text(p.get('description', ''))

with open('scratch_all_294_posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, indent=2)

print("Saved rebranded posts to scratch_all_294_posts.json successfully!")
