import os
import re

print("Starting comprehensive AgentHive brand replacement...")

# Replacements map
replacements = [
    # Domains and URLs
    ('https://agenthive.local/blog/feed.xml', '/blog/feed.xml'),
    ('https://agenthive.local/blog/', '/blog/'),
    ('https://agenthive.local/blog', '/blog/'),
    ('https://agenthive.local/logo.png', '/logo.png'),
    ('https://agenthive.local/media/og.png', '/media/og.png'),
    ('https://agenthive.local/#install', '/download.html'),
    ('https://agenthive.local/download.html', '/download.html'),
    ('https://agenthive.local/wall.html', '/wall.html'),
    ('https://agenthive.local/privacy.html', '/privacy.html'),
    ('https://agenthive.local/terms.html', '/terms.html'),
    ('https://agenthive.local/', '/'),
    ('https://agenthive.local', '/'),
    ('https://munderdiffl.in/media/og.png', '/media/og.png'),
    ('https://munderdiffl.in/blog/feed.xml', '/blog/feed.xml'),
    ('https://munderdiffl.in/feed.xml', '/blog/feed.xml'),
    ('https://munderdiffl.in/logo.png', '/logo.png'),
    ('https://munderdiffl.in/download.html', '/download.html'),
    ('https://munderdiffl.in/wall.html', '/wall.html'),
    ('https://munderdiffl.in/privacy.html', '/privacy.html'),
    ('https://munderdiffl.in/terms.html', '/terms.html'),
    ('https://munderdiffl.in/blog/', '/blog/'),
    ('https://munderdiffl.in/blog', '/blog/'),
    ('https://munderdiffl.in/#install', '/download.html'),
    ('https://munderdiffl.in/', '/'),
    ('https://munderdiffl.in', '/'),

    # Brand text & labels
    ('munderdiffl.in ↗', 'AgentHive ↗'),
    ('Munder Difflin, Inc. — Multi-Agent Harness', 'AgentHive — Multi-Agent Harness & Autonomous Desktop Orchestration'),
    ('Munder Difflin, Inc.', 'AgentHive, Inc.'),
    ('Munder Difflin home', 'AgentHive home'),
    ('aria-label="Munder Difflin home"', 'aria-label="AgentHive home"'),
    ('© 2026 Munder Difflin', '© 2026 AgentHive — Created by Ayush Singh'),
    ('The Munder Difflin Blog', 'The AgentHive Blog'),
    ('The Munder Difflin', 'The AgentHive'),
    ('Multi-agent & Claude Code blog — Munder Difflin', 'Multi-Agent AI & Autonomous Engineering Blog — AgentHive'),
    ('Multi-agent &amp; Claude Code blog — Munder Difflin', 'Multi-Agent AI & Autonomous Engineering Blog — AgentHive'),
    ('contact@munderdiffl.in', 'ayush.v.singh2611@gmail.com'),
    ('MUNDER DIFFLIN', 'AGENTHIVE'),
]

count_files_modified = 0

for root, _, files in os.walk('docs'):
    for f in files:
        if f.endswith(('.html', '.xml', '.json', '.js', '.txt')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                
                orig = content
                for target, replacement in replacements:
                    content = content.replace(target, replacement)
                
                # Context-aware regex replacements
                # "name": "Munder Difflin" -> "name": "AgentHive"
                content = re.sub(r'"name":\s*"Munder Difflin"', '"name": "AgentHive"', content)
                content = re.sub(r'"publisher":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"Munder Difflin"', '"publisher": { "@type": "Organization", "name": "AgentHive"', content)
                
                # Replace download Munder Difflin with download AgentHive
                content = content.replace('download Munder Difflin', 'download AgentHive')
                content = content.replace('Download Munder Difflin', 'Download AgentHive')
                content = content.replace('install Munder Difflin', 'install AgentHive')
                content = content.replace('Install Munder Difflin', 'Install AgentHive')
                content = content.replace('with Munder Difflin', 'with AgentHive')
                content = content.replace('on Munder Difflin', 'on AgentHive')
                content = content.replace('in Munder Difflin', 'in AgentHive')
                content = content.replace('In Munder Difflin', 'In AgentHive')
                content = content.replace("Munder Difflin's", "AgentHive's")
                content = content.replace("Munder Difflin&#39;s", "AgentHive&#39;s")

                if content != orig:
                    with open(p, 'w', encoding='utf-8') as fp:
                        fp.write(content)
                    count_files_modified += 1
            except Exception as e:
                print(f"Error updating {p}: {e}")

print(f"Total files updated across docs/: {count_files_modified}")

