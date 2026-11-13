#!/usr/bin/env python3
"""Generate the Version B project landing pages.

Writes, from the TABS / PROJECTS data in assets/experiment/core.js:
  experiment-version/projects/<slug>.html   one page per discipline
  experiment-version/projects/index.html    the "All projects" page
  experiment-version/index.html             redirect to the homepage

GitHub Pages serves the pages without the .html extension, e.g.
/experiment-version/projects/seo-performance.

Project cards are rendered here (by running core.js in Node) and written into
the HTML, so the pages show their content on first paint with no layout shift
and the text is crawlable. The header, footer, SVG gradient defs, favicon and
detail dialog are copied from experiment-version.html.

It also stamps ?v=<content hash> on the shared site.css / core.js URLs in every
Version B page (including experiment-version.html) so returning visitors never
run a new page against a stale cached file.

Requires Python 3 and Node.js. Re-run after changing any of the above:

    python3 scripts/build-project-pages.py
"""
import hashlib
import html
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://jasong3012.github.io/web-development-portfolio"
OUT = os.path.join(ROOT, "experiment-version", "projects")
UP = "../../"  # from experiment-version/projects/ back to the site root
CORE = os.path.join(ROOT, "assets", "experiment", "core.js")
CSS = os.path.join(ROOT, "assets", "experiment", "site.css")
HOME = os.path.join(ROOT, "experiment-version.html")


def version(path):
    """Short content hash, so browsers never pair a new page with a stale cached file."""
    return hashlib.sha1(open(path, "rb").read()).hexdigest()[:10]


V_CORE, V_CSS = version(CORE), version(CSS)
# Stamp the homepage's references too (it is hand-edited, not generated).
_home = open(HOME, encoding="utf-8").read()
_home = re.sub(r'assets/experiment/site\.css(\?v=\w+)?"', 'assets/experiment/site.css?v=%s"' % V_CSS, _home)
_home = re.sub(r'assets/experiment/core\.js(\?v=\w+)?"', 'assets/experiment/core.js?v=%s"' % V_CORE, _home)
open(HOME, "w", encoding="utf-8").write(_home)

home = open(os.path.join(ROOT, "experiment-version.html"), encoding="utf-8").read()
esc = lambda t: html.escape(t, quote=True)

# ---------------------------------------------------------------- render cards
# core.js only touches the DOM when elements exist, so a tiny stub is enough.
NODE_RENDER = r"""
const fs=require('fs'),vm=require('vm');
const nul=()=>null;
const document={documentElement:{getAttribute:a=>a==='data-base'?process.argv[2]:null,setAttribute(){},removeAttribute(){}},
  getElementById:nul,querySelector:nul,querySelectorAll:()=>[],addEventListener(){}};
const ctx={document,window:{},localStorage:{getItem:nul,setItem(){}}};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),ctx);
const J=ctx.window.JG,out={tabs:[],total:0};
J.TABS.forEach((T,n)=>{const g={innerHTML:''},f={innerHTML:'',hidden:true};const count=J.renderTab(T,n,g,f);
  out.tabs.push({id:T.id,label:T.label,intro:T.intro||'',count,n:J.counts(T),grid:g.innerHTML,foot:f.innerHTML,footHidden:f.hidden,category:J.categoryCard(T,n)});out.total+=J.counts(T)});
process.stdout.write(JSON.stringify(out));
"""
data = json.loads(subprocess.run(["node", "-e", NODE_RENDER, CORE, UP], check=True, capture_output=True, text=True).stdout)
tabs = data["tabs"]
for t in tabs:
    if t["id"] == "web-development":
        t["intro"] = ("Live, non-confidential sites across enterprise and open-source CMS platforms, "
                      "from enterprise ecommerce to SEO-led service pages.")


# --------------------------------------------------------------- shared chrome
def between(src, start, end):
    a = src.index(start)
    return src[a:src.index(end, a) + len(end)]


def relink(fragment):
    """Point homepage-relative links at the right place from a project page."""
    fragment = fragment.replace('href="experiment-version/projects/"', 'href="./"')
    fragment = re.sub(r'href="experiment-version/projects/([a-z-]+)"', r'href="\1"', fragment)
    fragment = fragment.replace('href="index.html"', 'href="%sindex.html"' % UP)
    fragment = re.sub(r'href="#(home)?"', 'href="%sexperiment-version.html"' % UP, fragment)
    fragment = re.sub(r'href="#([a-z][\w-]*)"', r'href="%sexperiment-version.html#\1"' % UP, fragment)
    return fragment


favicon = re.search(r'<link rel="icon"[^>]*>', home).group(0)
inline_css = re.search(r"<style>/\* gradient fills.*?</style>", home, re.S).group(0)
theme_script = re.search(r"<script>/\* apply a saved theme.*?</script>", home, re.S).group(0)
defs = between(home, '<svg width="0" height="0" style="position:absolute"', "</svg>")
header = relink(between(home, '<header class="site-header" id="top">', "</header>"))
header = header.replace('class="nav-link tracker" href="./" data-route="work"',
                        'class="nav-link tracker is-active" href="./" data-route="work"')
footer = relink(between(home, '<footer class="site-footer">', "</footer>"))
dialog = between(home, '<dialog class="detail-dialog"', "</dialog>")
FONTS = re.search(r'<link href="https://fonts.googleapis.com/css2[^"]*" rel="stylesheet">', home).group(0)


def mark_current(fragment, href):
    return fragment.replace('<a href="%s">' % href, '<a href="%s" aria-current="page">' % href) \
                   .replace('<a class="sub-all" href="%s">' % href, '<a class="sub-all" href="%s" aria-current="page">' % href)


def sidebar(current):
    rows = ['<li><a href="./"%s>All projects<span>%d</span></a></li>' % (' aria-current="page"' if current == "./" else "", data["total"])]
    for t in tabs:
        rows.append('<li><a href="%s"%s>%s<span>%s</span></a></li>' % (
            t["id"], ' aria-current="page"' if current == t["id"] else "", esc(t["label"]), t["n"] or "soon"))
    return ('<aside class="proj-side" aria-label="Project categories"><p class="side-title">Projects</p>'
            '<ul>%s</ul></aside>' % "".join(rows))


def page(slug_href, title, desc, canonical, back_href, back_text, h1, label_html, intro, fig, fig_count,
         panel_html, caption, script, with_dialog=True):
    return f"""<!doctype html>
<html lang="en" data-base="{UP}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#F9F4F5">
{favicon}
{theme_script}
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{canonical}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{FONTS}
<link rel="stylesheet" href="{UP}assets/experiment/site.css?v={V_CSS}">
<link rel="preload" href="{UP}assets/experiment/core.js?v={V_CORE}" as="script">
{inline_css}
</head>
<body>
{defs}
<a class="skip-link" href="#main">Skip to content</a>

{mark_current(header, slug_href)}

<main id="main">
<section class="disc-page" aria-labelledby="dh">
  <div class="wrap page-intro">
    <a class="text-link disc-back" href="{back_href}">{back_text}</a>
    <h1 id="dh">{esc(h1)}.</h1>
    <div class="split">
      <div class="label">{label_html}</div>
      <div class="lede"><p>{esc(intro)}</p></div>
    </div>
    <div class="proj-layout">
      <div class="figure">
        <div class="figure-bar"><span>{fig}</span><span>{fig_count}</span></div>
        <div class="tab-panel">{panel_html}</div>
        <p class="caption">{caption}</p>
      </div>
      {sidebar(slug_href)}
    </div>
  </div>
</section>
</main>

{footer}
{dialog if with_dialog else ""}
<script src="{UP}assets/experiment/core.js?v={V_CORE}"></script>
{script}
</body>
</html>
"""


os.makedirs(OUT, exist_ok=True)
for n, t in enumerate(tabs, 1):
    nn = "%02d" % n
    slug, label, intro = t["id"], t["label"], t["intro"]
    panel = '<div class="work-grid" id="disc-grid">%s</div><div class="tab-foot"%s>%s</div>' % (
        t["grid"], " hidden" if t["footHidden"] else "", t["foot"])
    script = "<script>document.getElementById('disc-grid').addEventListener('click',JG.gridClick)</script>"
    html_out = page(slug, "%s Projects — Jason Grant" % label, intro, "%s/experiment-version/projects/%s" % (SITE, slug),
                    "./", "← All projects", label, "<b>%s</b> — projects by discipline" % nn, intro,
                    "<b>FIG. %s</b> · %s" % (nn, esc(label.lower())), esc(t["count"]), panel,
                    "<b>Fig. %s</b> — %s. Select a project to see the details." % (nn, esc(label)), script)
    with open(os.path.join(OUT, slug + ".html"), "w", encoding="utf-8") as f:
        f.write(html_out)
    print("wrote experiment-version/projects/%s.html" % slug)

intro_all = ("Every project, grouped by discipline: web development, analytics, SEO, automation, "
             "AI chatbots, AI content, creative assets and games.")
panel = '<div class="work-grid" id="cat-grid">%s</div>' % "".join(t["category"] for t in tabs)
index_html = page("./", "Projects — Jason Grant", intro_all, "%s/experiment-version/projects/" % SITE,
                  "%sexperiment-version.html" % UP, "← Home", "Projects", "<b>00</b> — all projects", intro_all,
                  "<b>FIG. 00</b> · projects by discipline", "%d categories · %d projects" % (len(tabs), data["total"]),
                  panel, "<b>Fig. 00</b> — Projects by discipline. Select a category to open its page.", "", with_dialog=False)
with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)
print("wrote experiment-version/projects/index.html")

# The bare /experiment-version/ folder falls back to the homepage instead of a 404.
to = "../experiment-version.html"
with open(os.path.join(ROOT, "experiment-version", "index.html"), "w", encoding="utf-8") as f:
    f.write(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url={to}"><link rel="canonical" href="{to}">
<script>location.replace('{to}')</script></head>
<body><p><a href="{to}">Continue to Jason Grant's portfolio</a></p></body></html>
""")
print("wrote folder redirect")
