#!/usr/bin/env python3
"""Temporary visual proof sheet: emit preview JPG as base64 into Actions logs."""
import base64,io
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import sys
ROOT=Path(__file__).resolve().parents[1]
ids=[11,12,13,25,26,27,29,30,31,32,34]
for view in ("whole","center"):
    size=480
    sheet=Image.new("RGB",(size*3,(size+38)*4),(246,246,246))
    d=ImageDraw.Draw(sheet)
    for i,n in enumerate(ids):
        p=ROOT/f"assets/records/imported/{n:03}.jpg"
        with Image.open(p) as im:
            im=im.convert("RGB")
            if view=="center":
                w,h=im.size
                im=im.crop((int(w*.22),int(h*.22),int(w*.78),int(h*.78)))
            im.thumbnail((size,size),Image.Resampling.LANCZOS)
            col,row=i%3,i//3
            x=col*size+(size-im.width)//2
            y=row*(size+38)+30+(size-im.height)//2
            sheet.paste(im,(x,y))
            d.text((col*size+14,row*(size+38)+8),f"RECORD {n:03} / {view}",fill=(0,0,0))
    buf=io.BytesIO()
    sheet.save(buf,format="JPEG",quality=57,optimize=True)
    encoded=base64.b64encode(buf.getvalue()).decode("ascii")
    print(f"LABEL_SHEET_{view.upper()}_START")
    for offset in range(0,len(encoded),1000):print(encoded[offset:offset+1000])
    print(f"LABEL_SHEET_{view.upper()}_END")
    print(f"Sheet {view}: {sheet.width}x{sheet.height}, {len(buf.getvalue())} bytes",file=sys.stderr)
