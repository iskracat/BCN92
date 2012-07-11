# -*- coding: utf-8 -*-
import json
import os
from PIL import Image
import xlrd
import re 

URL_PART = 'content/impactes'
BASE_FOLDER = '/var/www/BCN922/%s' % URL_PART
CLASSES = {(230, 230): 'rrcc',
           (110, 230): 'rrc',
           (230, 110): 'rcc',
           (110, 110): 'rc',
           }


def getExistingImage(folder, imagename):
    filename = '%s/%s/%s' % (BASE_FOLDER, folder, imagename)
    url = '%s/%s/%s' % (URL_PART, folder, imagename)
    if os.path.exists(filename + '.jpg'):
        url += '.jpg'
    elif os.path.exists(filename + '.JPG'):
        url += '.JPG'
    elif os.path.exists(filename + '.png'):
        url += '.png'
    elif os.path.exists(filename + '.PNG'):
        url += '.PNG'
    else:
        print 'NOT FOUND %s' % filename
        return None
    return url


def getImageClass(filename):
    image = Image.open(filename)
    try:
        return CLASSES[image.size]
    except:
        print image.size, filename

pins = {u'ESTADI OLIMPIC': 'estadi',
        u'PALAU SANT JORDI': 'palau',
        u'PISCINES PICORNELL': 'picornell',
        u'TORRE CALATRAVA': 'calatrava',
        u'RONDA LITORAL': 'ronda',
        u'PLATGES DE BARCELONA': 'platges',
        u'PORT OLIMPIC': 'portolimpic',
        u'PORT VELL I MOLL DE LA FUSTA': 'portvell',
        u'TORRES MAPFRE': 'torres',
        u'VILA OLIMPICA': 'vila',
        u'SEGON CINTURO': 'cinturo',
        u'TORRE COLLSEROLA': 'collserola',
        }

wb = xlrd.open_workbook('dades.xls')
for sheet in wb.sheets():
    if sheet.name in pins.keys():
    #if sheet.name == 'TORRE COLLSEROLA':
        items = []
        folder = pins[sheet.name]
        savingserie = False
        serie = []
        seriecount = 1
        for i in range(1, sheet.nrows):
            row = sheet.row_values(i)
            if row[0] != '':
                if savingserie and not 'serie' in row[5].lower():
                    savingserie = False
                    thumbname = '%s_ser%d_thu' % (serie[0][0], seriecount)
                    thumbfilename = getExistingImage(folder, thumbname)
                    items.append({'thumb': thumbfilename,
                                  'class': getImageClass(thumbfilename),
                                  'type': 'serie',
                                  'id': '%s_ser_%d' % (folder, seriecount),
                                  'items': [{'image':getExistingImage(folder, '%s_ser%d_%d' % (item[0], seriecount, num + 1)), 'footer':item[1]} for num, item in enumerate(serie)]
                                  })
                    serie = []
                    seriecount += 1

                if not 'serie' in row[5].lower() and not 'VIDEO' in row[0].upper() and not row[0][0] in ['u', 'v']:
                    thumbname = '%s_fot_thu' % row[0]
                    thumbfilename = getExistingImage(folder, thumbname)
                    imagename = '%s_fot' % row[0]
                    imagefilename = getExistingImage(folder, imagename)
                    if thumbfilename:
                        items.append({'thumb': thumbfilename,
                                      'footer': re.search(r'(.*?)\s*\(?\w*\)?$', row[1]).groups(0),
                                      'image': imagefilename,
                                      'class': getImageClass(thumbfilename),
                                      'type': 'single'
                                      })
                if not 'serie' in row[5].lower() and ('VIDEO' in row[0].upper() or row[0][0] in ['u', 'v']):
                    name = row[0].split('/')[0].strip()
                    if name == 'VIDEO':
                        name = row[0].split('/')[1].strip()
                    thumbname = '%s_vid_thu' % name
                    thumbfilename = getExistingImage(folder, thumbname)
                    if thumbfilename:
                        items.append({'thumb': thumbfilename,
                                      'footer': re.search(r'(.*?)\s*\(?\w*\)?$', row[1]).groups(0),
                                      'class': getImageClass(thumbfilename),
                                      'type': 'video',
                                      'url': row[5]
                                      })
                if 'serie' in row[5].lower():
                    savingserie = True
                    serie.append((row[0], re.search(r'(.*?)\s*\(?\w*\)?$', row[1]).groups(0),))

        open('%s/%s/data.json' % (BASE_FOLDER, folder), 'w').write(json.dumps(items))
