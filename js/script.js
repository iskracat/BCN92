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
    console.log(total)
    // Add the section headers
    if (athome) {total += headers_at_home}
    else {total += headers_at_sections}  
    
    // Calculate available size by substracting occuped from viewport size
    window_height = $(window).height()
    available = window_height - total
    console.log(window_height)
    return available
}


