/* Author:

*/




$('.collapse')
  .on('show', function(event) {
    parent = $(event.target).closest('.accordion-group')
    $(parent).toggleClass('visible', true)
    homevisible = $('#home').hasClass('visible')
    console.log(homevisible)
    $('#accordion2').toggleClass('athome', homevisible)

   })
  .on('hide', function(event) {
    parent = $(event.target).closest('.accordion-group')
    $(parent).toggleClass('visible', false)
    homevisible = $('#home').hasClass('visible')
    console.log(homevisible)
    $('#accordion2').toggleClass('athome', homevisible)
   })




