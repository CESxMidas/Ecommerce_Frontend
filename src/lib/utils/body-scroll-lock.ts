let lockCount = 0;
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

/** Lock body scroll without shifting layout when the scrollbar disappears. */
export function lockBodyScroll(): () => void {
  lockCount += 1;

  if (lockCount === 1) {
    savedBodyOverflow = document.body.style.overflow;
    savedBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  return () => {
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      document.body.style.overflow = savedBodyOverflow;
      document.body.style.paddingRight = savedBodyPaddingRight;
    }
  };
}
