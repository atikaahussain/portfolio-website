let highestZIndex = 1000; // Initial base z-index

document.querySelectorAll('.icon-buttons button').forEach((button) => {
  button.addEventListener('click', () => {
    const label = button.querySelector('span')?.textContent?.toLowerCase() || 'box';

    // ✅ Only one floating box per label
    if (document.querySelector(`.floating-box[data-id="${label}"]`)) return;

    const template = document.getElementById(`template-${label}`);
    if (!template) return;

    const newBox = template.content.cloneNode(true).children[0];
    newBox.classList.add('floating-box');
    newBox.style.position = 'fixed';
    newBox.style.visibility = 'hidden';
    newBox.style.zIndex = ++highestZIndex; // Assign new top z-index
    document.body.appendChild(newBox);

    const boxRect = newBox.getBoundingClientRect();
    const maxLeft = window.innerWidth - boxRect.width;
    const maxTop = window.innerHeight - boxRect.height;
    const x = Math.max(0, Math.random() * maxLeft);
    const y = Math.max(0, Math.random() * maxTop);
    newBox.style.left = `${x}px`;
    newBox.style.top = `${y}px`;
    newBox.style.visibility = 'visible';

    // ✅ Close button
    newBox.querySelector('.close-btn')?.addEventListener('click', () => {
      newBox.remove();
    });

    // ✅ Bring box to front when clicked anywhere inside it
    newBox.addEventListener('mousedown', () => {
      newBox.style.zIndex = ++highestZIndex;
    });

    // ✅ Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const dragBar = newBox.querySelector('.boxes-navbar');

    if (dragBar) {
      dragBar.style.cursor = 'grab';

      dragBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - newBox.offsetLeft;
        offsetY = e.clientY - newBox.offsetTop;
        newBox.style.zIndex = ++highestZIndex; // Bring to front when dragging
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newLeft = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - newBox.offsetWidth));
        const newTop = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - newBox.offsetHeight));
        newBox.style.left = `${newLeft}px`;
        newBox.style.top = `${newTop}px`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  });
});
