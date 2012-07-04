/* Author:

 Iskra

*/


$(document).ready( function() {

    // Accordion fold/unfold behaviour

    $('.accordion-heading').on('click', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        // Re-set section sizes in order to adapt to header size changes
        $('.accordion-inner').css({height:getAvailableSize(false)})

        var sectionGroup = $(this).closest('.accordion-group') 
        var sectionBody = $(sectionGroup).find('.accordion-body')
        var sectionInner = $(sectionBody).find('.accordion-inner')

        // Save visibility status of the clicked section, toggle it and set classes        
        var visible = sectionBody.hasClass('in')
        var currentId = $(sectionGroup).attr('id')
        var prevId = $(sectionGroup).prev().attr('id')
        sectionBody.collapse('toggle')
        $(sectionGroup).toggleClass('visible')

        var content_url = $(sectionGroup).find('.accordion-toggle').attr('href')
        var loader = $(sectionGroup).find('.loader')

        // only if we are about to show the clicked section
        if (!visible) {
            loader.show(0, function() {
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
                        setTimeout(recalculatePinPositions, 500)
                        loadImpactesMenu()
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
                   $('.accordion-inner').css({height:getAvailableSize(prevId=='home')})

                   $(sibSectionBody).collapse('show') 
                   $(sections[i]).toggleClass('visible', true)

                   // Load the content of the prev section if it's not loaded 
                   // (same as before with a diferent target section)
                   var sectionLoader = $(sections[i]).find('.loader')
                   var sectionContent_url = $(sections[i]).find('.accordion-toggle').attr('href')
                   sectionLoader.show(0, function() {
                       if (__VOBRES.loaded[sibId]) {
                            sectionLoader.hide()
                       } else {
                            $.get(sectionContent_url, function (data) {
                                // inject only contents inside selector  #content
                                filtered = $(data).filter('#content').html()
                                sibSectionInner.html(filtered)
                                sectionLoader.hide()
                                __VOBRES.loaded[sibId] = true
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

    $('#collapseImpactes').on('click', '.pin',  function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        page = $(this).find('a').attr('href')
        loadImpactesPage(page)
    })

    $(window).resize(function () {
        athome = $('#accordion2').hasClass('athome')
        $('.accordion-inner').css({height:getAvailableSize(athome)})
        recalculatePinPositions()

    })

    __VOBRES = {loaded: {},
                pins :{ p1:  {w:553, h:203},       // Torre de collserola
                        p2:  {w:621, h:277},       // Segon cinturó                  
                        p3:  {w:372, h:547},       // Ronda Litoral 
                        p4:  {w:426, h:498},       // Anella 1
                        p5:  {w:453, h:502},       // Anella 2
                        p6:  {w:435, h:529},       // Anella 3
                        p7:  {w:469, h:522},       // Anella 4
                        p8:  {w:584, h:553},       // Port ?
                        p9:  {w:652, h:575},       // Vila olímpica 
                        p10: {w:669, h:542},       // Vila olímpica 
                        p11: {w:690, h:560},       // Vila olímpica 
                        p12: {w:768, h:574},       // Front marítim
                      }
               }

    // resize active section to remaining viewport size
    $('.accordion-inner').css({height:getAvailableSize(true)})



}) // End jQuery ready wrapper


function recalculatePinPositions() {
    recalculatePinPosition('p1')
    recalculatePinPosition('p2')
    recalculatePinPosition('p3')
    recalculatePinPosition('p4')
    recalculatePinPosition('p5')
    recalculatePinPosition('p6')
    recalculatePinPosition('p7')
    recalculatePinPosition('p8')
    recalculatePinPosition('p9')
    recalculatePinPosition('p10')
    recalculatePinPosition('p11')
    recalculatePinPosition('p12')
}

function recalculatePinPosition(pin) {
    var section = { w:$('#impactes').width(),
                    h:$('#impactes').height() }
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
    $('#'+pin).css({top:h+43, left:w-17})


}


function getAvailableSize(athome) {
    var total = 0
    var headers_at_home = 391
    var headers_at_sections = 216

    // Add the navbar
    total += $('.navbar').outerHeight()
    // Add the section headers
    if (athome) {total += headers_at_home}
    else {total += headers_at_sections}  
    
    // Calculate available size by substracting occuped from viewport size
    window_height = $(window).height()
    available = window_height - total
    return available
}


function loadImpactesMenu() {
     $.get('content/impactes/index.html', function(data) {

     })

}

function loadImpactesPage(page) {
    $.get('content/impactes/'+page+'/data.json', function(data) {
        var available = data
        var numi = available.length
        var pagina = $('#impactes #'+page+' .pagina')
        maxcols = Math.floor(pagina.width() / 120)
        maxrows = Math.floor(pagina.height() / 120)

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
            pagina.append('<div class="impacte '+impacte.class+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><img src="content/impactes/palau/'+impacte.image+'"></div>')
        }
    }, 'json')
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