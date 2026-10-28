from pathlib import Path
r=Path('Dino-Dodo-update')
for folder in ['src','native','scripts']:
 for p in (r/folder).rglob('*'):
  if not p.is_file():continue
  try:s=p.read_text(encoding='utf8')
  except:continue
  if '\u00c3' in s or '\u00e2\u20ac' in s or '\u00c2\u00b7' in s:
   print('CHECK',p)
   try:p.write_text(s.encode('cp1252').decode('utf8'),encoding='utf8');print('REPAIRED')
   except:pass
