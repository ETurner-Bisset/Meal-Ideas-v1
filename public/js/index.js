const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');
const closeModalBtn = document.querySelector('.modal__close');
const openAboutBtns = document.querySelectorAll('.open-about');
const topBtns = document.querySelectorAll('.top-page');
const singleTopBtn = document.querySelector('.top-page-scroll');

// Open and close about modal
openAboutBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    modal.classList.add('open-modal');
    backdrop.classList.add('show-backdrop');
  });
});

const closeModal = () => {
  modal.classList.remove('open-modal');
  backdrop.classList.remove('show-backdrop');
};

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (backdrop) {
  backdrop.addEventListener('click', closeModal);
}

// Scroll to top of page
const topScroll = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

if (topBtns) {
  topBtns.forEach((btn) => {
    btn.addEventListener('click', topScroll);
  });
}

if (singleTopBtn) {
  document.addEventListener('scroll', (e) => {
    let scrollHeight = window.scrollY;
    if (
      scrollHeight >= 500 &&
      document.querySelector('body').clientWidth > 960
    ) {
      console.log();
      singleTopBtn.classList.add('show-top-page');
      singleTopBtn.addEventListener('click', topScroll);
    } else if (scrollHeight < 500) {
      singleTopBtn.classList.remove('show-top-page');
    }
  });
}
