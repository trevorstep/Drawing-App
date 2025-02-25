class DrawingBoard {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private isPainting: boolean = false;
    private lineWidth: number = 5;
    private strokes: [number, number, string, number][][] = [];
    private currentStroke: [number, number, string, number][] = [];

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
        this.canvas.width = window.innerWidth * 0.8; 
        this.canvas.height = window.innerHeight * 0.8; 
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
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;

        this.currentStroke.push([x, y, this.ctx.strokeStyle as string, this.lineWidth]);
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    private stopDrawing(): void {
        if (!this.isPainting) return;
        this.isPainting = false;
    
        if (this.currentStroke.length > 0) {
            console.log("Saving stroke:", this.currentStroke);
            this.strokes.push([...this.currentStroke]); 
            console.log("All strokes after save:", this.strokes);
        } else {
            console.log("No points recorded for this stroke.");
        }
    
        this.currentStroke = [];
    }
    
    

    private draw(e: MouseEvent): void {
        if (!this.isPainting) return;
    
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;
        const color = this.ctx.strokeStyle as string;
    
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
    
        this.currentStroke.push([x, y, color, this.lineWidth]);
        console.log("Drawing point:", x, y, color, this.lineWidth);
    
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
    

    private clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = [];
    }

    private undoLastStroke(): void {
        if (this.strokes.length > 0) {
            console.log("Undoing last stroke...");
            this.strokes.pop();
            console.log("After undo:", this.strokes);
    
            this.redrawCanvas(); 
        } else {
            console.log("No strokes to undo.");
        }
    }    
      

    private redrawCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        console.log("Redrawing canvas...", this.strokes);
        
        this.strokes.forEach(stroke => {
            if (stroke.length === 0) return;
    
            this.ctx.beginPath();
            stroke.forEach(([x, y, color, lineWidth], index) => {
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = lineWidth;
                this.ctx.lineCap = 'round';
    
                if (index === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke(); // Ensure each segment is drawn
                }
            });
    
            this.ctx.beginPath(); // Reset path
        });
    }    
}

try {
    (window as any).drawingBoard = new DrawingBoard('drawing-board', 'toolbar');
} catch (error) {
    console.error("Error initializing drawing board:", error);
}



