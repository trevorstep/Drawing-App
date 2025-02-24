"use strict";
const canvas = document.getElementById('drawing-board');
const toolbarElement = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
}
const rect = canvas.getBoundingClientRect();
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;
let isPainting = false;
let lineWidth = 5;
let startX = 0;
let startY = 0;
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
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
};
canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
    ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
});
canvas.addEventListener('mouseup', () => {
    isPainting = false;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);
