#!/usr/bin/env python3
"""Generate the Version B project landing pages.

Writes experiment-version/projects/<slug>.html for every entry in the TABS
data in assets/experiment/core.js. GitHub Pages serves them without the
.html extension, e.g. /experiment-version/projects/seo-performance.

The header, footer, SVG gradient defs, favicon and detail dialog are copied
from experiment-version.html, so re-run this after changing those:

    python3 scripts/build-project-pages.py
"""
import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://jasong3012.github.io/web-development-portfolio"
OUT = os.path.join(ROOT, "experiment-version", "projects")
UP = "../../"  # from experiment-version/projects/ back to the site root

home = open(os.path.join(ROOT, "experiment-version.html"), encoding="utf-8").read()
core = open(os.path.join(ROOT, "assets", "experiment", "core.js"), encoding="utf-8").read()


def between(src, start, end, include_end=True):
    a = src.index(start)
    b = src.index(end, a) + (len(end) if include_end else 0)
    return src[a:b]


def js_str(t):
    return t.replace("\\u2019", "’").replace("\\'", "'")


# Discipline list: id (slug), label and intro, straight from the shared data.
tabs = []
for slug, label, intro in re.findall(
        r"\{id:'([a-z-]+)',label:'([^']+)'(?:,projects:true|,intro:'((?:[^'\\]|\\.)*)')", core):
    if not intro:
        intro = ("Live, non-confidential sites across enterprise and open-source CMS platforms, "
                 "from enterprise ecommerce to SEO-led service pages.")
    tabs.append((slug, js_str(label), js_str(intro)))
assert tabs, "no TABS found in core.js"


def relink(fragment, current=None):
    """Point homepage-relative links at the right place from a project page."""
    fragment = re.sub(r'href="experiment-version/projects/([a-z-]+)"', r'href="\1"', fragment)
    fragment = fragment.replace('href="index.html"', 'href="%sindex.html"' % UP)
    fragment = re.sub(r'href="#(home)?"', 'href="%sexperiment-version.html"' % UP, fragment)
    fragment = re.sub(r'href="#([a-z][\w-]*)"', r'href="%sexperiment-version.html#\1"' % UP, fragment)
    if current:
        fragment = fragment.replace('<a href="%s">' % current, '<a href="%s" aria-current="page">' % current)
    return fragment


head_bits = {
    "favicon": re.search(r'<link rel="icon"[^>]*>', home).group(0),
    "inline_css": re.search(r"<style>/\* gradient fills.*?</style>", home, re.S).group(0),
    "theme_script": re.search(r"<script>/\* apply a saved theme.*?</script>", home, re.S).group(0),
}
defs = between(home, '<svg width="0" height="0" style="position:absolute"', "</svg>")
header = between(home, '<header class="site-header" id="top">', "</header>")
footer = between(home, '<footer class="site-footer">', "</footer>")
dialog = between(home, '<dialog class="detail-dialog"', "</dialog>")

os.makedirs(OUT, exist_ok=True)
esc = lambda t: html.escape(t, quote=True)

for n, (slug, label, intro) in enumerate(tabs, 1):
    nn = "%02d" % n
    tab_links = "".join(
        '<a class="tab" href="%s"%s>%s</a>' % (s, ' aria-current="page"' if s == slug else "", esc(l))
        for s, l, _ in tabs)
    hdr = relink(header, current=slug)
    # Projects is the active top-level item on these pages.
    hdr = hdr.replace('class="nav-link tracker" href="%sexperiment-version.html#work" data-route="work"' % UP,
                      'class="nav-link tracker is-active" href="%sexperiment-version.html#work" data-route="work"' % UP)
    hdr = re.sub(r'class="nav-link tracker( is-active)?" href="%sexperiment-version.html" data-route="home"' % re.escape(UP),
                 'class="nav-link tracker" href="%sexperiment-version.html" data-route="home"' % UP, hdr)
    page = f"""<!doctype html>
<html lang="en" data-base="{UP}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#F9F4F5">
{head_bits['favicon']}
{head_bits['theme_script']}
<title>{esc(label)} Projects — Jason Grant</title>
<meta name="description" content="{esc(intro)}">
<link rel="canonical" href="{SITE}/experiment-version/projects/{slug}">
<meta property="og:title" content="{esc(label)} Projects — Jason Grant">
<meta property="og:description" content="{esc(intro)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{SITE}/experiment-version/projects/{slug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{UP}assets/experiment/site.css">
{head_bits['inline_css']}
</head>
<body>
{defs}
<a class="skip-link" href="#main">Skip to content</a>

{hdr}

<main id="main">
<section class="disc-page" aria-labelledby="dh">
  <div class="wrap page-intro">
    <a class="text-link disc-back" href="{UP}experiment-version.html#work">← All projects</a>
    <h1 id="dh">{esc(label)}.</h1>
    <div class="split">
      <div class="label"><b>{nn}</b> — projects by discipline</div>
      <div class="lede"><p>{esc(intro)}</p></div>
    </div>
    <div class="figure">
      <div class="figure-bar"><span><b>FIG. {nn}</b> · {esc(label.lower())}</span><span id="disc-count"></span></div>
      <nav class="tabs" aria-label="Projects by discipline">{tab_links}</nav>
      <div class="tab-panel"><div class="work-grid" id="disc-grid"></div><div class="tab-foot" id="disc-foot" hidden></div></div>
      <p class="caption"><b>Fig. {nn}</b> — {esc(label)}. Select a project to see the details.</p>
    </div>
  </div>
</section>
</main>

{relink(footer)}

{dialog}

<script src="{UP}assets/experiment/core.js"></script>
<script>
(function(){{
  var J=window.JG,n=J.TABS.findIndex(function(t){{return t.id==='{slug}'}}),grid=document.getElementById('disc-grid');
  document.getElementById('disc-count').textContent=J.renderTab(J.TABS[n],n,grid,document.getElementById('disc-foot'));
  grid.addEventListener('click',J.gridClick);
}})();
</script>
</body>
</html>
"""
    with open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8") as f:
        f.write(page)
    print("wrote experiment-version/projects/%s.html" % slug)

# Folder URLs fall back to the homepage instead of a 404.
redirect = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url={to}"><link rel="canonical" href="{to}">
<script>location.replace({to!r})</script></head>
<body><p><a href="{to}">Continue to Jason Grant's portfolio</a></p></body></html>
"""
with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
    f.write(redirect.format(to="../../experiment-version.html#work"))
with open(os.path.join(ROOT, "experiment-version", "index.html"), "w", encoding="utf-8") as f:
    f.write(redirect.format(to="../experiment-version.html"))
print("wrote folder redirects")
