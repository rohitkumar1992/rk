$(document).ready(function() {
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

  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
      $('.home_header').toggleClass('active');
      $('body').toggleClass('sidebar_icon_only');
  });

  // $('body').on('mouseenter mouseleave','.dropdown',function(e){
  //   var _d=$(e.target).closest('.dropdown');
  //   if (e.type === 'mouseenter')_d.addClass('show');
  //   setTimeout(function(){
  //     _d.toggleClass('show', _d.is(':hover'));
  //     $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
  //   },300);
  // });

  $(".cat_gal .item").hover(
    function () {
      $(this).addClass("expand");
    },
    function () {
      $(this).removeClass("expand");
    }
  );

  $('.select_lang ul li.option').click(function() {
     // $(this).siblings().addBack().children().remove();
     var a = $(this).siblings().toggle();
     $(this).parent().prepend(this);
   });

   $('.table-responsive').on('show.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "inherit" );
  });

  $('.table-responsive').on('hide.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "auto" );
  });
});

// $(document).ready(function(){
//   $('ul.components li a').click(function(e) {
//       $('ul.components li.active').removeClass('active');
//       var $parent = $(this).parent();
//       $parent.addClass('active');
//     });
// });

$(window).scroll(function() {
  var scroll = $(window).scrollTop();

  if (scroll >= 1) {
    $("body").addClass("headerfix");
  } else {
    $("body").removeClass("headerfix");
  }
});
