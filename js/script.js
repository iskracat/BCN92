/* Author:

 Iskra

*/


$(document).ready( function() {

    // Accordion fold/unfold behaviour

    $('.accordion-heading').on('click', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var sectionGroup = $(this).closest('.accordion-group') 
        var sectionBody = $(sectionGroup).find('.accordion-body')
        var sectionInner = $(sectionBody).find('.accordion-inner')

        // Save visibility status of the clicked section, toggle it and set classes        
        var visible = sectionBody.hasClass('in')
        var currentId = $(sectionGroup).attr('id')
        var prevId = $(sectionGroup).prev().attr('id')

        // Re-set section sizes in order to adapt to header size changes
        $('.accordion-inner').css({height:getAvailableSize(false, currentId=='impactes')})

        sectionBody.collapse('toggle')
        $(sectionGroup).toggleClass('visible')

        var content_url = $(sectionGroup).find('.accordion-toggle').attr('href')
        var loader = $(sectionGroup).find('.loader')

        // only if we are about to show the clicked section
        if (!visible) {
            loader.show(0, function(event) {
              // if it's already loaded just hide the loading indicator
              if (__VOBRES.loaded[currentId]) {
                  console.log('already loaded')
                  loader.hide()
              // otherwise load and parse the content and set a loaded mark on this section
              } else {
                  $.get(content_url, function (data) {
                      // inject only contents inside selector #content
                      filtered = $(data).filter('#content').html()
                      sectionInner.html(filtered)
                      loader.hide()
                      __VOBRES.loaded[currentId] = true
                      if (currentId=='impactes') {
                        setTimeout(recalculatePinPositions, 300)
                      }
                  }, 'html' )
              }
            })
        }
        // make sure loader gets hidden
        loader.hide()


        // If we were hidden, hide all visible sections but current
        var sections = $(sectionGroup).siblings()
        for (i=0;i<sections.length;i++) {
           var sibSectionBody = $(sections[i]).find('.accordion-body')
           var sibSectionInner = $(sibSectionBody).find('.accordion-inner')
           if (sibSectionBody.hasClass('in')) {
               $(sibSectionBody).collapse('hide') 
               $(sections[i]).toggleClass('visible', false)
           } else {
               // if section is hidden. clicked section was hidden, 
               // and we are looking at the clicked section's prev section,
               // Show it !!
               var sibId = $(sections[i]).attr('id')
               if (sibId==prevId && visible) {
                   // Re-set section sizes in order toa dapt to header size changes
                   $('.accordion-inner').css({height:getAvailableSize(prevId=='home', prevId=='impactes')})

                   $(sibSectionBody).collapse('show') 
                   $(sections[i]).toggleClass('visible', true)

                   // Load the content of the prev section if it's not loaded 
                   // (same as before with a diferent target section)
                   var sectionLoader = $(sections[i]).find('.loader')
                   var sectionContent_url = $(sections[i]).find('.accordion-toggle').attr('href')
                   sectionLoader.show(0, function(event) {
                       if (__VOBRES.loaded[sibId]) {
                            sectionLoader.hide()
                       } else {
                            $.get(sectionContent_url, function (data) {
                                // inject only contents inside selector  #content
                                filtered = $(data).filter('#content').html()
                                sibSectionInner.html(filtered)
                                sectionLoader.hide()
                                __VOBRES.loaded[sibId] = true
                                if (prevId=='impactes') {
                                  setTimeout(recalculatePinPositions, 300)
                                }                                
                            }, 'html' )
                       }
                   // make sure loader gets hidden
                   sectionLoader.hide()
                   })
               }
           }
        }

        // Set marker class "athome", to show that home become visible
        var homevisible = $('#home').hasClass('visible')
        $('#accordion2').toggleClass('athome', homevisible)

    })

    // Miratges carousel navigation behaviour

    $('#collapseMiratges').on('click', '.navitem',  function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        number = parseInt($(this).attr('rel'))
        $('#miratgesCarousel').carousel(number)
    })

    // Navigate to next impacte
    $('#impactesnav .forward').on('click', function() {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        atcarousel = $('#map').hasClass('dissolve')

        // If we are viewing the map, hide it and load the first item of the carousel
        // Carousel will be at index 0, either beacause it's the first time, or 
        // beacause we returned to map, which resets position
        if (!atcarousel) {
            $('#bigone').toggleClass('dissolve', false)        
            $('#map').toggleClass('dissolve', true)
            $('#impactesnav .mapa').toggleClass('active', true)            
            loadImpactesPage('estadi')
        }
        // Otherwise, we are at the carousel, slide to next
        else {
            // Search the active carousel item
            position = $('#impactesCarousel .active.item').index()
            // if we are not in the last item
            if (position < 11) {
                // get the page name and load it, then position carousel
                page = $($('#impactesCarousel .item').get(position+1)).attr('id')
                loadImpactesPage(page)
                $('#impactesCarousel').carousel(position+1)
            }
            $('#impactesnav .back').toggleClass('active', position+1>0)
            $('#impactesnav .forward').toggleClass('active', position+1<11)
        }
    })



    // Navigate to previous impacte
    $('#impactesnav .back').on('click', function() {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        // Search the active carousel item
        position = $('#impactesCarousel .active.item').index()
        // if we are not in the last item
        if (position > 0 ) {
            // get the page name and load it, then position carousel
            page = $($('#impactesCarousel .item').get(position-1)).attr('id')
            loadImpactesPage(page)
            $('#impactesCarousel').carousel(position-1)
        }
        $('#impactesnav .back').toggleClass('active', position-1>0)
        $('#impactesnav .forward').toggleClass('active', position-1<11)

    })

    // Navigate to main map
    $('#impactesnav .mapa').on('click', function() {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        $(this).toggleClass('active', false)
        $('#impactesnav .back').toggleClass('active', false)
        $('#impactesnav .forward').toggleClass('active', true)        
        $('#bigone').toggleClass('dissolve', true)        
        $('#map').toggleClass('dissolve', false)
        setTimeout(function() {$('#impactesCarousel').carousel(0)}, 1000)
        $('#impactes .accordion-toggle h3').text('Les petjades de la transformació')


    })



    // Go to impacte
    $('#map').on('click', '.pin',  function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        var page = $(this).find('a').attr('href')
        var position = $(this).index()        
        $('#impactesCarousel').carousel(position)
        setTimeout(function () {
        $('#impactesnav .back').toggleClass('active', position>0)
        $('#impactesnav .forward').toggleClass('active', position<11)
        $('#impactesnav .mapa').toggleClass('active', true)
        $('#map').toggleClass('dissolve', true)
        $('#bigone').toggleClass('dissolve', false)        
        loadImpactesPage(page)
        }, 200)
    })

    $(window).resize(function () {
        var athome = $('#accordion2').hasClass('athome')
        var atimpactes = $('#impactes').hasClass('visible')
        $('.accordion-inner').css({height:getAvailableSize(athome, atimpactes)})
        recalculatePinPositions()

    })

    __VOBRES = {loaded: {},
                pins :{ estadi:      {w:466, h:534, pop:'right',  title:'Estadi olímpic'},                    
                        palau:       {w:437, h:532, pop:'bottom', title:'Palau Sant Jordi'},
                        picornell:   {w:457, h:502, pop:'top',    title:'Piscines Picornell'},
                        calatrava:   {w:426, h:495, pop:'left',   title:'Torre Calatrava'},
                        ronda:       {w:372, h:547, pop:'left',   title:'Ronda Litoral'},
                        platges:     {w:768, h:574, pop:'right',  title:'Platjes de Barcelona'},
                        portolimpic: {w:652, h:575, pop:'left',   title:'Port olímpic'},
                        portvell:    {w:584, h:553, pop:'top',    title:'Port Vell'},
                        torres:      {w:669, h:542, pop:'top',    title:'Torres mapfre'},
                        vila:        {w:690, h:560, pop:'right',  title:'Vila olímpica'},
                        cinturo:     {w:621, h:277, pop:'left',   title:'Segon cinturó'},
                        collserola:  {w:553, h:203, pop:'bottom', title:'Torre de collserola'},
                      }
               }

    // instantiate pin popovers
    var pinnames = ['estadi','palau' ,'picornell' ,'calatrava' ,'ronda' ,'platges' ,'portolimpic' ,'portvell' ,'torres' ,'vila' ,'cinturo' ,'collserola']
    for (p=0;p<pinnames.length;p++) {
        var pin = pinnames[p]
        var options = {     title: __VOBRES.pins[pin]['title'],
                        placement: __VOBRES.pins[pin]['pop']
                       }
        $('.pin#'+pin).popover(options)
    }

    // resize active section to remaining viewport size
    $('.accordion-inner').css({height:getAvailableSize(true, false)})



}) // End jQuery ready wrapper


function recalculatePinPositions() {
    var pins = $('#map .pin')
    for (p=0;p<pins.length;p++) {
        recalculatePinPosition($(pins[p]).attr('id'))    
    }
    
}

function recalculatePinPosition(pin) {
    var section = { w:$('#impactes #map').width(),
                    h:$('#impactes #map').height() }
    var image = { w:1170, h:796 }

    // calculate the real height of the image as if not were
    // overflowed by section size constrains, based on the proportion
    // of the original image size
    var real_section_height = section.w / (image.w / image.h) 

    // calculate the amount of pixels hidden in each side of the image (top & bottom)
    var overflowed_image_size_margin = ( real_section_height - section.h ) / 2 

    // positions relative to top-left of entire image,
    // calculated as if the image was entirely visible
    // subsctract margin from height to take the overflowed part of the image into account
    var w = Math.floor((__VOBRES.pins[pin].w * section.w) / image.w)
    var h = Math.floor((__VOBRES.pins[pin].h * real_section_height) / image.h - overflowed_image_size_margin)


    // reposition pin counting with pin size
    //$('#'+pin).css({top:h, left:w})
    $('#'+pin+'.pin').css({top:h-36, left:w-14})


}



function getAvailableSize(athome, atimpactes) {
    var total = 0
    var headers_at_home = 262
    var headers_at_sections = 170

    //216

    // Add the navbar
    total += $('.navbar').outerHeight()
    // Add the section headers
    if (athome) {total += headers_at_home}
    else  {total += headers_at_sections}  

    if (atimpactes) {total += 13}
    
    // Calculate available size by substracting occuped from viewport size
    window_height = $(window).height()
    available = window_height - total
    return available
}


function loadImpactesPage(page) {
    $.get('content/impactes/'+page+'/data.json', function(data) {
        var available = data
        var numi = available.length
        var container = $('#impactes .carousel-inner')
        var pagesize = getAvailableSize(false,true)-30
        var pagina = $(container).find('#'+page+' .pagina')
        pagina.css({height:pagesize})
        maxcols = Math.floor(container.width() / 120)
        maxrows = Math.floor(pagesize / 120)

        //maxcols = 5
        //maxrows = 6

        // Generate tile map and fill with zeroes
        map = []
        for (i=0;i<maxrows;i++) {
            map[i] = []
        }
        for (i=0;i<numi;i++) {
            var impacte = data[i]
            var pos = getAvailablePos(impacte.class)
            if (impacte.type=='single') pagina.append('<div class="impacte '+impacte.type+' '+impacte.class+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a href="'+impacte.image+'" title="'+impacte.footer+'"><img src="'+impacte.thumb+'"></a><i class="emblem"></i></div>')
            if (impacte.type=='video') pagina.append('<div class="impacte '+impacte.type+' '+impacte.class+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a rel="media-gallery" href="http://youtu.be/QFAAI0NZz-w" title="'+impacte.footer+'"><img src="'+impacte.thumb+'"></a><i class="emblem"></i></div>')
            if (impacte.type=='serie') {
                var serielinks = ''
                for (l=1;l<impacte.items.length;l++) {
                    serielinks += '<a data-fancybox-group="'+impacte.id+'" href="'+impacte.items[l].image+'" title="'+impacte.items[l].footer+'"></a>'
                }

                pagina.append('<div class="impacte '+impacte.type+' '+impacte.class+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a data-fancybox-group="'+impacte.id+'" href="'+impacte.items[0].image+'" title="'+impacte.items[0].footer+'"><img src="'+impacte.thumb+'"></a>'+serielinks+'<i class="emblem"></i></div>')            
            }  
        }

       $("#"+page+" .impacte.single a").fancybox({ helpers : { title : { type : 'inside' }, overlay : { css: {opacity:0.8}} } });
       $("#"+page+" .impacte.video a").fancybox({ helpers : { media: {}, title : { type : 'inside' }, overlay : { css: {opacity:0.8}} } });
       $("#"+page+" .impacte.serie a").fancybox({ prevEffect: 'elastic', nextEffect: 'elastic', helpers : { thumbs: { width: 50, height:50}, title : { type : 'inside' }, overlay : { css: {opacity:0.8}} } });

    }, 'json')
    $('#impactes .accordion-toggle h3').text(__VOBRES.pins[page]['title'])
}

/* 
 * Main entrypoint iterated to place each image in the layout
 */

function getAvailablePos(cls) {

    // first of all, search if tile fits in any hole
    last = searchLeftMostHoleFor(cls)
    if (last) {
         a = 0
    // it there is no suitable hole, proceed with the base algorithm
    } else {
        last = getLastPos(cls)  
    }
    
    // Mark tile's occupied space
    fillLastPos(cls, last)

    // Return position mapped to real spacing
    return {r:last.r*120, c:last.c*120}
    
}

/*
 * Tries to place a tile in a new position near the top. This will happen
 * The first time and every time that there is no hole or trailing space to fill.
 */

function getLastPos(cls) {
    // search first available col in first row
    var row = 0
    var row_cols = map[row].length  
    if (row_cols==0) {
        var last = 0
    }
    else {
        var last = row_cols
    }

    return {r:row, c:last}
}

/* 
 * Fills one position with a `1`. Takes care to left-zero-padding if a hole
 * has been created, and also if we are overwriting (filling a hole) or creating
 */

function fillPos(r, c) {

    // if the position we try to fill doesn't exists, we are filling a hole
    if (c<map[r].length) {
        map[r][c] = 1
    } else {
        // otherwise we are creating a new position, that may create a hole
        // so we fill zeroes at left
        while (map[r].length<c)
            map[r].push(0)
        //and fill current tile position at last
        map[r].push(1)
    }
}

/*
 * Fills with ones all the positions defined by class `cls` starting
 * at position pos
 */

function fillLastPos(cls, pos) {
  // Always fill the topleft position

  fillPos(pos.r, pos.c, 1)
  if (cls=='rcc' || cls=='rrcc')  { fillPos(pos.r, pos.c+1, 1) }
  if (cls=='rrc' || cls =='rrcc') { fillPos(pos.r+1, pos.c, 1) } 
  if (cls=='rrcc')                { fillPos(pos.r+1, pos.c+1, 1) }

  alignHoleMarkers()
}

/*
 * Iterates through all the occuped positions to pad with
 * zeroes all unused positions to align with longest row.
 * This allows to detect `empty` zones as holes and fill them.
 */

function alignHoleMarkers() {

  // get longest row
  var longest = 0
  for (r=0;r<maxrows;r++) {
      if (map[r].length>longest) longest=map[r].length
  }


  // fill zeroes to match column count on longest row
  for (r=0;r<maxrows;r++) {
      while (map[r].length<longest)
          map[r].push(0)
  }

}

/*
 * Checks if the last found hole at position `pos` is more at left than
 * the one at `r,c`. Default to true if first or in same column.
*/

function isLefterThan(pos, r, c) {
    // it we have a position, test if it's more at the left than r,c
    if (pos) {
        if (c<pos.c) {
            return true
        } else {
            return false
        }
    // Otherwise if we haven't any, assume it's the firstm --> it's the leftmost
    } else {
        return true  
    }
}


/*
 *  Looks for any hole that has been left behind, and chooses the one
 * that is nearest to the 0 column 0
 */

function searchLeftMostHoleFor(cls) {
    var cont = true
    var pos = false
    for (sr=0;sr<maxrows;sr++) {
        var crow = map[sr]
        for (sc=0;sc<crow.length;sc++) {
            if (crow[sc] == 0) {
                if (tileFits(cls, sr, sc)) {
                    if (isLefterThan(pos, sr, sc)) {
                        pos = {r:sr, c:sc}
                    }
                }
            }
        }
    }

    if (pos) {
        return pos
    } else {
        return false
    }

}

/*
 *  Checks whether a certain tile fits in a a hole at point (t,c)
 *  depending on its class, and without violating boundaries
 */
    
function tileFits(cls, r, c) {
    
    fits = isAvailable(r,c)                                                   // Check 0,0    
    if (cls=='rrcc' || cls=='rcc')  { fits = fits && isAvailable(r,c+1) }     // Check 0,1
    if (cls=='rrcc' || cls=='rrc')  { fits = fits && isAvailable(r+1,c) }     // Check 1,0
    if (cls=='rrcc')                { fits = fits && isAvailable(r+1,c+1) }   // Check 1,1

    return fits
}

/*
 *  Checks whether a position in map is available to use
 */

function isAvailable(r, c) {

    // if point is outside boudaries, it's not valid
    if (r>=maxrows || c>=maxcols) { return false}

    // otherwise, check it its a valid position, either existing
    // which can be a available if it's a hole (0) or already filled (1)
    if (c<map[r].length) {
        return map[r][c] == 0
    // if it's a non-existing position whithin boudaries, is valid
    } else {
        return true
    }

}