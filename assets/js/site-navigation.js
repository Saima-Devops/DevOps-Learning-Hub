// Resolve current sections at scroll time, including Azure's dynamically replaced views.
const pageTopButtons = [...document.querySelectorAll('[data-back-to-top]')];
let navigationFrame = 0;
function updateSiteNavigation() {
  navigationFrame = 0;
  document.querySelectorAll('[data-scroll-nav]').forEach(nav => {
    const header = nav.closest('header');
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const offset = Math.max((header ? header.getBoundingClientRect().height : 76) + 32, scrollPadding);
    const sections = [...nav.querySelectorAll('a[href^="#"]')].map(link => ({
      link, section: document.getElementById(link.hash.slice(1))
    })).filter(item => item.section);
    let current = sections[0];
    sections.forEach(item => {
      item.section.style.scrollMarginTop = Math.max(0, offset - scrollPadding) + 'px';
      if (item.section.getBoundingClientRect().top <= offset + 2) current = item;
    });
    if (window.scrollY > 0 && window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
      current = sections.at(-1);
    }
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      if (current && link === current.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
  pageTopButtons.forEach(button => { button.hidden = window.scrollY < 1; });
}
function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateSiteNavigation);
}
pageTopButtons.forEach(button => button.addEventListener('click', () => {
  window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}));
window.addEventListener('scroll', scheduleNavigationUpdate, {passive:true});
window.addEventListener('resize', scheduleNavigationUpdate);
window.addEventListener('hashchange', scheduleNavigationUpdate);
new MutationObserver(scheduleNavigationUpdate).observe(document.body, {childList:true,subtree:true});
updateSiteNavigation();
