/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*==================== PORTFOLIO MIXITUP FILTER ====================*/
// This section will only work on art-display.html, which is fine.
// Ensure you have mixitup.min.js in your js folder for this to work.
try {
    let mixerPortfolio = mixitup('.art-display__container', {
        selectors: {
            target: '.art-display__card'
        },
        animation: {
            duration: 400
        }
    });

    const linkWork = document.querySelectorAll('.art-display__item')
    function activeWork(){
        linkWork.forEach(l=> l.classList.remove('active-work'))
        this.classList.add('active-work')
    }
    linkWork.forEach(l=> l.addEventListener('click', activeWork))
} catch(e) {
    // console.log("Mixitup not found on this page.");
}


/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        const link = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if(link) {
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                link.classList.add('active-link')
            }else{
                link.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)


/*==================== NEW SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true // Uncomment this line if you want the animation to repeat every time you scroll up/down
})

sr.reveal(`.home__data, .art-piece__data, .footer__container`)
sr.reveal(`.home__img, .art-piece__img-container`, {delay: 700, origin: 'bottom'})
sr.reveal(`.home__social`, {delay: 900, origin: 'left'})
sr.reveal(`.gallery__card, .art-display__card`, {interval: 100})