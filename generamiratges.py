# -*- coding: utf-8 -*-
import re
from PIL import Image

textos = dict(ca = """01 
L: La ronda Litoral al seu pas per Sant Adrià del Besòs. 
A: S2_028_072.jpg / 14 de març de 1992
D: 120626-7382.tif / 26 de juny de 2012
02
L: Front Marítim. Zona del Fòrum, 2004
A:S2_028_066.jpg / 14 de març de 1992
D: 120626-7402.tif / 26 de juny de 2012
03
L: Vista general del Front Marítim. Poblenou - Barceloneta
A: S2_025_018.jpg / 15 de febrer de 1989
D: 120626-7408.tif / 26 de juny de 2012
04
L: La Vila Olímpica
A:S2_026_041.jpg / 16 de maig de 1990
D: 120626-7415.tif / 26 de juny de 2012
05
L: Vista del Front Marítim des del Poblenou a la Zona Fòrum, 2004
A: S2_025_065.jpg / 30 d'octubre de 1989
D:120626-7426.tif / 26 de juny de 2012
06
L: Plaça de les Glòries
A:S2_028_048.jpg / 12 de novembre de 1991
D:120626-7433.tif / 26 de juny de 2012
07
L: Front Marítim. Parc del Poblenou
A:S2_026_016.jpg / 18 de gener de 1990
D:120626-7464.tif / 26 de juny de 2012
08
L: Platja de la Mar Bella
A: S2_028_104.jpg / 14 de març de 1992
D: 120626-7480.tif / 26 de juny de 2012
09
L: Front Marítim. Platges del Poblenou
A: S2_025_046.jpg / 7 de juny de 1989
D:120626-7485.tif / 26 de juny de 2012
10
L: Anella Olímpica de Montjuïc
A:S2_028_104.jpg / 1 d'octubre de 1990
D:120626-7499.tif / 26 de juny de 2012
11
L: El Port Vell i la ronda Litoral al seu pas per la Barceloneta
A: S2_026_043.jpg / 16 de maig de 1990
D: 120626-7512.tif / 26 de juny de 2012
12
L: Front Marítim de Barcelona
A:S2_024_020.jpg / 20 d'octubre de 1988
D:120626-7516.tif / 26 de juny de 2012
13
L: Parc de la Barceloneta
A: S2_028_010.jpg / 12 de novembre de 1991
D:120626-7529.tif / 26 de juny de 2012
14
L: Platges de la Barceloneta
A: S2_026-030.jpg / 16 de maig de 1990
D: 120626-7590.tif / 26 de juny de 2012"""

,es = """01 
L: La ronda Litoral a su paso por Sant Adrià del Besòs 
A: S2_028_072.jpg / 14 de marzo de 1992
D: 120626-7382.tif / 26 de junio de 2012
02
L: Frente marítimo. Zona del Fòrum 2004
A:S2_028_066.jpg / 14 de marzo de 1992
D: 120626-7402.tif / 26 de junio del 2012
03
L: Vista general del frente marítimo. Poblenou-Barceloneta
A: S2_025_018.jpg / 15 de febrero de 1989
D: 120626-7408.tif / 26 de junio del 2012
04
L: La Vila Olímpica
A:S2_026_041.jpg / 16 de mayo de 1990
D: 120626-7415.tif / 26 de junio del 2012
05
L: Vista del frente marítimo desde el Poblenou en la zona Fòrum, 2004
A: S2_025_065.jpg / 30 de octubre de 1989
D:120626-7426.tif / 26 de junio del 2012
06
L: Plaza de las Glòries
A:S2_028_048.jpg / 12 de noviembre de 1991
D:120626-7433.tif / 26 de junio del 2012
07
L: Frente marítimo. Parque del Poblenou
A:S2_026_016.jpg / 18 de enero de 1990
D:120626-7464.tif / 26 de junio del 2012
08
L: Playa de la Mar Bella
A: S2_028_104.jpg / 14 de marzo de 1992
D: 120626-7480.tif / 26 de junio del 2012
09
L: Frente marítimo. Playas del Poblenou
A: S2_025_046.jpg / 7 de junio de 1989
D:120626-7485.tif / 26 de junio del 2012
10
L: Anilla Olímpica de Montjuïc
A:S2_028_104.jpg / 1 de octubre de 1990
D:120626-7499.tif / 26 de junio del 2012
11
L: El Port Vell y la ronda Litoral a su paso por la Barceloneta
A: S2_026_043.jpg / 16 de mayo de 1990
D: 120626-7512.tif / 26 de junio del 2012
12
L: Frente marítimo de Barcelona
A:S2_024_020.jpg / 20 de octubre de 1988
D:120626-7516.tif / 26 de junio del 2012
13
L: Parque de la Barceloneta
A: S2_028_010.jpg / 12 de noviembre de 1991
D:120626-7529.tif / 26 de junio del 2012
14
L: Playas de la Barceloneta
A: S2_026-030.jpg / 16 de mayo de 1990
D: 120626-7590.tif / 26 de junio del 2012"""

,en = """01 
L:The Ronda Litoral on the stretch through Sant Adrià del Besòs 
A: S2_028_072.jpg / 14 March 1992
D: 120626-7382.tif / 26 June 2012
02
L: Seafront. Forum Area 2004
A:S2_028_066.jpg / 14 March 1992
D: 120626-7402.tif / 26 June 2012
03
L: General View of the Seafront. Poble Nou - Barceloneta
A: S2_025_018.jpg / 15 February 1989
D: 120626-7408.tif / 26 June 2012
04
L: The Olympic Village
A:S2_026_041.jpg / 16 May 1990
D: 120626-7415.tif / 26 June 2012
05
L: View of the Seafront from Poble Nou to the Forum Area 2004
A: S2_025_065.jpg / 30 October 1989
D:120626-7426.tif / 26 June 2012
06
L: Plaça de les Glòries
A:S2_028_048.jpg / 12 November 1991
D:120626-7433.tif / 26 June 2012
07
L: Seafront. Poble Nou Park
A:S2_026_016.jpg / 18 January 1990
D:120626-7464.tif / 26 June 2012
08
L:Mar Bella Beach
A: S2_028_104.jpg / 14 March 1992
D: 120626-7480.tif / 26 June 2012
09
L: Seafront. Beaches of Poble Nou
A: S2_025_046.jpg / 7 June 1989
D:120626-7485.tif / 26 June 2012
10
L: Olympic Ring in Montjuïc
A:S2_028_104.jpg / 1 October 1990
D:120626-7499.tif / 26 June 2012
11
L: Port Vell and the Ronda Litoral ring road on the stretch through Barceloneta
A: S2_026_043.jpg / 16 May 1990
D: 120626-7512.tif / 26 June 2012
12
L: Barcelona's Seafront

A:S2_024_020.jpg / 20 October 1988
D:120626-7516.tif / 26 June 2012
13
L: Barceloneta Park
A: S2_028_010.jpg / 12 November 1991
D:120626-7529.tif / 26 June 2012
14
L: Barceloneta Beaches
A: S2_026-030.jpg / 16 May 1990
D: 120626-7590.tif / 26 June 2012""")


NAV_TEMPLATE = """
                      <div class="%(active)snavitem" rel="%(num)s">
                          <a href="#" title="%(title)s"><img src="%(prevfolder)simages/miratges/thumbs/min_miratges_%(num)s.png"></a>
                      </div>
"""


ITEM_TEMPLATE = """
                          <div class="%(active)sitem" id="item-%(num)s"style="margin-left:%(margin)dpx;">
                              <div class="title" style="width:%(width)dpx">        
                                  <a class="avans" href="%(prevfolder)simages/miratges/%(num)s/a.jpg"><img src="%(prevfolder)simg/descarregar_inactiu.png" target="_blank"></a>
                                  <span>%(title)s</span>
                                  <a class="despres" href="%(prevfolder)simages/miratges/%(num)s/b.jpg"><img src="%(prevfolder)simg/descarregar_inactiu.png" target="_blank"></a>
                              </div>
                              <div class="parellaFotos" id="parella-%(num)s">
                                  <div><img alt="before" src="%(prevfolder)simages/miratges/%(num)s/a.jpg" style="width:%(width)dpx;height:%(height)dpx;"></div>
                                  <div><img alt="after" src="%(prevfolder)simages/miratges/%(num)s/b.jpg" style="width:%(width)dpx;height:%(height)dpx;"></div>
                              </div>  
                              <div class="peus" style="width:%(width)dpx">
                                  <span class="avans">%(datea)s</span>
                                  <span class="despres">%(dateb)s</span>
                              </div>
                          </div>  <!-- item -->
"""


PARTS = ('num', 'title', 'datea', 'dateb')


def getImageSize(filename):
    image = Image.open(filename)
    w, h = image.size
    return w, h

#CA

navs = ''
items = ''

for language in ['ca', 'es', 'en']:
    navs = ''
    items = ''

    langfolder = language in ['en', 'es'] and language + '/' or ''
    prevfolder = language in ['en', 'es'] and '../' or ''
    for item in re.findall(r'(\d{2})\s*\nL:\s*(.*?)\nA:\s*.*?\s\/\s(.*?)\nD:\s*.*?\s\/\s(.*?)(\n|$)', textos[language], re.MULTILINE | re.DOTALL):
        item_values = dict(zip(PARTS, item[:-1]))
        width, height = getImageSize('images/miratges/%(num)s/a.jpg' % item_values)
        item_values['width'] = width
        item_values['height'] = height
        item_values['margin'] = width / 2
        item_values['active'] = item_values['num'] == '01' and 'active ' or ''
        item_values['prevfolder'] = prevfolder
        navs += NAV_TEMPLATE % item_values
        items += ITEM_TEMPLATE % item_values


    html = open(langfolder + 'content/miratges/index.html').read()
    match = re.search(r'^(.*?)(<!-- ITEMS SLOT -->\s*\n)(.*?)(\n\s*<!-- END ITEMS SLOT -->)(.*?)(<!-- START NAV ITEMS -->\s*\n)(.*?)(\n\s*<!-- END NAV ITEMS -->)(.*)', html, re.DOTALL | re.MULTILINE)
    html2 = list(match.groups())
    html2[2] = items
    html2[6] = navs
    open(langfolder + 'content/miratges/index.html', 'w').write(''.join(html2))
