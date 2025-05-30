(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 80)
        }, 1200, "easeInOutQuart");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav',
    offset: 100
  });

  // Modern enhancements
  $(document).ready(function() {
    
    // Profile modal functionality
    $('#profileImage').on('click', function() {
      $('#profileModal').modal('show');
    });

    // Add keyboard support for profile image
    $('#profileImage').on('keypress', function(e) {
      if (e.which === 13 || e.which === 32) { // Enter or Space key
        e.preventDefault();
        $('#profileModal').modal('show');
      }
    });

    // Modal enhancement - close on outside click
    $('#profileModal').on('click', function(e) {
      if (e.target === this) {
        $(this).modal('hide');
      }
    });

    // Add smooth modal animations
    $('#profileModal').on('show.bs.modal', function() {
      $(this).find('.modal-content').addClass('fade-in-up');
    });
    
    // Add fade-in animation to sections on scroll
    function animateOnScroll() {
      $('.resume-section').each(function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
          $(this).addClass('fade-in-up');
        }
      });
    }

    // Trigger animation on scroll
    $(window).on('scroll', throttle(animateOnScroll, 100));
    animateOnScroll(); // Run on page load

    // Add hover effects to skill icons
    $('.list-icons .list-inline-item').hover(
      function() {
        $(this).find('i').addClass('animated pulse');
      },
      function() {
        $(this).find('i').removeClass('animated pulse');
      }
    );

    // Add typing effect to main heading
    if ($('#about h1').length) {
      typeWriter($('#about h1'), 50);
    }

    // Parallax effect for background
    $(window).scroll(function() {
      var scrolled = $(window).scrollTop();
      var rate = scrolled * -0.5;
      $('body').css('background-position', '0 ' + rate + 'px');
    });

    // Add loading animation
    $('.resume-item, .portfolio-card').each(function(index) {
      $(this).css('animation-delay', (index * 0.1) + 's');
      $(this).addClass('fade-in-up');
    });
  });

  // Utility function for throttling
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Typing effect function
  function typeWriter(element, speed) {
    const text = element.text();
    element.text('');
    element.show();
    
    let i = 0;
    function type() {
      if (i < text.length) {
        element.text(element.text() + text.charAt(i));
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

})(jQuery); // End of use strict
