#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
from xml.etree import ElementTree as ET
import json, os, struct, subprocess, sys
ROOT=Path('.').resolve(); SITE='https://enidpublicrecord.com'; FEED_TAG_HREF='/feed.xml'
errors=[]; warnings=[]; passes=[]
def error(x): errors.append(x)
def warn(x): warnings.append(x)
def ok(x): passes.append(x)
class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.title=''; self._in_title=False; self.metas=[]; self.links=[]; self.hrefs=[]; self.assets=[]; self._jsonld=False; self._jsonbuf=[]; self.jsonlds=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); tag=tag.lower()
        if tag=='title': self._in_title=True
        if tag=='meta': self.metas.append(a)
        if tag=='link':
            self.links.append(a); href=a.get('href'); rel=a.get('rel','')
            if href and ('stylesheet' in rel or 'icon' in rel): self.assets.append(href)
        if tag=='a' and a.get('href'): self.hrefs.append(a['href'])
        if tag in ('img','source','audio','script') and a.get('src'): self.assets.append(a['src'])
        if tag=='script' and a.get('type')=='application/ld+json': self._jsonld=True; self._jsonbuf=[]
    def handle_endtag(self,tag):
        if tag.lower()=='title': self._in_title=False
        if tag.lower()=='script' and self._jsonld:
            self.jsonlds.append(''.join(self._jsonbuf).strip()); self._jsonld=False; self._jsonbuf=[]
    def handle_data(self,data):
        if self._in_title: self.title+=data
        if self._jsonld: self._jsonbuf.append(data)
def parse_page(path):
    p=PageParser(); p.feed(path.read_text(encoding='utf-8')); return p
def meta_value(p,name=None,prop=None):
    for m in p.metas:
        if name and m.get('name','').lower()==name.lower(): return m.get('content','').strip()
        if prop and m.get('property','').lower()==prop.lower(): return m.get('content','').strip()
    return ''
def link_rel(p,rel,type_value=None):
    for l in p.links:
        rels=set(l.get('rel','').lower().split())
        if rel in rels and (type_value is None or l.get('type','').lower()==type_value.lower()): return l.get('href','')
    return ''
def canonical_for_file(rel):
    s=rel.as_posix()
    if s=='index.html': return SITE+'/'
    if s.endswith('/index.html'): return SITE+'/'+s[:-10]
    return SITE+'/'+s
def url_to_local(url_or_path,base_file=None):
    parsed=urlparse(url_or_path)
    if parsed.scheme and parsed.netloc:
        if parsed.netloc!='enidpublicrecord.com': return None
        path=parsed.path
    else:
        path=parsed.path
        if not path.startswith('/'):
            base=base_file.parent if base_file else ROOT; target=(base/unquote(path)).resolve()
            try: target.relative_to(ROOT)
            except Exception: return None
            return target
    path=unquote(path)
    if path in ('','/'): return ROOT/'index.html'
    target=ROOT/path.lstrip('/')
    if path.endswith('/'): return target/'index.html'
    if target.exists(): return target
    if target.suffix=='':
        idx=target/'index.html'
        if idx.exists(): return idx
    return target
def png_dimensions(path):
    data=path.read_bytes()[:24]
    if len(data)>=24 and data[:8]==b'\x89PNG\r\n\x1a\n': return struct.unpack('>II',data[16:24])
    return None
# sitemap
try:
    sm=ET.parse(ROOT/'sitemap.xml').getroot(); ns={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9'}; locs=[e.text.strip() for e in sm.findall('.//sm:loc',ns)]
    if len(locs)!=len(set(locs)): error('sitemap.xml contains duplicate URLs')
    if not locs: error('sitemap.xml contains no URLs')
    else: ok(f'sitemap.xml parsed: {len(locs)} URLs')
except Exception as exc: error(f'sitemap.xml parse failure: {exc}'); locs=[]
# image sitemap
try:
    imroot=ET.parse(ROOT/'image-sitemap.xml').getroot(); ins={'sm':'http://www.sitemaps.org/schemas/sitemap/0.9','image':'http://www.google.com/schemas/sitemap-image/1.1'}; count=0
    for node in imroot.findall('sm:url',ins):
        loc=node.find('sm:loc',ins); imgs=node.findall('image:image/image:loc',ins)
        if loc is None or not imgs: error('image-sitemap.xml has incomplete entry'); continue
        lp=url_to_local(loc.text.strip())
        if lp is None or not lp.exists(): error(f'image sitemap page missing locally: {loc.text.strip()}')
        for im in imgs:
            count+=1; li=url_to_local(im.text.strip())
            if li is None or not li.exists(): error(f'image sitemap image missing locally: {im.text.strip()}')
    if count: ok(f'image-sitemap.xml parsed: {count} images')
    else: error('image-sitemap.xml contains no images')
except Exception as exc: error(f'image-sitemap.xml parse failure: {exc}')
# feed
feed_urls=set()
try:
    fr=ET.parse(ROOT/'feed.xml').getroot(); ch=fr.find('channel')
    if ch is None: error('feed.xml is not RSS 2.0 with a channel')
    else:
        atom='{http://www.w3.org/2005/Atom}'; links=ch.findall(atom+'link')
        if not any(x.attrib.get('rel')=='self' and x.attrib.get('href')==SITE+'/feed.xml' for x in links): error('feed.xml missing atom rel=self')
        if not any(x.attrib.get('rel')=='hub' and x.attrib.get('href')=='https://pubsubhubbub.appspot.com/' for x in links): error('feed.xml missing WebSub hub discovery')
        for item in ch.findall('item'):
            link=(item.findtext('link') or '').strip(); guid=(item.findtext('guid') or '').strip()
            if not link or link!=guid: error('RSS item link/GUID missing or inconsistent'); continue
            feed_urls.add(link); lp=url_to_local(link)
            if lp is None or not lp.exists(): error(f'RSS item missing locally: {link}')
        if feed_urls: ok(f'feed.xml parsed: {len(feed_urls)} items with WebSub discovery')
        else: error('feed.xml contains no items')
except Exception as exc: error(f'feed.xml parse failure: {exc}')
robots=(ROOT/'robots.txt').read_text(encoding='utf-8') if (ROOT/'robots.txt').exists() else ''
for req in ['Sitemap: https://enidpublicrecord.com/sitemap.xml','Sitemap: https://enidpublicrecord.com/image-sitemap.xml','Sitemap: https://enidpublicrecord.com/feed.xml']:
    if req not in robots: error(f'robots.txt missing: {req}')
ok('robots.txt discovery declarations checked')
# HTML SEO/internal assets
parsed_pages={}
for url in locs:
    local=url_to_local(url)
    if local is None or not local.exists(): error(f'sitemap URL missing locally: {url}'); continue
    if local.suffix.lower()!='.html': continue
    rel=local.relative_to(ROOT); p=parse_page(local); parsed_pages[rel.as_posix()]=p
    expected=canonical_for_file(rel); canon=link_rel(p,'canonical')
    if canon!=expected: error(f'{rel}: canonical {canon!r}, expected {expected!r}')
    if not p.title.strip(): error(f'{rel}: missing title')
    if not meta_value(p,name='description'): error(f'{rel}: missing meta description')
    robots_meta=meta_value(p,name='robots').lower()
    if 'noindex' in robots_meta: error(f'{rel}: contains noindex')
    if not robots_meta: warn(f'{rel}: no explicit meta robots')
    for prop in ('og:title','og:description','og:image'):
        if not meta_value(p,prop=prop): error(f'{rel}: missing {prop}')
    for name in ('twitter:card','twitter:title','twitter:description','twitter:image'):
        if not meta_value(p,name=name): error(f'{rel}: missing {name}')
    if link_rel(p,'alternate','application/rss+xml')!=FEED_TAG_HREF: error(f'{rel}: missing RSS auto-discovery')
    if not p.jsonlds: error(f'{rel}: no JSON-LD')
    for n,raw in enumerate(p.jsonlds,1):
        try: json.loads(raw)
        except Exception as exc: error(f'{rel}: JSON-LD block {n} invalid: {exc}')
    og=meta_value(p,prop='og:image'); local_og=url_to_local(og)
    if local_og is None or not local_og.exists(): error(f'{rel}: OG image missing: {og}')
    elif local_og.suffix.lower()=='.png' and local_og.name.startswith(('social-share','social_share')):
        dims=png_dimensions(local_og)
        if dims!=(1200,630): error(f'{rel}: social share image {dims}, expected 1200x630')
    for href in p.hrefs:
        if href.startswith(('#','mailto:','tel:','javascript:')): continue
        parsed=urlparse(href)
        if parsed.scheme and parsed.netloc and parsed.netloc!='enidpublicrecord.com': continue
        target=url_to_local(href,local)
        if target is not None and not target.exists(): error(f'{rel}: broken internal link {href}')
    for src in p.assets:
        if src.startswith(('data:','http://','https://','//')):
            parsed=urlparse(src)
            if parsed.netloc!='enidpublicrecord.com': continue
        target=url_to_local(src,local)
        if target is not None and not target.exists(): error(f'{rel}: missing local asset {src}')
if parsed_pages: ok(f'HTML SEO/link audit parsed {len(parsed_pages)} sitemap pages')
# permanent Water Story gate
stale=['Coming August 21','Part 8 publishes Aug.','Preview Part ','NEXT — PART','The daily series ends here','New Water Story chapters, source documents and updates are posted throughout the series.']
wd=ROOT/'stories/enid-water-story'
for path in sorted(wd.glob('*.html')):
    text=path.read_text(encoding='utf-8')
    for phrase in stale:
        if phrase in text: error(f'{path.relative_to(ROOT)}: stale release language {phrase!r}')
for i in range(1,9):
    p=wd/f'part-{i:02d}.html'; text=p.read_text(encoding='utf-8')
    if 'Published ' not in text or 'Updated Aug. 21, 2026' not in text: error(f'{p.relative_to(ROOT)}: missing publication/update record')
ok('Water Story permanent-edition language gate checked')
# changed Article pages must be in RSS
before=os.environ.get('BEFORE_SHA',''); after=os.environ.get('AFTER_SHA','')
if before and after and set(before)!={'0'}:
    try:
        diff=subprocess.check_output(['git','diff','--name-status',before,after],text=True); changed=set()
        for line in diff.splitlines():
            f=line.split('\t'); status=f[0] if f else ''; candidates=f[1:3] if status.startswith(('R','C')) else f[1:2]
            for name in candidates:
                if name.endswith('.html') and Path(name).exists(): changed.add(name)
        for name in sorted(changed):
            p=parsed_pages.get(name)
            if not p: continue
            is_article=False
            for raw in p.jsonlds:
                try: obj=json.loads(raw)
                except Exception: continue
                if obj.get('@type')=='Article': is_article=True
                if isinstance(obj,dict) and any(isinstance(n,dict) and n.get('@type')=='Article' for n in obj.get('@graph',[])): is_article=True
            if is_article:
                url=canonical_for_file(Path(name))
                if url not in feed_urls: error(f'{name}: changed Article not represented in feed.xml')
        if changed: ok('Changed-article feed coverage checked')
    except Exception as exc: warn(f'Could not check changed-article feed coverage: {exc}')
summary=['# EPR Site Health','',f"**Result:** {'PASS' if not errors else 'FAIL'}",f'**Checks passed:** {len(passes)}',f'**Warnings:** {len(warnings)}',f'**Errors:** {len(errors)}','']
if errors: summary+=['## Errors']+[f'- {x}' for x in errors]+['']
if warnings: summary+=['## Warnings']+[f'- {x}' for x in warnings]+['']
summary+=['## Passed']+[f'- {x}' for x in passes]
out='\n'.join(summary)+'\n'; print(out)
sp=os.environ.get('GITHUB_STEP_SUMMARY')
if sp:
    with open(sp,'a',encoding='utf-8') as fh: fh.write(out)
if errors: sys.exit(1)
