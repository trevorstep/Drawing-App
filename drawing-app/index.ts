class DrawingBoard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isPainting: boolean = false;
    private lineWidth: number = 5;
    private strokes: [number, number, string, number][][] = []; // Stores drawn strokes (tuples)
    private currentStroke: [number, number, string, number][] = []; // Stores points for the current stroke

    constructor(canvasId: string, toolbarId: string) {
        const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        const toolbarElement = document.getElementById(toolbarId) as HTMLDivElement;

        if (!canvasElement || !toolbarElement) {
            throw new Error("Canvas or toolbar element not found");
        }

        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        if (!this.ctx) {
            throw new Error("Failed to get canvas 2D context");
        }

        this.setupCanvas();
        this.addEventListeners(toolbarElement);
    }

    private setupCanvas(): void {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = window.innerWidth - this.canvas.offsetLeft;
        this.canvas.height = window.innerHeight - this.canvas.offsetTop;
    }

    private addEventListeners(toolbar: HTMLDivElement): void {
        toolbar.addEventListener('click', (e: MouseEvent) => this.handleToolbarClick(e));
        toolbar.addEventListener('change', (e: Event) => this.handleToolbarChange(e));

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => this.startDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.draw(e));
    }

    private handleToolbarClick(e: MouseEvent): void {
        const target = e.target as HTMLElement;
        if (target.id === 'clear') {
            this.clearCanvas();
        } else if (target.id === 'undo') {
            this.undoLastStroke();
        }
    }

    private handleToolbarChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        if (target.id === 'stroke') {
            this.ctx.strokeStyle = target.value;
        }
        if (target.id === 'lineWidth') {
            this.lineWidth = parseInt(target.value, 10);
        }
    }

    private startDrawing(e: MouseEvent): void {
        this.isPainting = true;
        this.currentStroke = [];
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }

    private stopDrawing(): void {
        this.isPainting = false;
        this.ctx.beginPath();

        if (this.currentStroke.length > 0) {
            this.strokes.push([...this.currentStroke]);
        }
    }

    private draw(e: MouseEvent): void {
        if (!this.isPainting) return;

        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;
        const color = this.ctx.strokeStyle as string;

        this.currentStroke.push([x, y, color, this.lineWidth]); // Storing as a tuple

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    private clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = []; // Clear stroke history
    }

    private undoLastStroke(): void {
        this.strokes.pop(); // Remove last stroke
        this.redrawCanvas();
    }

    private redrawCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes.forEach(stroke => {
            this.ctx.beginPath();
            stroke.forEach(([x, y, color, lineWidth], index) => {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = lineWidth;
                this.ctx.lineCap = 'round';

                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
            });
        });
    }
}

// Initialize the drawing board
try {
    new DrawingBoard('drawing-board', 'toolbar');
} catch (error) {
    console.error("Error initializing drawing board:", error);
}
