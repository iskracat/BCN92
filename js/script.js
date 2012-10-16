/** Author:

 Iskra

*/


function doActionsForHide($sectionGroup) {
    
    var currentId = $sectionGroup.attr('id')

    if (currentId === 'home') {
        try { $('#videoportada embed').get(0).pauseVideo() } catch(err) {}
        $('#videoportada').hide()    
    }

    if (currentId === 'impactes') {
        $('#impactes .accordion-toggle h3.main').text(__VOBRES['petjades_title'])
        $('#impactes .accordion-toggle h3.sub').text('')
    }

    if (currentId === 'testimonis') {
        var playingvideo = $('#videotestimoni embed').get(0)
        if (playingvideo) { try {playingvideo.pauseVideo() } catch(err) {} }
    }

    if (currentId === 'miratges') {
        var $fuku = $('#miratges .item.active .parellaFotos')
        if ($fuku) {$fuku.hide()}
    }
}


function doActionsForShow($sectionGroup) {

    var currentId = $sectionGroup.attr('id')

    if (currentId === 'home') {
        $('#impactesnav .back').toggleClass('active', false)
        $('#impactesnav .forward').toggleClass('active', true)        
        $('#impactesnav .mapa').toggleClass('active', false)        
        $('#bigone').toggleClass('dissolve', true)        
        $('#map').toggleClass('dissolve', false)
        $('#impactesCarousel').carousel(0)
        $('#impactes .accordion-toggle h3.main').text(__VOBRES['petjades_title'])
        $('#impactes .accordion-toggle h3.sub').text('')
        $('#videoportada').show()    
        try { $('#videoportada embed').get(0).playVideo() } catch(err) {}           
    }

    if (currentId === 'miratges') {
        if (!__VOBRES.loaded[currentId]) {
            var miratges = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']
            var image_height = getAvailableSize('miratges') - 140
            for (m=0;m<miratges.length;m++) {

                $miratge = $('#item-'+miratges[m])
                $parella = $('#parella-'+miratges[m])
                var width = $parella.find('img').width()
                var height = $parella.find('img').height()
                var prop = width / height
                var image_width = Math.floor(image_height * prop)
                if (window.innerWidth>1170) {
                    var amplada_total = 1170;
                } else {
                    var amplada_total = window.innerWidth;
                }
                if (image_width + 110 > 650) {
                    var width_title_miratge = image_width + 110;
                } else {
                    var width_title_miratge = 650;
                }
                $miratge.find('.title').css({width:width_title_miratge, 'margin-left':Math.floor((amplada_total - width_title_miratge)/2)})
                $miratge.find('.peus').css({width:400, 'margin-left':Math.floor((amplada_total - 400)/2)})
                var $images = $parella.find('img')
                $($images.get(0)).css({width:image_width, height:image_height})
                $($images.get(1)).css({width:image_width, height:image_height})
                $parella.css({'margin-left':Math.floor((amplada_total - image_width) / 2)})
                var language = $('html').attr('lang') 
                var lf = language!='ca' ? '../' : ''
                $parella.beforeAfter( {showFullLinks:false, imagePath:lf+'img/'})            
            }

        } else {
            var $fuku = $('#miratges .item.active .parellaFotos')
            if ($fuku) {$fuku.show()}

        }

        
    }

    if (currentId === 'testimonis') {
        $('#testimonis .video').css({height: getAvailableSize('testimonis') - 200})
        playingvideo = $('#videotestimoni embed').get(0)
        if (playingvideo) { try { playingvideo.playVideo() } catch(err) {}
        } else {
            $('#testimonis .firsttime').trigger('click')
        }

    }
}


function hideSection($sectionGroup) {

    var $sectionBody = $sectionGroup.find('.accordion-body')

    doActionsForHide($sectionGroup)

    $sectionBody.animate({height: 0}, function() {
        $sectionGroup.toggleClass('visible', false)
    })
}


function showSection($sectionGroup) {
    
    var $sectionBody = $sectionGroup.find('.accordion-body')
    var $sectionInner = $sectionBody.find('.accordion-inner')
    var currentId = $sectionGroup.attr('id')
    var size = getAvailableSize(currentId)

    $sectionBody.animate({height: size})
    $sectionGroup.toggleClass('visible', true)
    

    //$('.accordion-inner').css({height:getAvailableSize(currentId)})
    var homevisible = currentId === 'home'
    $('#accordion2').toggleClass('athome', homevisible)


    // Load content
    if (__VOBRES.loaded[currentId]) {                                                                
          console.log('already loaded')                                                                
          doActionsForShow($sectionGroup)
      // otherwise load and parse the content and set a loaded mark on this section                                                                
      } else {                                                             
          var content_url = $sectionGroup.find('.accordion-toggle').attr('href')
          $.get(content_url, function (data) {                                                             
              // inject only contents inside selector #content                                                             
              filtered = $(data).filter('#content').html()                                                             
              $sectionInner.html(filtered)                                                              
              
              if (currentId==='impactes') {                                                             
                setTimeout(recalculatePinPositions, 300)                                                               
              }                          
              doActionsForShow($sectionGroup)                                      
              __VOBRES.loaded[currentId] = true                                                                
          }, 'html' )                                                              
      }




}

$(document).ready( function() {

    // Accordion fold/unfold behaviour
    $('.accordion-heading').on('click', function(event) {

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $sectionGroup = $(this).closest('.accordion-group') 
        var $sectionBody = $sectionGroup.find('.accordion-body')

        var visible = $sectionGroup.hasClass('visible')

        if (visible) {

            var $nextVisibleSectionGroup = $sectionGroup.prev()

            hideSection($sectionGroup)
            showSection($nextVisibleSectionGroup)

        } else {
            var $currentVisibleGroup = $('.visible')

            hideSection($currentVisibleGroup)
            showSection($sectionGroup)
        }

    })


    $('#homelink').on('click', function(event){

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $home = $('#home')
        var visible = $home.hasClass('visible')

        if (!visible) {

            var $currentVisibleGroup = $('.visible')

            hideSection($currentVisibleGroup)
            showSection($home)
        }
    })

    // Miratges carousel navigation behaviour

    $('#collapseMiratges').on('click', '.navitem',  function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        $this =  $(this)
        var number = parseInt($this.attr('rel'), 10)
        $('.navitem.active').toggleClass('active', false)
        $this.toggleClass('active', true)
        $('#miratgesCarousel').carousel(number-1)
    })

    // Navigate to next impacte
    $('#impactesnav .forward').on('click', function(event) {
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
    $('#impactesnav .back').on('click', function(event) {
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
    $('#impactesnav .mapa').on('click', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        $(this).toggleClass('active', false)
        $('#impactesnav .back').toggleClass('active', false)
        $('#impactesnav .forward').toggleClass('active', true)        
        $('#bigone').toggleClass('dissolve', true)        
        $('#map').toggleClass('dissolve', false)
        setTimeout(function() {$('#impactesCarousel').carousel(0)}, 1000)
        $('#impactes .accordion-toggle h3.main').text(__VOBRES['petjades_title'])
        $('#impactes .accordion-toggle h3.sub').text('')


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


    $('#impactes').on('click', '.goleft', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $pagina = $(this).next()
        var $wrapper = $pagina.find('.wrapper')
        var maxcols = $pagina.get(0).maxcols
        var visiblecols = Math.floor($pagina.width() / 110)
        var currentscrollpos = (Math.floor(parseInt($wrapper.css('margin-left'), 10) / 110) * -1)
        if (currentscrollpos > 0) currentscrollpos -=1
        var prevpos = currentscrollpos - 1
        if (prevpos>=0) $wrapper.animate({'margin-left':prevpos * -120 }, 200)
        
    })

    $('#impactes').on('click', '.goright', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $pagina = $(this).prev()
        var $wrapper = $pagina.find('.wrapper')
        var maxcols = $pagina.get(0).maxcols
        var visiblecols = Math.floor($pagina.width() / 110)
        var currentscrollpos = (Math.floor(parseInt($wrapper.css('margin-left'), 10) / 110) * -1)
        if (currentscrollpos > 0) currentscrollpos -=1
        var nextpos = currentscrollpos + 1
        if (nextpos<=maxcols-visiblecols) $wrapper.animate({'margin-left':nextpos * -120 }, 200)
        
    })

    $('#miratges').on('click', '.goleft', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $navigation = $('#carouselNavigation')
        var $wrapper = $navigation.find('.wrapper')
        var step = 130
        var currentscrollpos = parseInt($wrapper.css('margin-left'), 10)
        var prevpos = currentscrollpos + step
        console.log(prevpos)
        if (prevpos<0) {
            $wrapper.animate({'margin-left':prevpos}, 200)
        }
        
    })

    $('#miratges').on('click', '.goright', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $navigation = $('#carouselNavigation')
        var visibleWidth = $navigation.width()
        var step = 130
        var totalWidth = step * 14
        var $wrapper = $navigation.find('.wrapper')
        var currentscrollpos = parseInt($wrapper.css('margin-left'), 10)
        var nextpos = currentscrollpos - step
        console.log(nextpos)
        if ((nextpos*-1)< (totalWidth - visibleWidth)) {
            
            //if (nextpos<=maxcols-visiblecols) $wrapper.animate({'margin-left':nextpos * -120 }, 200)
            $wrapper.animate({'margin-left':nextpos }, 200)
        }
        
    })




    $('#testimonis').on('click', '.testimoni', function(event) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        var $testimoni = $(this)
        if ($testimoni.hasClass('firsttime')) {
            $testimoni.toggleClass('firsttime', false)
            var autoplay = 0
        } else {
            var autoplay = 1
        }
        var $video = $('#testimonis .video')
        var video = $testimoni.attr('rel')
        var height = $video.height()-40
        var width = height*1.78
        var mtop = 20
        var hd = height>500 ? '&vq=hd720' : ''
        var videotag = '\
<div style="width:'+width+'px;height:'+height+'px; margin:'+mtop+'px auto;">\
<object id="videotestimoni" width="'+width+'" height="'+height+'">\
<param name="movie" value="'+video+'\?version=3&amp;hl=ca_ES&amp;autoplay='+autoplay+'&enablejsapi=1'+hd+'"></param>\
<param name="allowFullScreen" value="true"></param>\
<param name="allowscriptaccess" value="always"></param>\
    <embed src="'+video+'?version=3&amp;hl=ca_ES&amp;autoplay='+autoplay+'&enablejsapi=1'+hd+'" \
           type="application/x-shockwave-flash" \
           width="'+width+'" height="'+height+'" \
           allowscriptaccess="always" allowfullscreen="true"></embed></object></div>'

        $('.testimoni.active').toggleClass('active', false)
        $testimoni.toggleClass('active', true)
        $('#testimonis .video').html(videotag)

    })

    $(window).resize(function () {
        var current
        $('#accordion2').hasClass('athome')
            ? current = 'home'
            : current = $('.visible').attr('id')
        console.log(current)
        $('visible .accordion-body').css({height:getAvailableSize(current)})
        recalculatePinPositions()

    })

    __VOBRES = {status: {},
                loaded: {home:true},
                pins :{ estadi:      {w:466, h:534, pop:'right'},
                        palau:       {w:437, h:532, pop:'bottom'},
                        picornell:   {w:457, h:502, pop:'top'},
                        calatrava:   {w:426, h:495, pop:'left'},
                        ronda:       {w:372, h:547, pop:'left'},
                        platges:     {w:768, h:574, pop:'right'},
                        portolimpic: {w:652, h:575, pop:'left'},
                        portvell:    {w:584, h:553, pop:'top'},
                        torres:      {w:669, h:542, pop:'top'},
                        vila:        {w:690, h:560, pop:'right'},
                        cinturo:     {w:621, h:277, pop:'left'},
                        collserola:  {w:553, h:203, pop:'bottom'},
                        valldhebron: {w:715, h:260, pop:'right'}
                      },
                petjades_title :$('#impactes h3.main').text()
               }



    // instantiate pin popovers
    var pinnames = ['estadi','palau' ,'picornell' ,'calatrava' ,'ronda' ,'platges' ,'portolimpic' ,'portvell' ,'torres' ,'vila' ,'cinturo' ,'collserola', 'valldhebron']
    for (p=0;p<pinnames.length;p++) {
        var pin = pinnames[p]
        var $pin = $('.pin#'+pin)
        var $pina = $pin.find('a')
        __VOBRES.pins[pin].title = $pina.attr('title')
        __VOBRES.pins[pin].zone = $pina.attr('zone')
        var options = {     title: __VOBRES.pins[pin]['title'],
                        placement: __VOBRES.pins[pin]['pop']
                       }
        $('.pin#'+pin).popover(options)
    }

    // resize active section to remaining viewport size
    $('.visible .accordion-body').css({height:getAvailableSize('home')})



}) // End jQuery ready wrapper


  function downloadFullImageFor(path){
        var $fancybox = $(event.target).closest('.fancybox-wrap')
        var $img = $fancybox.find('.fancybox-image')
        var path = $img.attr('src')
        var imagename = path[path.length-1]
        console.log(imagename)
        //$('.impacte a[href*="DdB_2471012_fot.jpg"]')
    }


function recalculatePinPositions() {
    var pins = $('#map .pin')
    for (p=0;p<pins.length;p++) {
        recalculatePinPosition($(pins[p]).attr('id'))    
    }
    
}

function recalculatePinPosition(pin) {
    var section = { w:$('#impactes #map').width(),
                    h:getAvailableSize('impactes') + 96 }
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
    $('#'+pin+'.pin').css({top:h-30, left:w-14})


}



function getAvailableSize(visibleSection) {
    var total = 0
    var headers_at_home = 198
    var headers_at_sections = 109

    //216

    // Add the navbar
    total += $('.navbar').outerHeight()
    // Add the section headers
    if (visibleSection==='home') {total += headers_at_home}
    else  {total += headers_at_sections}  

    if (visibleSection==='impactes') {total += 52}
    
    // Calculate available size by substracting occuped from viewport size
    var window_height = $(window).height()
    var available = window_height - total
    return available

}


function loadImpactesPage(page) {

    var language = $('html').attr('lang') 
    var lf = language!='ca' ? '../' : ''
    var url = 'content/impactes/'+page+'.json'    
    $.get(url, function(data) {
        var available = data
        var numi = available.length
        var $container = $('#impactes .carousel-inner')
        var pagesize = getAvailableSize('impactes')-30
        var $pagina = $container.find('#'+page+' .pagina')
        var $wrapper = $pagina.find('.wrapper')
        var $goleft = $container.find('#'+page+' .goleft')
        var $goright = $container.find('#'+page+' .goright')
        $pagina.css({height:pagesize})
        $goleft.css({height:pagesize})
        $goright.css({height:pagesize})
        
        //maxcols = Math.floor(container.width() / 120)
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
            var pos = getAvailablePos(impacte['class'])
            if (impacte.type=='single') $wrapper.append('<div rel="'+i+'" class="impacte '+impacte.type+' '+impacte['class']+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a full="'+lf+impacte.full+'" href="'+lf+impacte.image+'" title="'+impacte.footer+'"><img src="'+lf+impacte.thumb+'"></a><i class="emblem"></i></div>')
            if (impacte.type=='video') $wrapper.append('<div rel="'+i+'" class="impacte '+impacte.type+' '+impacte['class']+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a rel="media-gallery" full="'+lf+impacte.full+'" href="'+impacte.url+'" title="'+impacte.footer+'"><img src="'+lf+impacte.thumb+'"></a><i class="emblem"></i></div>')
            if (impacte.type=='serie') {
                var serielinks = ''
                for (l=1;l<impacte.items.length;l++) {
                    serielinks += '<a data-fancybox-group="'+impacte.id+'" full="'+lf+impacte.items[l].full+'" href="'+lf+impacte.items[l].image+'" title="'+impacte.items[l].footer+'"></a>'
                }

                $wrapper.append('<div rel="'+i+'" class="impacte '+impacte.type+' '+impacte['class']+'" style="top:'+pos.r+'px;left:'+pos.c+'px"><a full="'+lf+impacte.items[0].full+'"  data-fancybox-group="'+impacte.id+'" href="'+lf+impacte.items[0].image+'" title="'+impacte.items[0].footer+'"><img src="'+lf+impacte.thumb+'"></a>'+serielinks+'<i class="emblem"></i></div>')            
            }  
        }

        var visiblecols = Math.floor($pagina.width() / 110)
        var maxcols = getLongestRow()
        $pagina.get(0).maxcols = maxcols
        if (maxcols<=visiblecols) {
            $goleft.hide()
            $goright.hide()
        }

        var actionbuttons = '<div class="actions">\
                                 <div class="prevf"></div>\
                                 <div class="nextf"></div>\
                                 <div class="download"><a href="#" target="_blank" ></div>\
                                 <div class="closef"></div>\
                             </div>'


        var actionbuttonsvideo = '<div class="actions">\
                                 <div class="prevf"></div>\
                                 <div class="nextf"></div>\
                                 <div class="closef"></div>\
                             </div>'
        
        $("#"+page+" .impacte.single a").fancybox({ helpers    : { title : { type : 'inside' }, 
                                                    overlay    : { css: {opacity:0.8}} },
                                                    closeBtn   : false,
                                                    arrows     : false,
                                                    afterShow : function() {
                                                             var $element = $(this.element)
                                                             var $impacte = $element.closest('.impacte')
                                                             var fullimage = $element.attr('full')
                                                             var impacteid = parseInt($impacte.attr('rel'),10)
                                                             var maximpacte = $('#impactesCarousel .item').length
                                                             var nextimpacte = impacteid+1
                                                             var previmpacte = impacteid-1

                                                             $('.fancybox-outer').prepend(actionbuttons)
                                                             $('.fancybox-outer .download a').attr('href', fullimage)

                                                             $('.fancybox-outer .nextf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (nextimpacte<maximpacte) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+nextimpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .prevf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (previmpacte>=0) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+previmpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .closef').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                console.log('close')
                                                                $.fancybox.close()
                                                             })
                                                         }
                                                 });

        $("#"+page+" .impacte.video a"). fancybox({ helpers    : { media: {}, 
                                                                title : { type : 'inside' }, 
                                                    overlay    : { css: {opacity:0.8}} },
                                                    closeBtn   : false,
                                                    arrows     : false,
                                                    afterShow : function() {
                                                             var $element = $(this.element)
                                                             var $impacte = $element.closest('.impacte')
                                                             var fullimage = $element.attr('full')
                                                             var impacteid = parseInt($impacte.attr('rel'),10)
                                                             var maximpacte = $('#impactesCarousel .item').length
                                                             var nextimpacte = impacteid+1
                                                             var previmpacte = impacteid-1

                                                             $('.fancybox-outer').prepend(actionbuttonsvideo)

                                                             $('.fancybox-outer .nextf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (nextimpacte<maximpacte) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+nextimpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .prevf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (previmpacte>=0) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+previmpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .closef').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                console.log('close')
                                                                $.fancybox.close()
                                                             })
                                                         }

                                                 });

        $("#"+page+" .impacte.serie a"). fancybox({ prevEffect : 'none', 
                                                    nextEffect : 'none', 
                                                    helpers    : { thumbs: { width: 50, height:50}, 
                                                                title : { type : 'inside' }, 
                                                    overlay    : { css: {opacity:0.8}} },
                                                    closeBtn   : false,
                                                    afterShow : function() {
                                                             var $element = $(this.element)
                                                             var $impacte = $element.closest('.impacte')
                                                             var fullimage = $element.attr('full')
                                                             var impacteid = parseInt($impacte.attr('rel'),10)
                                                             var maximpacte = $('#impactesCarousel .item').length
                                                             var nextimpacte = impacteid+1
                                                             var previmpacte = impacteid-1

                                                             $('.fancybox-outer').prepend(actionbuttons)
                                                             $('.fancybox-outer .download a').attr('href', fullimage)

                                                             $('.fancybox-outer .nextf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (nextimpacte<maximpacte) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+nextimpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .prevf').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                if (previmpacte>=0) {
                                                                    var $next = $('#impactesCarousel .item.active .impacte[rel="'+previmpacte+'"] a')
                                                                    $.fancybox.close()
                                                                    $next.trigger('click')
                                                                }
                                                             })

                                                             $('.fancybox-outer .closef').on('click', function(event) {
                                                                event.preventDefault()
                                                                event.stopPropagation()
                                                                event.stopImmediatePropagation()
                                                                console.log('close')
                                                                $.fancybox.close()
                                                             })
                                                         }
                                                 });


    }, 'json')
    $('#impactes .accordion-toggle h3.main').text(__VOBRES.pins[page]['zone'])
    $('#impactes .accordion-toggle h3.sub').text(__VOBRES.pins[page]['title'])
}

/** 
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

/**
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

/** 
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

/**
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

/**
 * Iterates through all the occuped positions to pad with
 * zeroes all unused positions to align with longest row.
 * This allows to detect `empty` zones as holes and fill them.
 */

function alignHoleMarkers() {

  // get longest row
  var longest = getLongestRow()

  // fill zeroes to match column count on longest row
  for (r=0;r<maxrows;r++) {
      while (map[r].length<longest)
          map[r].push(0)
  }

}


/**
 * Finds the longest filled row
 */

function getLongestRow() {

  // get longest row
  var longest = 0
  for (r=0;r<maxrows;r++) {
      if (map[r].length>longest) longest=map[r].length
  }
  return longest
}

/**
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


/**
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

/**
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

/**
 *  Checks whether a position in map is available to use
 */

function isAvailable(r, c) {

    // if point is outside boudaries, it's not valid
    if (r>=maxrows ) { return false}

    // otherwise, check it its a valid position, either existing
    // which can be a available if it's a hole (0) or already filled (1)
    if (c<map[r].length) {
        return map[r][c] == 0
    // if it's a non-existing position whithin boudaries, is valid
    } else {
        return true
    }

}