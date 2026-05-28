from pathlib import Path
import re
root = Path('.')
html_files = list(root.glob('*.html'))
replacements = [
    (re.compile(r'onclick="openDrawer\(\)"'), 'data-action="openDrawer"'),
    (re.compile(r'onclick="closeDrawer\(\)"'), 'data-action="closeDrawer"'),
    (re.compile(r'onclick="doLogout\(\)"'), 'data-action="doLogout"'),
    (re.compile(r'onclick="openBarcode\(\)"'), 'data-action="openBarcode"'),
    (re.compile(r'onclick="closeBarcode\(\)"'), 'data-action="closeBarcode"'),
    (re.compile(r'onclick="searchBarcode\(\)"'), 'data-action="searchBarcode"'),
    (re.compile(r'oninput="filterProducts\(this\.value\)"'), 'data-action="filterProducts" data-target="prod-search"'),
    (re.compile(r'onclick="selectProduct\(([^)]+)\)"'), 'data-action="selectProduct" data-product-id="\1"'),
    (re.compile(r'onclick="return false;"'), ''),
]
for path in html_files:
    text = path.read_text(encoding='utf-8')
    new_text = text
    for patt, repl in replacements:
        new_text = patt.sub(repl, new_text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print('updated', path)
