$(document).ready(function() {
  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
      $('.home_header').toggleClass('active');
      $('body').toggleClass('sidebar_icon_only');
  });

  $('.table-responsive').on('show.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "inherit" );
  });

  $('.table-responsive').on('hide.bs.dropdown', function () {
       $('.table-responsive').css( "overflow", "auto" );
  });

  $('[data-toggle="tooltip"]').tooltip();

  $(".table tr").click(function () {
      $(".table tr").removeClass("active");
      $(this).addClass("active");   
  });

  $(function() {
      $('.row_data').hide();
      $(".data_area .row_content td .d_list i").click(function(){
      // $(".row_data").not($(this).next()).hide();
          $(this).toggleClass('active');
          $(this).closest("tr").next("tr").toggle();
      })
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
