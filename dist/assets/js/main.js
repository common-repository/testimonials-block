(function($){

    "use strict";

    $('.testimonial-slider1').slick({
        slidesToScroll: 1,
        slidesToShow: 2,
        dots: true,
        infinite: true,
        arrows: false,
        responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    },
    {
      breakpoint: 300,
      settings: {
        slidesToShow: 1
      }
    }
  ]

    });
   

   $('.testimonial-slider2').slick({
        slidesToScroll: 1,
        slidesToShow: 1,
        dots: true,
        infinite: true,
        arrows: false

    });
   

})(jQuery);