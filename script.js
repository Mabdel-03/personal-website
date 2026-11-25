document.getElementById('year').textContent = new Date().getFullYear();

// Keep the existing coursework deep link useful when the list is collapsed.
const coursework = document.getElementById('coursework');
function revealCoursework() {
    if (location.hash === '#coursework') {
        coursework.open = true;
    }
}
revealCoursework();
window.addEventListener('hashchange', revealCoursework);

// Native fragments handle navigation. As visitors scroll, mark the section
// below the header, including Contact when the footer reaches the viewport.
const nav = document.querySelector('.primary-nav');
const sectionLinks = [...nav.querySelectorAll('li a')].map((link) => ({
    link,
    section: document.getElementById(link.hash.slice(1))
}));

function updateCurrentSection() {
    const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
    const readingLine = nav.getBoundingClientRect().bottom + window.innerHeight * 0.1;
    let current;
    for (const item of sectionLinks) {
        if (atEnd || item.section.getBoundingClientRect().top <= readingLine) current = item;
    }
    for (const item of sectionLinks) {
        if (item === current) {
            item.link.setAttribute('aria-current', 'location');
        } else {
            item.link.removeAttribute('aria-current');
        }
    }
}

updateCurrentSection();
window.addEventListener('scroll', updateCurrentSection, { passive: true });
window.addEventListener('resize', updateCurrentSection);
window.addEventListener('pageshow', updateCurrentSection);
