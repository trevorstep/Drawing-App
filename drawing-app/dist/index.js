"use strict";
const canvas = document.getElementById('drawing-board');
const toolbarElement = document.getElementById('toolbar');
if (!canvas || !toolbar) {
    throw new Error("Canvas or toolbar element not found");
}
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
}
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;
let isPainting = false;
let lineWidth = 5;
let startX = 0;
let startY = 0;
if (!toolbarElement) {
    throw new Error("Toolbar element not found");
}
toolbarElement.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});
toolbarElement.addEventListener('change', (e) => {
    const target = e.target;
    if (target.id === 'stroke') {
        ctx.strokeStyle = target.value;
    }
    if (target.id === 'lineWidth') {
        lineWidth = parseInt(target.value, 10);
    }
});
const draw = (e) => {
    if (!isPainting || !ctx)
        return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
};
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});
canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);
