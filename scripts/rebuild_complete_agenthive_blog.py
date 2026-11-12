import os
import json
import re
import html
from datetime import datetime

# Load all 294 posts
with open('scratch_all_294_posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

print(f"Loaded {len(posts)} posts from scratch_all_294_posts.json")

# Cluster counts verification
clusters = [
    ("comparisons", "Comparisons", 75),
    ("guides", "Guides", 62),
    ("concepts", "Concepts", 60),
    ("news", "News", 36),
    ("internals", "Internals", 19),
    ("story", "Story", 19),
    ("orchestration", "Orchestration", 9),
    ("use-cases", "Use Cases", 9),
    ("memory", "Memory", 5),
]

NAV_HTML = """<nav id="nav">
  <a class="brand" href="/" aria-label="AgentHive home">
    <img class="brand-logo" src="/logo.png" width="1318" height="840" alt="AgentHive — Multi-Agent Harness & Autonomous Desktop Orchestration" />
  </a>
  <span class="spacer"></span>
  <div class="links">
    <a href="/blog/">Latest</a>
    <a href="/blog/topics/">Topics</a>
    <a href="/blog/about/">About</a>
    <a href="/">↗ Product</a>
  </div>
  <div class="nav-actions">
    <a class="btn sm" href="/blog/feed.xml" aria-label="RSS feed">⤵ RSS</a>
    <a class="btn sm primary" href="/download.html">⤓ Download</a>
  </div>
</nav>"""

FOOTER_HTML = """<footer class="site-foot">
  <div class="wrap">
    <div class="foot-top">
      <a class="foot-brand brand" href="/" aria-label="AgentHive home">
        <img class="brand-logo" src="/logo.png" width="1318" height="840" alt="AgentHive — Multi-Agent Harness & Autonomous Desktop Orchestration" />
      </a>
      <div class="foot-links">
        <a href="/blog/">Latest</a>
        <a href="/blog/topics/">Topics</a>
        <a href="/blog/about/">About</a>
        <a href="/blog/feed.xml">RSS</a>
        <a href="https://github.com/ayushvsingh2611-code/office">GitHub</a>
        <a href="/">AgentHive ↗</a>
      </div>
    </div>
    <div class="foot-meta">
      © 2026 AgentHive · Local-first · MIT-licensed ·
      Built by Ayush Singh on <a href="/">Electron, React, Pixi.js, xterm.js &amp; node-pty</a>.
      Run an office of agents while you sleep.
    </div>
  </div>
</footer>"""

HEAD_COMMON = """<link rel="icon" type="image/png" href="/logo.png" />
<link rel="apple-touch-icon" href="/logo.png" />
<meta name="theme-color" content="#0A0D14" />
<link rel="alternate" type="application/atom+xml" title="AgentHive Blog" href="/blog/feed.xml" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&amp;family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&amp;family=Space+Grotesk:wght@500;600;700&amp;family=JetBrains+Mono:wght@400;600&amp;display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/blog/assets/blog-press.css" />"""

def render_filters(active_topic=None):
    chips = []
    # All chip
    if not active_topic or active_topic == "all":
        chips.append('<a class="chip" aria-current="page" href="/blog/">All<span class="ct">294</span></a>')
    else:
        chips.append('<a class="chip" href="/blog/">All<span class="ct">294</span></a>')
    
    for key, label, count in clusters:
        if active_topic == key:
            chips.append(f'<a class="chip" aria-current="page" href="/blog/topics/{key}/">{key}<span class="ct">{count}</span></a>')
        else:
            chips.append(f'<a class="chip" href="/blog/topics/{key}/">{key}<span class="ct">{count}</span></a>')
    
    return f'<div class="filters" role="navigation" aria-label="Topics">\n    ' + '\n    '.join(chips) + '\n  </div>'

def render_card(p):
    cat = p.get('category', 'guides').lower()
    slug = p['slug']
    title = html.escape(p['title'])
    desc = html.escape(p.get('description', ''))
    date = p.get('date', '2026')
    read_min = p.get('read_min', '5 min')
    
    return f"""<article class="card t-{cat}">
  <a class="thumb t-{cat}" href="/blog/{slug}/" aria-hidden="true" tabindex="-1">
    <span class="thumb-ph"><em class="ph-glyph" aria-hidden="true">✶</em><span>{cat.upper()}</span></span>
  </a>
  <div class="body">
    <div class="meta">
      <time datetime="{date}">{date}</time>
      <span class="dot" aria-hidden="true"></span>
      <span>{read_min}</span>
    </div>
    <h3><a href="/blog/{slug}/">{title}</a></h3>
    <p class="dek">{desc}</p>
    <div class="foot">
      <span class="tag kind">{cat}</span>
      <a class="more" href="/blog/{slug}/" aria-label="Read: {title}">Read →</a>
    </div>
  </div>
</article>"""

# 1. Clean existing HTML files in docs/blog/
print("Cleaning existing blog HTML files...")
for root, _, files in os.walk('docs/blog'):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                
                orig = content
                # Replace old footers
                content = re.sub(r'<footer class="site-foot">[\s\S]*?</footer>', FOOTER_HTML, content)
                # Replace old nav
                content = re.sub(r'<nav id="nav">[\s\S]*?</nav>', NAV_HTML, content)
                # Replace lingering domain mentions
                content = content.replace('https://agenthive.local/blog/feed.xml', '/blog/feed.xml')
                content = content.replace('https://agenthive.local/logo.png', '/logo.png')
                content = content.replace('https://agenthive.local/media/og.png', '/media/og.png')
                content = content.replace('https://agenthive.local/#install', '/download.html')
                content = content.replace('https://agenthive.local', '/')
                content = content.replace('munderdiffl.in ↗', 'AgentHive ↗')
                content = content.replace('© 2026 Munder Difflin', '© 2026 AgentHive — Created by Ayush Singh')
                content = content.replace('Munder Difflin, Inc. — Multi-Agent Harness', 'AgentHive — Multi-Agent Harness & Autonomous Desktop Orchestration')
                content = content.replace('aria-label="Munder Difflin home"', 'aria-label="AgentHive home"')
                
                if content != orig:
                    with open(p, 'w', encoding='utf-8') as fp:
                        fp.write(content)
            except Exception as e:
                print(f"Error cleaning {p}: {e}")

# 2. Generate / update all 294 article HTML pages
print("Updating all 294 article pages in docs/blog/...")
updated_count = 0
for p in posts:
    slug = p['slug']
    target_dir = os.path.join('docs', 'blog', slug)
    target_file = os.path.join(target_dir, 'index.html')
    
    os.makedirs(target_dir, exist_ok=True)
    
    cat = p.get('category', 'guides').lower()
    title = html.escape(p['title'])
    desc = html.escape(p.get('description', ''))
    date = p.get('date', 'Oct 2026')
    read_min = p.get('read_min', '5 min')
    
    # If the file already exists and has a custom deep content (like indian-open-source-ai-projects-vs-big-tech), preserve its custom prose but update title, nav, footer
    existing_prose = None
    if os.path.exists(target_file):
        try:
            with open(target_file, 'r', encoding='utf-8') as ef:
                orig_txt = ef.read()
                # Check if it has a custom prose section with more than 3000 chars
                m_prose = re.search(r'<div class="prose">([\s\S]*?)</div>\s*<footer class="post-foot">', orig_txt)
                if m_prose and len(m_prose.group(1)) > 3000:
                    existing_prose = m_prose.group(1).replace('Munder Difflin', 'AgentHive').replace('munder difflin', 'AgentHive')
        except Exception:
            pass

    prose_content = existing_prose if existing_prose else f"""<h2>Overview &amp; Architecture Context</h2>
    <p>
      In multi-agent autonomous engineering, coordination, context isolation, and persistence determine whether a development harness accelerates productivity or collapses into merge races. 
      <strong>AgentHive</strong>, created by Ayush Singh, approaches this with a local-first Straw Hat Crew model (Luffy as orchestrator, Zoro for security and backend, Franky for tools and testing) running atop Electron, React, Pixi.js, xterm.js, and node-pty.
    </p>

    <h2>Deep Dive Analysis</h2>
    <p>
      {desc}
    </p>

    <div class="callout note">
      <strong>Key Engineering Insight:</strong> When orchestrating parallel agents across local git worktrees or terminal sessions, memory retention across sessions (MemPalace) and an append-only event log are required to prevent context degradation and duplicate execution loops.
    </div>

    <h2>Implementation Strategy &amp; Next Steps</h2>
    <p>
      Whether you are configuring custom MCP servers, evaluating alternative autonomous agent runtimes, or tuning prompt cache windows for multi-agent loops, AgentHive provides native visual transparency through its living office floor and interactive companion HUD.
    </p>
    
    <p>
      For more guides and hands-on walkthroughs, explore our <a href="/blog/topics/{cat}/">{cat.capitalize()}</a> catalog or clone the official repository on <a href="https://github.com/ayushvsingh2611-code/office">GitHub</a>.
    </p>"""

    article_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} — AgentHive Blog</title>
<meta name="description" content="{desc}" />
<link rel="canonical" href="/blog/{slug}/" />

<!-- Open Graph -->
<meta property="og:site_name" content="AgentHive Blog" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{title} — AgentHive Blog" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="/blog/{slug}/" />
<meta property="og:image" content="/media/og.png" />
<meta property="og:locale" content="en_US" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title} — AgentHive Blog" />
<meta name="twitter:description" content="{desc}" />
<meta name="twitter:image" content="/media/og.png" />

{HEAD_COMMON}
</head>
<body class="theme-press">
<a class="skip-link" href="#main">Skip to content</a>
{NAV_HTML}

<article class="post wrap" id="main">
  <nav class="crumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="sep" aria-hidden="true">/</span>
    <a href="/blog/">Blog</a>
    <span class="sep" aria-hidden="true">/</span>
    <a href="/blog/topics/{cat}/">{cat.capitalize()}</a>
  </nav>

  <header class="post-head">
    <p class="eyebrow"><a class="cat-link" href="/blog/topics/{cat}/">{cat.capitalize()}</a></p>
    <h1>{title}</h1>
    <div class="byline">
      <span class="author">By <strong>Ayush Singh</strong></span>
      <span class="dot" aria-hidden="true">·</span>
      <time datetime="{date}">{date}</time>
      <span class="dot" aria-hidden="true">·</span>
      <span>{read_min} read</span>
    </div>
    {f'<p class="lead">{desc}</p>' if desc else ''}
  </header>

  <div class="prose">
    {prose_content}
  </div>

  <footer class="post-foot">
    <div class="tags">
      <span class="tag">#AgentHive</span>
      <span class="tag">#{cat}</span>
      <span class="tag">#LocalFirst</span>
      <span class="tag">#AutonomousAgents</span>
    </div>
    <div class="share-box">
      <a class="btn sm" href="/blog/">← Back to all posts</a>
      <a class="btn sm primary" href="/download.html">Download AgentHive</a>
    </div>
  </footer>
</article>

{FOOTER_HTML}
</body>
</html>"""

    with open(target_file, 'w', encoding='utf-8') as out_fp:
        out_fp.write(article_html)
    updated_count += 1

print(f"Updated all {updated_count} article HTML pages with clean AgentHive branding!")

# 3. Build docs/blog/index.html with all 294 posts
print("Rebuilding docs/blog/index.html with full 294 catalog...")
# Featured post: indian-open-source-ai-projects-vs-big-tech
featured_post = next((p for p in posts if p['slug'] == 'indian-open-source-ai-projects-vs-big-tech'), posts[0])
remaining_posts = [p for p in posts if p['slug'] != featured_post['slug']]

cards_html = '\n'.join([render_card(p) for p in remaining_posts])

blog_index_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Multi-Agent AI &amp; Autonomous Engineering Blog — AgentHive</title>
<meta name="description" content="Guides, deep dives, and comparisons on running multi-agent AI: orchestration, agent memory, automation, and the tooling landscape. From the team building AgentHive with a GOD orchestrator you talk to." />
<link rel="canonical" href="/blog/" />

<!-- Open Graph -->
<meta property="og:site_name" content="AgentHive Blog" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Multi-Agent AI &amp; Autonomous Engineering Blog — AgentHive" />
<meta property="og:description" content="Guides, deep dives, and comparisons on running multi-agent AI: orchestration, agent memory, automation, and the tooling landscape." />
<meta property="og:url" content="/blog/" />
<meta property="og:image" content="/media/og.png" />
<meta property="og:locale" content="en_US" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Multi-Agent AI &amp; Autonomous Engineering Blog — AgentHive" />
<meta name="twitter:description" content="Guides, deep dives, and comparisons on running multi-agent AI: orchestration, agent memory, automation, and the tooling landscape." />
<meta name="twitter:image" content="/media/og.png" />

{HEAD_COMMON}
</head>
<body class="theme-press">
<a class="skip-link" href="#main">Skip to content</a>
{NAV_HTML}

<header class="page-head wrap" id="main">
  <p class="eyebrow">Notes from the office floor</p>
  <h1>The AgentHive <span class="hl">Blog.</span></h1>
  <p class="lead">Guides, deep dives, and comparisons on running <strong>multi-agent AI &amp; Claude Code</strong> — orchestration, agent memory, automation, and the tooling landscape. From the team building a self-coordinating hive of agents with a GOD orchestrator you talk to.</p>

  {render_filters('all')}
</header>

<div class="wrap featured">
  <article class="card card-featured t-comparisons">
    <a class="thumb t-comparisons" href="/blog/{featured_post['slug']}/" aria-hidden="true" tabindex="-1">
      <span class="thumb-ph"><em class="ph-glyph" aria-hidden="true">★</em><span>FEATURED COMPARISON</span></span>
    </a>
    <div class="body">
      <div class="meta">
        <span class="badge featured-badge">Top Featured</span>
        <time datetime="{featured_post.get('date', 'Sep 25, 2026')}">{featured_post.get('date', 'Sep 25, 2026')}</time>
        <span class="dot" aria-hidden="true">·</span>
        <span>{featured_post.get('read_min', '8 min read')}</span>
      </div>
      <h2><a href="/blog/{featured_post['slug']}/">{html.escape(featured_post['title'])}</a></h2>
      <p class="dek">{html.escape(featured_post.get('description', ''))}</p>
      <div class="foot">
        <span class="tag kind">Comparisons</span>
        <a class="more" href="/blog/{featured_post['slug']}/">Read the story →</a>
      </div>
    </div>
  </article>
</div>

<section class="wrap">
  <div class="post-grid">
    {cards_html}
  </div>
</section>

{FOOTER_HTML}
</body>
</html>"""

with open('docs/blog/index.html', 'w', encoding='utf-8') as f:
    f.write(blog_index_html)
print("Updated docs/blog/index.html successfully!")

# 4. Rebuild topic pages in docs/blog/topics/<topic>/index.html
print("Rebuilding topic pages...")
os.makedirs('docs/blog/topics', exist_ok=True)

for key, label, count in clusters:
    topic_dir = os.path.join('docs', 'blog', 'topics', key)
    os.makedirs(topic_dir, exist_ok=True)
    
    topic_posts = [p for p in posts if p.get('category', '').lower() == key]
    topic_cards = '\n'.join([render_card(p) for p in topic_posts])
    
    topic_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{label} ({len(topic_posts)} Posts) — AgentHive Blog</title>
<meta name="description" content="Explore {label} on the AgentHive engineering blog. {count} articles and guides on multi-agent development." />
<link rel="canonical" href="/blog/topics/{key}/" />

{HEAD_COMMON}
</head>
<body class="theme-press">
<a class="skip-link" href="#main">Skip to content</a>
{NAV_HTML}

<header class="page-head wrap" id="main">
  <nav class="crumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="sep" aria-hidden="true">/</span>
    <a href="/blog/">Blog</a>
    <span class="sep" aria-hidden="true">/</span>
    <a href="/blog/topics/">Topics</a>
  </nav>
  <p class="eyebrow">Topic Cluster</p>
  <h1>{label} <span class="hl">({len(topic_posts)})</span></h1>
  <p class="lead">Curated articles, benchmarks, and guides in the <strong>{label}</strong> cluster.</p>

  {render_filters(key)}
</header>

<section class="wrap">
  <div class="post-grid">
    {topic_cards}
  </div>
</section>

{FOOTER_HTML}
</body>
</html>"""

    with open(os.path.join(topic_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(topic_html)
    print(f"  Topic page '{key}': {len(topic_posts)} posts written.")

# 5. Rebuild docs/blog/topics/index.html
print("Rebuilding docs/blog/topics/index.html...")
topics_cards_html = []
for key, label, count in clusters:
    topic_posts = [p for p in posts if p.get('category', '').lower() == key]
    first_title = html.escape(topic_posts[0]['title']) if topic_posts else "Explore articles"
    topics_cards_html.append(f"""<article class="card t-{key}">
  <a class="thumb t-{key}" href="/blog/topics/{key}/" aria-hidden="true" tabindex="-1">
    <span class="thumb-ph"><em class="ph-glyph" aria-hidden="true">✶</em><span>{label.upper()}</span></span>
  </a>
  <div class="body">
    <div class="meta">
      <span>Topic Cluster</span>
      <span class="dot" aria-hidden="true">·</span>
      <span>{len(topic_posts)} Posts</span>
    </div>
    <h3><a href="/blog/topics/{key}/">{label} ({len(topic_posts)})</a></h3>
    <p class="dek">Latest: {first_title}</p>
    <div class="foot">
      <span class="tag kind">{key}</span>
      <a class="more" href="/blog/topics/{key}/">Browse {len(topic_posts)} posts →</a>
    </div>
  </div>
</article>""")

topics_index_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Topics &amp; Clusters (294 Posts) — AgentHive Blog</title>
<meta name="description" content="Explore all 10 topic clusters in the AgentHive blog catalog: Comparisons (75), Guides (62), Concepts (60), News (36), Internals (19), Story (19), Orchestration (9), Use-Cases (9), Memory (5)." />
<link rel="canonical" href="/blog/topics/" />

{HEAD_COMMON}
</head>
<body class="theme-press">
<a class="skip-link" href="#main">Skip to content</a>
{NAV_HTML}

<header class="page-head wrap" id="main">
  <p class="eyebrow">Taxonomy</p>
  <h1>Blog <span class="hl">Topics.</span></h1>
  <p class="lead">All 294 articles categorized into 10 structured engineering clusters.</p>

  {render_filters(None)}
</header>

<section class="wrap">
  <div class="post-grid">
    {'\n'.join(topics_cards_html)}
  </div>
</section>

{FOOTER_HTML}
</body>
</html>"""

with open('docs/blog/topics/index.html', 'w', encoding='utf-8') as f:
    f.write(topics_index_html)
print("Updated docs/blog/topics/index.html successfully!")

# 6. Rebuild docs/blog/feed.xml
print("Rebuilding docs/blog/feed.xml...")
feed_entries = []
for p in posts[:60]:
    slug = p['slug']
    title = html.escape(p['title'])
    desc = html.escape(p.get('description', ''))
    date = p.get('date', '2026-11-10')
    cat = p.get('category', 'guides')
    
    feed_entries.append(f"""  <entry>
    <title>{title}</title>
    <link href="/blog/{slug}/" />
    <id>/blog/{slug}/</id>
    <published>{date}</published>
    <updated>{date}</updated>
    <summary>{desc}</summary>
    <author><name>Ayush Singh</name></author>
    <category term="{cat}" />
  </entry>""")

feed_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>AgentHive Blog</title>
  <subtitle>Guides, deep dives, and comparisons on running multi-agent AI: orchestration, agent memory, automation, and the tooling landscape.</subtitle>
  <link href="/blog/feed.xml" rel="self" />
  <link href="/blog/" />
  <updated>2026-11-10T00:00:00.000Z</updated>
  <id>/blog/</id>
  <author><name>Ayush Singh</name><uri>https://github.com/ayushvsingh2611-code/office</uri></author>
{chr(10).join(feed_entries)}
</feed>"""

with open('docs/blog/feed.xml', 'w', encoding='utf-8') as f:
    f.write(feed_xml)
print("Updated docs/blog/feed.xml successfully!")

# 7. Clean other docs/*.html files
print("Cleaning landing docs/*.html files...")
for f in ['index.html', 'download.html', 'wall.html', 'privacy.html', 'terms.html']:
    p = os.path.join('docs', f)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as fp:
            txt = fp.read()
        txt = txt.replace('https://agenthive.local/blog/feed.xml', '/blog/feed.xml')
        txt = txt.replace('https://agenthive.local', '/')
        txt = txt.replace('munderdiffl.in ↗', 'AgentHive ↗')
        txt = txt.replace('© 2026 Munder Difflin', '© 2026 AgentHive — Created by Ayush Singh')
        with open(p, 'w', encoding='utf-8') as fp:
            fp.write(txt)

print("ALL STEPS COMPLETED!")
