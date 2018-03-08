$(document).ready(function () {
  const k = $('.book__category');

  for (let i = 0; i < k.length; i++) {
    const cover = k[i];
    $(cover).css('filter', `hue-rotate(${(i + 1) * 45}deg)`);
  }

  $('.slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 7,
    slidesToScroll: 6,
    responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});
