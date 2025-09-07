// Simple Chat Widget
console.log('Chat widget script loaded');

// Create widget immediately
function createSimpleWidget() {
    console.log('Creating simple widget...');
    
    // Create button
    const button = document.createElement('button');
    button.innerHTML = '🔧 Need help?';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        height: 50px;
        padding: 0 20px;
        border-radius: 25px;
        background: #2D8C8C;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(45, 140, 140, 0.3);
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10000;
    `;
    
    button.onclick = function() {
        alert('Chat widget clicked! This is working.');
    };
    
    document.body.appendChild(button);
    console.log('Simple widget created and added to page');
}

// Try to create immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSimpleWidget);
} else {
    createSimpleWidget();
}
