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
      // animateOut: 'fadeOut',
      // animateIn: 'fadeIn',
      margin:0,
      navigation:false,
      autoplay:true,
      autoplayTimeout:5000,
      autoplayHoverPause:false,
      responsive:{
          0:{
              items:1
          },
          1000:{
              items:1
          }
      }
  });

  $('#buy_slider').owlCarousel({
    loop:true,
    nav:false,
    items:4,
    margin:50,
    navigation:false,
    autoplay:true,
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

  $('#sell_slider').owlCarousel({
    loop:true,
    nav:false,
    items:3,
    margin:50,
    navigation:false,
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    responsive:{
        0:{
            items:2
        },
        1000:{
            items:3
        }
    }
  });

  $('#vendor_slider').owlCarousel({
    loop:true,
    nav:false,
    items:3,
    margin:50,
    navigation:false,
    autoplay:true,
    autoplayTimeout:5000,
    autoplayHoverPause:false,
    responsive:{
        0:{
            items:2
        },
        1000:{
            items:3
        }
    }
  });

  // $('#gal_slider, #gal_slider1').owlCarousel({
  //   loop:false,
  //   nav:true,
  //   items:7,
  //   margin:10,
  //   navigation:true,
  //   navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
  //   autoplay:false,
  //   autoplayTimeout:5000,
  //   autoplayHoverPause:false,
  //   stagePadding: 50,
  //   responsive:{
  //       0:{
  //           items:5
  //       },
  //       1000:{
  //           items:7
  //       }
  //   }
  // });

  $('body').on('mouseenter mouseleave','.dropdown',function(e){
    var _d=$(e.target).closest('.dropdown');
    if (e.type === 'mouseenter')_d.addClass('show');
    setTimeout(function(){
      _d.toggleClass('show', _d.is(':hover'));
      $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
    },300);
  });


  $('.gal_slider').slick({
    centerMode: false,
    autoplay: false,
    centerPadding: '50px',
    slidesToShow: 7,
    nextArrow: '<span class="next"><i class="fa fa-angle-right" aria-hidden="true"></i></span>',
    prevArrow: '<span class="prev"><i class="fa fa-angle-left" aria-hidden="true"></i></span>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          centerMode: false,
          centerPadding: '0px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 567,
        settings: {
          arrows: true,
          centerMode: false,
          centerPadding: '0px',
          slidesToShow: 1
        }
      }
    ]
  });

  $(".h_gallery .gal_slider .item").hover(
    function () {
      $(this).addClass("expand");
    },
    function () {
      $(this).removeClass("expand");
    }
  );
});

$(window).scroll(function() {    
  var scroll = $(window).scrollTop();

  if (scroll >= 1) {
    $("body").addClass("headerfix");
  } else {
    $("body").removeClass("headerfix");
  }
});


