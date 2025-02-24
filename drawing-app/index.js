var canvas = document.getElementById('drawing-board');
var toolbarElement = document.getElementById('toolbar');
if (!canvas || !toolbar) {
    throw new Error("Canvas or toolbar element not found");
}
var ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error("Failed to get canvas 2D context");
}
var canvasOffsetX = canvas.offsetLeft;
var canvasOffsetY = canvas.offsetTop;
canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;
var isPainting = false;
var lineWidth = 5;
var startX = 0;
var startY = 0;
if (!toolbarElement) {
    throw new Error("Toolbar element not found");
}
toolbarElement.addEventListener('click', function (e) {
    var target = e.target;
    if (target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});
toolbarElement.addEventListener('change', function (e) {
    var target = e.target;
    if (target.id === 'stroke') {
        ctx.strokeStyle = target.value;
    }
    if (target.id === 'lineWidth') {
        lineWidth = parseInt(target.value, 10);
    }
});
var draw = function (e) {
    if (!isPainting || !ctx)
        return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
    ctx.stroke();
};
canvas.addEventListener('mousedown', function (e) {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});
canvas.addEventListener('mouseup', function () {
    isPainting = false;
    ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
});
canvas.addEventListener('mousemove', draw);
