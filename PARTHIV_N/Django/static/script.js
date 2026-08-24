document.addEventListener('DOMContentLoaded', () => {
  const pageShell = document.querySelector('.page-shell');

  if (!pageShell) return;

  const particleLayer = document.createElement('div');
  particleLayer.className = 'particle-layer';
  pageShell.appendChild(particleLayer);

  const particleCount = 18;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 6}s`;
    particle.style.animationDuration = `${6 + Math.random() * 6}s`;
    particleLayer.appendChild(particle);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section, .mission-card, .skill-card, .profile-card, .combat-card').forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
});
