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

  
  $('#home_slider').owlCarousel({
      loop:true,
      nav:true,
      items:1,
      margin:0,
      mouseDrag: false,
      navigation:true,
      navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
      autoplay:true,
      // animateOut: 'slideOutUp',
      // animateIn: 'fadeIn',
      autoplayTimeout:7000,
      smartSpeed: 1500,
      responsive:{
          0:{
              items:1
          },
          1000:{
              items:1
          }
      }
  });

  $('#dash_info_slider').owlCarousel({
      loop:true,
      nav:false,
      items:1,
      margin:0,
      dots:true,
      mouseDrag: true,
      navigation:false,
      navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
      autoplay:true,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      autoplayTimeout:7000,
      smartSpeed: 1500,
      responsive:{
          0:{
              items:1
          },
          1000:{
              items:1
          }
      }
  });

  $('#gig_prev_slider').owlCarousel({
      loop:true,
      nav:true,
      items:1,
      margin:0,
      dots:true,
      mouseDrag: true,
      navigation:true,
      navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
      autoplay:true,
      autoplayTimeout:7000,
      smartSpeed: 1500
  });

  $('#award_list').owlCarousel({
      loop:true,
      nav:true,
      items:1,
      margin:0,
      dots:true,
      mouseDrag: true,
      navigation:true,
      navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
      autoplay:true,
      autoplayTimeout:7000,
      smartSpeed: 1500
  });


  $('body').on('mouseenter mouseleave','header .dropdown',function(e){
    var _d=$(e.target).closest('header .dropdown');
    if (e.type === 'mouseenter')_d.addClass('show');
    setTimeout(function(){
      _d.toggleClass('show', _d.is(':hover'));
      $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
    },300);
  });

  $(function(){
      $(".cat_item .box .desc a").text(function(index, currentText) {
          return currentText.substr(0, 50) + '';
      });
      $(".view_page .sidebar_view .verified_pack p").text(function(index, currentText) {
          return currentText.substr(0, 60) + '';
      });
  });

  $('[data-toggle="tooltip"]').tooltip();

  $(".filter_btn").click(function() {
      $(this).toggleClass("filter_on");
      $(".category_page").toggleClass("fullwidth");
      $(".side_filter").toggleClass("open_filter");
  });

  $(function(){
      $(".cat_i_v_list .col .box .q_t span.ttle").text(function(index, currentText) {
          return currentText.substr(0, 20) + '...';
      });
  });

  // $(".ver_cat .ver_cat_list .item").hover(
  //   function () {
  //     $(this).addClass("expand");
  //   },
  //   function () {
  //     $(this).removeClass("expand");
  //   }
  // );  

  $('.registerbox .reg_box .box .video').click(function() {
    $(this).addClass('play_vdo');
    $('#planetvideo')[0].play();
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#user_prof_img').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#profile_image").change(function(){
      readURL(this);
  });

  $('.table-responsive').on('show.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "inherit" );
  });

  $('.table-responsive').on('hide.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "auto" );
  });

  $(function() {
      $('.rowContent').hide();
      $(".gigactive .accordion").click(function(){
      $(".rowContent").not($(this).next()).hide();
          $(this).next(".rowContent").toggle();
      })
  });

  function readURLa(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#upload_img').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
  }
  
  $("#gig_upload").change(function(){
      readURLa(this);
  });
});

$(document).ready(function() {
  var btn = $(".cat_item .box .img > a .play_icon");
  btn.click(function() {
    $(this).children().toggleClass("paused");
    return false;
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


 $(document).ready(function () {
  // reference for main items
  var slider = $('#slider');
  // reference for thumbnail items
  var thumbnailSlider = $('#thumbnailSlider');
  //transition time in ms
  var duration = 500;

  // carousel function for main slider
  slider.owlCarousel({
   loop:true,
   nav:false,
   items:1
  }).on('changed.owl.carousel', function (e) {
   //On change of main item to trigger thumbnail item
   thumbnailSlider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });

  // carousel function for thumbnail slider
  thumbnailSlider.owlCarousel({
   loop:false,
   margin:10,
   center:false,
   nav:true,
   navText : ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
   responsive:{
    0:{
     items:3,
     slideBy:1
    },
    600:{
     items:4,
     slideBy:1
    },
    1000:{
     items:6,
     slideBy:1
    }
   }
  }).on('click', '.owl-item', function () {
   // On click of thumbnail items to trigger same main item
   slider.trigger('to.owl.carousel', [$(this).index(), duration, true]);

  }).on('changed.owl.carousel', function (e) {
   // On change of thumbnail item to trigger main item
   slider.trigger('to.owl.carousel', [e.item.index, duration, true]);
  });


  //These two are navigation for main items
  $('.slider-right').click(function() {
   slider.trigger('next.owl.carousel');
  });
  $('.slider-left').click(function() {
   slider.trigger('prev.owl.carousel');
  });
 });

$(document).ready(function() {
  $(".sidebar_dash .usr_prof .prof_prog .one_line p i").click(function(){
    $(".sidebar_dash .usr_prof .prof_prog .one_line").toggleClass("edit_mode");
    $(".sidebar_dash .perfrm_wrap .one_line form .buttons button").click(function(){
      $(".sidebar_dash .usr_prof .prof_prog .one_line").removeClass("edit_mode");
    });
  });
  $(".sidebar_dash .usr_prof .desc_wrap li h3 a").click(function(){
    $(".sidebar_dash .usr_prof .desc_wrap li").toggleClass("edit_mode");
    $(".sidebar_dash .usr_prof .desc_wrap li form .buttons button").click(function(){
      $(".sidebar_dash .usr_prof .desc_wrap li").removeClass("edit_mode");
    });
  });
});

$(function() {
  $(".cat_item .box .price_info a.wish.gig_ac").on("click", function(e) {
    $(this).closest('.box').addClass('open');
    e.stopPropagation()
  });
  $(document).on("click", function(e) {
    if ($(e.target).is(".box") === false) {
      $(".box").removeClass("open");
    }
  });
});

$(document).ready(function() {
  $('.sellon_planet .step_box .video').click(function() {
    $(this).addClass('play_vdo');
    $(this).children('video')[0].play();
  });

  $('.planet_nav > ul > li.user_infodet > a').on('click', function(){
    $('body').addClass('bfix');
  });
  $('.planet_nav > ul > li.user_infodet .closebtn, .planet_nav > ul > li.user_infodet .overlay').on('click', function(){
    $('body').removeClass('bfix');
  });
});


