$(document).ready(function() {
  wow = new WOW(
    {
    animateClass: 'animated',
    offset:       100,
    callback:     function(box) {
      console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
    }
    }
  );
  wow.init();



  $('.navbar-toggler').on('click', function(){
    $('.mobile_bg').fadeIn(function(){
      $('.navbar-collapse').animate({'right':'0'});
    });
    $('body').addClass('bfix');
  });
  $('.close_icon, .mobile_bg').on('click', function(){
    $('.navbar-collapse').animate({'right':'-280px'});
    $('.mobile_bg').fadeOut(1000);
    $('body').removeClass('bfix');
  });

  
  $('#home_slider').owlCarousel({
      loop:true,
      nav:false,
      items:1,
      margin:0,
      mouseDrag: false,
      navigation:false,
      autoplay:true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      autoplayTimeout:5000,
      responsive:{
          0:{
              items:1
          },
          1000:{
              items:1
          }
      }
  });

  $('#horzcat_slider, #horzcat_slider1').owlCarousel({
    loop:false,
    nav:true,
    items:4,
    margin:30,
    navigation:true,
    autoplay:false,
    navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    responsive:{
        0:{
            items:2
        },
        1000:{
            items:4
        }
    }
  });

  $('#vartcat_slider, #vartcat_slider1, #vartcat_slider2').owlCarousel({
    loop:false,
    nav:true,
    items:6,
    margin:30,
    navigation:true,
    autoplay:false,
    navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    responsive:{
        0:{
            items:3
        },
        1000:{
            items:6
        }
    }
  });


  $('body').on('mouseenter mouseleave','.dropdown',function(e){
    var _d=$(e.target).closest('.dropdown');
    if (e.type === 'mouseenter')_d.addClass('show');
    setTimeout(function(){
      _d.toggleClass('show', _d.is(':hover'));
      $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
    },300);
  });

  $(".cat_gal .item").hover(
    function () {
      $(this).addClass("expand");
    },
    function () {
      $(this).removeClass("expand");
    }
  );


  $('body').on('hidden.bs.modal', '.modal', function () {
      $('video').trigger('pause');
  });

  $('.catdet_video .video_box').click(function() {
    $(this).addClass('play_vdo');
    $('#video')[0].play();
  });
});

$(window).scroll(function() {    
  var scroll = $(window).scrollTop();

  if (scroll >= 1) {
    $("body").addClass("headerfix");
  } else {
    $("body").removeClass("headerfix");
  }
});


