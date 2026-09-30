"""Report any 6-word run shared between a bank item's Source 3 and its parent insert.
Usage: python scripts/check-verbatim.py <item.ts> <insert.txt>   (inserts live in git-ignored .cache/papers)"""
import re, sys
def words(s): return re.findall(r"[a-z0-9']+", s.lower().replace('’', "'"))
item = open(sys.argv[1], encoding='utf-8').read()
paras = re.search(r"paragraphs:\s*\[(.*?)\]\s*,\s*\}", item, re.S).group(1)
w1 = words(paras); w2 = words(open(sys.argv[2], encoding='utf-8', errors='ignore').read())
grams = {tuple(w2[i:i+6]) for i in range(len(w2)-5)}
hits = sorted({' '.join(w1[i:i+6]) for i in range(len(w1)-5) if tuple(w1[i:i+6]) in grams})
print('\n'.join(hits) if hits else 'OK: no shared 6-word runs')
sys.exit(1 if hits else 0)
