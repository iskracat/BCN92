/* Author:

 Iskra

*/


$(document).ready( function() {

    // Accordion fold/unfold behaviour

    $('.accordion-group').on('click', function(event) {
        event.preventDefault()
        // Re-set section sizes in order to adapt to header size changes
        $('.accordion-inner').css({height:getAvailableSize(false)})

        var sectionBody = $(this).find('.accordion-body')
        var sectionInner = $(sectionBody).find('.accordion-inner')

        // Save visibility status of the clicked section, toggle it and set classes        
        var visible = sectionBody.hasClass('in')
        var currentId = $(this).attr('id')
        var prevId = $(this).prev().attr('id')
        sectionBody.collapse('toggle')
        $(this).toggleClass('visible')

        var content_url = $(this).find('.accordion-toggle').attr('href')
        var loader = $(this).find('.loader')

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
                        loadImpactes()
                      }
                  }, 'html' )
              }
            })
        }
        // make sure loader gets hidden
        loader.hide()


        // If we were hidden, hide all visible sections but current
        var sections = $(this).siblings()
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

    __VOBRES = {loaded: {}}



    // resize active section to remaining viewport size
    $('.accordion-inner').css({height:getAvailableSize(true)})

}) // End jQuery ready wrapper



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


function loadImpactes() {
    $.get('content/impactes/palau/data.json', function(data) {
        var available = data
        var numi = available.length
        console.log(numi)
        maxcols = Math.floor($('.pagina').width() / 120)
        maxrows = Math.floor($('.pagina').height() / 120)

        // Generate tile map and fill with zeroes
        map = []
        for (i=0;i<maxrows;i++) {
            map[i] = []
            for (h=1;h<maxcols;h++) { map[i].push(0) }
        }
        console.log(map)
        for (i=0;i<2;i++) {
            var impacte = data[i]
            var pos = getAvailablePos(impacte.class)
            $('#impactes .pagina').append('<div class="impacte '+impacte.class+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><img src="content/impactes/palau/'+impacte.image+'"></div>')
        }
    }, 'json')
}

function getAvailablePos(cls) {

    // first of all, search if tile fits in any hole
    last = searchHoleFor(cls)
    if (last) {
         a = 0
    // it there is no suitable hole, proceed with the base algorithm
    } else {
        last = getLastPos(cls)  
    }
    
    fillLastPos(cls, last)
    return {r:last.r*120, c:last.c*120}
    
}

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

    // Look for holes in prev tile
    if (cls=='rrc') {
        if (map[row].length > map[row+1].length) {
            row = row +1
            last = map[row].length
        }
    }


    return {r:row, c:last}
}


function fillPos(r, c) {

    // if the position we try to fill doesn't exists, we are filling a hole
    if (c<map[r].length) {
        map[r][c] = 1
    } else {
    // otherwise we are creating a new position
        map[r].push(1)
    }
}

function fillLastPos(cls, pos) {
  // Always fill the topleft position

  fillPos(pos.r, pos.c, 1)

  if (cls=='rcc') {
      fillPos(pos.r, pos.c+1, 1)
  }

  // if is a vertical tile  
  if (cls=='rrc') {
      baserow_length = map[pos.r].length
      belowrow_length = map[pos.r+1].length

      // if lenghts once filled are not equal, it means we are generating a hole in the row below 
      // So we fill it with zeroes
      if ( baserow_length > belowrow_length+1) {
          for (h=1;h<baserow_length-belowrow_length;h++) { map[pos.r+1].push(0)
      }}

      // once the holes have been filled, push the tile section into its row
      fillPos(pos.r+1, pos.c, 1)
  } 

  if (cls=='rrcc') {
      fillPos(pos.r, pos.c+1, 1)
      fillPos(pos.r+1, pos.c, 1)
      fillPos(pos.r+1, pos.c+1, 1)
    }

}

function searchHoleFor(cls) {
    var cont = true
    var found = false
    for (sr=0;sr<maxrows;sr++) {
        var crow = map[sr]
        for (sc=0;sc<crow.length;sc++) {
            if (crow[sc] == 0) {
              if (tileFits(cls, sr, sc)) {
                found = true
                pos = {r:sr, c:sc}
                break
              }
            }
        }
    }

    if (found) {
        return pos
    } else {
        return false
    }

}
    
function tileFits(cls, r, c) {
    fits = isAvailable(r,c)

    if (cls=='rrcc' || cls=='rcc') {
        fits = fits && isAvailable(r,c+1)
    }

    if (cls=='rrcc' || cls=='rrc') {
        fits = fits && isAvailable(r+1,c)
    }

    if (cls=='rrcc') {
        fits = fits && isAvailable(r+1,c+1)
    }

    return fits
}


function isAvailable(r, c) {

    // it point is outside boudaries, it's not valid
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