console.log('FeelFriends');

const siteScrollTop = document.querySelector('.site-scroll-top')

function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })    
}

if (!!siteScrollTop) {
    siteScrollTop.addEventListener('click', scrollTop)
}