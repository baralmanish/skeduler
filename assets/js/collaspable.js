function activateCollaspable() {
  $('.accordion-box .accordion-title .title').click(function() {
    const $this = $(this)
    $accordionTitle = $this.parent('.accordion-title')
    $accordionBox = $accordionTitle.parent('.accordion-box')

    const isAlreadySelected = $this.find('.fa-caret-down').length > 0
    $accordionBox.find('.accordion-title').find('i').removeClass('fa-caret-right');
    $accordionBox.find('.accordion-title').find('i').removeClass('fa-caret-down');

    if (isAlreadySelected) {
      $this.find('i').addClass('fa-caret-right')
      $accordionTitle.next('.accordion-body').hide()
    } else {
      $this.find('i').addClass('fa-caret-down')
      $accordionTitle.next('.accordion-body').show()
    }
    $accordionBox.find('.accordion-title').not($accordionTitle).next('.accordion-body').hide();
    $accordionBox.find('.accordion-title').not($accordionTitle).find('i').addClass('fa-caret-right');
  })
}