from pathlib import Path
from io import BytesIO
import json
from PIL import Image
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader
root=Path('/Users/jatinpandey/Antigravity/Sprint')
build=root/'.deck-build'
out=root/'output/presentation/Saksham-AI-Ideate-Proposal.pdf'
manifest=json.loads((build/'manifest.json').read_text())
c=Canvas(str(out),pagesize=(960,540),pageCompression=1)
c.setTitle('Saksham AI - Ideate Proposal')
c.setAuthor('Saksham AI')
c.setSubject('Challenge 5: System Capacity. AI for Foundational Learning Hackathon.')
for i,item in enumerate(manifest,1):
    img=Image.open(build/f'final-renders/slide-{i}.png').convert('RGB')
    data=BytesIO();img.save(data,format='JPEG',quality=94,optimize=True,subsampling=0);data.seek(0)
    c.drawImage(ImageReader(data),0,0,width=960,height=540)
    c.bookmarkPage(f'slide-{i}')
    c.addOutlineEntry(item['title'],f'slide-{i}',level=0)
    urls=item['urls']
    for j,url in enumerate(urls):
        x=178.5+j*(688.5/len(urls));r=x+688.5/len(urls)
        c.linkURL(url,(x,9,r,36),relative=0,thickness=0)
    c.showPage()
c.save()
r=PdfReader(out)
assert len(r.pages)==10
assert out.stat().st_size<5_000_000
print(f'PDF: {len(r.pages)} pages, {out.stat().st_size:,} bytes; source links: '+str(sum(len(p.get('/Annots',[])) for p in r.pages)))
