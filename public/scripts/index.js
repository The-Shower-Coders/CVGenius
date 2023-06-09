
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  loop: true,
  speed: 5000,
  spaceBetween: 16,
  autoplay: {
    delay: 3000,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
$(document).ready(function () {
  $(".create").css({ "position": "relative", "opacity": 0, "left": "+=100" });
  $(".create").animate({ left: 0, opacity: 1 }, 2000);
  $(".create").click(() => window.location.href = '/resumes')
  $(".logo").click(() => window.location.href = '/')
});

$(".scroll").click(() => {
  $('html, body').animate({
    scrollTop: $(".heading").offset().top - 100
}, 2000);
})