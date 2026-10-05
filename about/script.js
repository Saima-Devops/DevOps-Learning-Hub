const email = 'saimausman.dxb@gmail.com';
const status = document.getElementById('copy-status');
document.getElementById('copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Email: ' + email;
  }
});

const navigationLinks = [...document.querySelectorAll('nav a')];
const sections = navigationLinks.map(link => document.querySelector(link.getAttribute('href')));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}
