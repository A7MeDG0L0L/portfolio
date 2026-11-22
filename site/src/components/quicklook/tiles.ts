document.querySelectorAll<HTMLElement>('[data-expand]').forEach((tile) => {
  tile.setAttribute('aria-expanded', 'false');
  tile.addEventListener('click', (e) => {
    e.preventDefault();
    const grow = !tile.classList.contains('big');
    tile.parentElement?.querySelectorAll('[data-expand]').forEach((t) => {
      t.classList.remove('big');
      t.setAttribute('aria-expanded', 'false');
    });
    if (grow) {
      tile.classList.add('big');
      tile.setAttribute('aria-expanded', 'true');
    }
  });
});
