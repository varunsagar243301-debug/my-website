// 1. Silent Right-Click Block (Poore page par)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault(); 
}, false);

// 2. Keyboard Shortcuts Block (Inspect Element, Save, etc.)
document.onkeydown = function(e) {
    if (e.ctrlKey && 
        (e.keyCode === 67 || // Ctrl+C (Copy)
         e.keyCode === 85 || // Ctrl+U (View Source)
         e.keyCode === 83 || // Ctrl+S (Save)
         e.keyCode === 73 || // Ctrl+Shift+I (Inspect)
         e.keyCode === 123)) { // F12
        return false;
    }
};

// 3. Image Dragging Block
document.addEventListener('dragstart', function(e) {
    if (e.target.nodeName === 'IMG') {
        e.preventDefault();
    }
}, false);