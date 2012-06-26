/* Author:

*/




$('.collapse')
  .on('shown', function(event) {
    parent = $(event.target).closest('.accordion-group')
    $(parent).toggleClass('visible', true)
   })
  .on('hidden', function(event) {
    parent = $(event.target).closest('.accordion-group')
    $(parent).toggleClass('visible', false)
   })




