# -*- coding: utf-8 -*-
import json

languages = {'ca': 'content/impactes',
             'es': 'es/content/impactes',
             'en': 'en/content/impactes'
            }

sections = [  dict(id="estadi", zone="ANELLA OLÍMPICA", title="Estadi olímpic"),
              dict(id="palau", zone="ANELLA OLÍMPICA", title="Palau Sant Jordi"),
              dict(id="picornell", zone="ANELLA OLÍMPICA", title="Piscines Picornell"),
              dict(id="calatrava", zone="ANELLA OLÍMPICA", title="Torre Calatrava"),
              dict(id="ronda", zone="RONDES", title="Ronda Litoral"),
              dict(id="platges", zone="FRONT MARÍTIM", title="Platjes de Barcelona"),
              dict(id="portolimpic", zone="FRONT MARÍTIM", title="Port olímpic"),
              dict(id="portvell", zone="FRONT MARÍTIM", title="Port Vell"),
              dict(id="torres", zone="FRONT MARÍTIM", title="Torres mapfre"),
              dict(id="vila", zone="VILA OLÍMPICA", title="Vila olímpica"),
              dict(id="cinturo", zone="RONDES", title="Segon cinturó"),
              dict(id="collserola", zone="TORRE DE COLLSEROLA", title="Torre de collserola"),
]


{"full": "images/impactes/calatrava/HOLSA_099.jpg",
 "thumb": "images/impactes/calatrava/HOLSA_099_fot_thu.jpg",
 "footer": "Aixecament de l\u2019estructura de la torre 1991. Autor desconegut (AFB)",
 "image": "images/impactes/calatrava/HOLSA_099_fot.jpg",
 "type": "single",
 "class": "rrcc"}


template_single = """

<div class="item single">
   <h1>%(zone)s</h1>
   <h2>%(title)s</h2>
   dict<a href="%(image)s", title="%(footer)s">
       <img src="%(thumb)s" >
   </a>
   <span class="footer">%(footer)s</span>
</div>

"""

template_serie = """

<div class="item serie">
   <h1>%(zone)s</h1>
   <h2>%(title)s</h2>
   dict<a href="%(image)s", title="%(footer)s">
       <img src="%(thumb)s" >
   </a>
   <span class="footer">%(footer)s</span>
</div>

"""

template_video = """

<div class="item video">
   <h1>%(zone)s</h1>
   <h2>%(title)s</h2>
   dict<a href="%(url)s", title="%(footer)s">
       <img src="%(thumb)s" >
   </a>
   <span class="footer">%(footer)s</span>
</div>

"""

for lang, path in languages.items():
    html = ''
    for section in sections:
         zone = section['zone']
         title = section['title']
         id = section['id']
         impacte = json.loads(open('%s/%s.json' % (path, id)).read())

         for data in impacte:

             if data['type'] == 'single':
                 data['title'] = title
                 data['zone'] = zone
                 html+= template_single % data

             if data['type'] == 'serie':
                 for item in data['items']:
                     item['title'] = title
                     item['zone'] = zone
                     item['thumb'] = data['thumb']
                     html+= template_serie % item

             if data['type'] == 'video':
                 data['title'] = title
                 data['zone'] = zone
                 html+= template_video % data
    open('impactes_%s.html' % lang, 'w').write(html)
