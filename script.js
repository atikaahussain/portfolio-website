let highestZIndex = 1000; // make sure every new box appears infront of the other already present boxes

// loop through each button in the main box
document.querySelectorAll('.icon-buttons button').forEach((button) => {
  button.addEventListener('click', () => {
    const label = button.querySelector('span')?.textContent?.toLowerCase();

    // to prevent duplicate boxes
    if (document.querySelector(`.floating-box[data-id="${label}"]`)) return;

    // getting the corresponding template box
    const template = document.getElementById(`template-${label}`);
    if (!template) return; //check if not found

    // cloning the content of the template
     //marking it as a floating box
    const newBox = template.content.cloneNode(true).children[0];
    newBox.classList.add('floating-box');
    newBox.style.position = 'fixed';
    newBox.style.visibility = 'hidden';
    newBox.style.zIndex = ++highestZIndex;

    document.body.appendChild(newBox); // Add to the page

    //randomly position the box 
    //some mathematics
    const boxRect = newBox.getBoundingClientRect();
    const maxLeft = window.innerWidth - boxRect.width;
    const maxTop = window.innerHeight - boxRect.height;
    const x = Math.max(0, Math.random() * maxLeft);
    const y = Math.max(0, Math.random() * maxTop);
    newBox.style.left = `${x}px`;
    newBox.style.top = `${y}px`;
    newBox.style.visibility = 'visible'; // Show the box now

    // removing the box when clicked
    newBox.querySelector('.close-btn')?.addEventListener('click', () => {
      newBox.remove();
    });

    //make box to the front when ever it is clicked
    newBox.addEventListener('mousedown', () => {
      newBox.style.zIndex = ++highestZIndex;
    });

    // Dragging logic through navbar
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const dragBar = newBox.querySelector('.boxes-navbar');

    if (dragBar) {
      dragBar.style.cursor = 'grab';

      //Start dragging when mouse is pressed on navbar
      dragBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - newBox.offsetLeft;
        offsetY = e.clientY - newBox.offsetTop;
        newBox.style.zIndex = ++highestZIndex;
      });

      // Moving the box by dragging
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Clampwithin viewport bounds
        const newLeft = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - newBox.offsetWidth));
        const newTop = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - newBox.offsetHeight));
        newBox.style.left = `${newLeft}px`;
        newBox.style.top = `${newTop}px`;
      });

      //Stop dragging on release
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  });
});
