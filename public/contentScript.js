// // Example of dynamically creating an HTML structure
// const container = document.createElement('div');
// container.style.position = 'fixed';
// container.style.bottom = '20px';
// container.style.right = '20px';
// container.style.backgroundColor = 'white';
// container.style.border = '1px solid black';
// container.style.padding = '10px';
// container.style.zIndex = '10000'; // Ensure it's above most other content
// container.innerHTML = `
//   <div>Your popup content here</div>
//   <button id="close-btn">Close</button>
// `;

// document.body.appendChild(container);

// // Optionally, add functionality to remove the popup
// document.getElementById('close-btn').addEventListener('click', () => {
//   container.remove();
// });

// This code goes in a content script or is injected by your background script
const appRoot = document.createElement('div');
appRoot.id = 'popup-app';
document.body.appendChild(appRoot);

