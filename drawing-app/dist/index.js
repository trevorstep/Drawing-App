"use strict";
class DrawingBoard {
    constructor(canvasId, toolbarId) {
        this.isPainting = false;
        this.lineWidth = 5;
        this.strokes = [];
        this.currentStroke = [];
        const canvasElement = document.getElementById(canvasId);
        const toolbarElement = document.getElementById(toolbarId);
        if (!canvasElement || !toolbarElement) {
            throw new Error("Canvas or toolbar element not found");
        }
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error("Failed to get canvas 2D context");
        }
        this.setupCanvas();
        this.addEventListeners(toolbarElement);
    }
    setupCanvas() {
        this.canvas.width = window.innerWidth * 0.8; // Adjust canvas width dynamically
        this.canvas.height = window.innerHeight * 0.8; // Adjust canvas height dynamically
    }
    addEventListeners(toolbar) {
        toolbar.addEventListener('click', (e) => this.handleToolbarClick(e));
        toolbar.addEventListener('change', (e) => this.handleToolbarChange(e));
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    }
    handleToolbarClick(e) {
        const target = e.target;
        if (target.id === 'clear') {
            this.clearCanvas();
        }
        else if (target.id === 'undo') {
            this.undoLastStroke();
        }
    }
    handleToolbarChange(e) {
        const target = e.target;
        if (target.id === 'stroke') {
            this.ctx.strokeStyle = target.value;
        }
        if (target.id === 'lineWidth') {
            this.lineWidth = parseInt(target.value, 10);
        }
    }
    startDrawing(e) {
        this.isPainting = true;
        this.currentStroke = [];
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;
        this.currentStroke.push([x, y, this.ctx.strokeStyle, this.lineWidth]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }
    stopDrawing() {
        this.isPainting = false;
        if (this.currentStroke.length > 0) {
            this.strokes.push([...this.currentStroke]);
        }
        this.ctx.beginPath(); // Reset path
    }
    draw(e) {
        if (!this.isPainting)
            return;
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;
        const color = this.ctx.strokeStyle;
        this.currentStroke.push([x, y, color, this.lineWidth]);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = [];
    }
    undoLastStroke() {
        if (this.strokes.length > 0) {
            this.strokes.pop();
            this.redrawCanvas();
        }
    }
    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes.forEach(stroke => {
            this.ctx.beginPath();
            stroke.forEach(([x, y, color, lineWidth], index) => {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = lineWidth;
                this.ctx.lineCap = 'round';
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                }
                else {
                    this.ctx.lineTo(x, y);
                }
                this.ctx.stroke();
            });
        });
    }
}
// Initialize the drawing board
try {
    new DrawingBoard('drawing-board', 'toolbar');
}
catch (error) {
    console.error("Error initializing drawing board:", error);
}
