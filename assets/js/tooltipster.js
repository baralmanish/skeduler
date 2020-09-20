$(document).ready(function() {
  $('.tooltip').tooltipster({
    theme: 'tooltipster-shadow',
    animation: 'grow',
    trigger: 'click',
    position: 'bottom',
    contentAsHTML: true,
    interactive: true,
    touchDevices: false,
    maxWidth: 500,
    // plugins: ['follower']
  });
});