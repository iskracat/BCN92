import json
import os
from PIL import Image

CLASSES = {(230, 230): 'rrcc',
           (110, 230): 'rrc',
           (230, 110): 'rcc',
           (110, 110): 'rc',
           }


def getImageClass(folder, imagename):
    filename = '%s/%s' % (folder, imagename)
    image = Image.open(filename)
    try:
        return CLASSES[image.size]
    except:
        print image.size, filename


folders = [d for d in os.listdir('.') if os.path.isdir(d)]

for folder in folders:
    thumbnails = [{'image':a, 'class':getImageClass(folder, a)} for a in os.listdir(folder) if 'thu' in a]
    open('%s/data.json' % folder, 'w').write(json.dumps(thumbnails))
