const openButton = document.getElementById('open-sidebar-button')
const navbar = document.getElementById('navbar')

const media = window.matchMedia("(width < 700px)")

media.addEventListener('change', (e) => updateNavbar(e))

function updateNavbar(e){
  const isMobile = e.matches
  console.log(isMobile)
  if(isMobile){
    navbar.setAttribute('inert', '')
  }
  else{
    navbar.removeAttribute('inert')
  }
}

function openSidebar(){
  navbar.classList.add('show')
  openButton.setAttribute('aria-expanded', 'true')
  navbar.removeAttribute('inert')
}

function closeSidebar(){
  navbar.classList.remove('show')
  openButton.setAttribute('aria-expanded', 'false')
  navbar.setAttribute('inert', '')
}

updateNavbar(media)

const swiper = new Swiper('.js-reviews-slider', {
  grabCursor: true,
  spaceBetween: 30,
 
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    init: function () {
        document.querySelector('.swiper-pagination').style.position = 'static';
    }
  },
  breakpoints: {
    767:{
      slidesPerView: 2
    }
  }
})