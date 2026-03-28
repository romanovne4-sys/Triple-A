// Scroll Header

function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 80) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);