const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openSheet: HTMLElement | null = null;
let opener: HTMLElement | null = null;

function close() {
  if (!openSheet) return;
  openSheet.classList.remove('open');
  openSheet.hidden = true;
  document.documentElement.classList.remove('sheet-open');
  opener?.focus();
  openSheet = null;
  opener = null;
}

function open(sheet: HTMLElement, from: HTMLElement) {
  if (openSheet) close();
  openSheet = sheet;
  opener = from;
  sheet.hidden = false;
  document.documentElement.classList.add('sheet-open');
  requestAnimationFrame(() => sheet.classList.add('open'));
  sheet.querySelector<HTMLElement>('h3')?.focus();
}

function trapTab(e: KeyboardEvent) {
  if (!openSheet || e.key !== 'Tab') return;
  const items = [...openSheet.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === openSheet.querySelector('h3'))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

document.querySelectorAll<HTMLAnchorElement>('[data-sheet]').forEach((icon) => {
  icon.addEventListener('click', (e) => {
    const sheet = document.getElementById(`sheet-${icon.dataset.sheet}`);
    if (!sheet) return; // no sheet rendered: let the link navigate
    e.preventDefault();
    open(sheet, icon);
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-close]').forEach((btn) => btn.addEventListener('click', close));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openSheet) {
    e.preventDefault();
    close();
  }
  trapTab(e);
});
