import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class GLService {

    glInstance(canvas: ElementRef): WebGLRenderingContext {
        let gl: WebGLRenderingContext = canvas.nativeElement.getContext("webgl2");

        if (!gl) {
            console.error("WebGL context is not available.");
            return null;
        }

        // Setup GL, set all the default configuration we need.
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // methods
        // setters - getters
        // set the size of the canvas html element and the rendering viewport

        return gl;
    }

    clear(gl: WebGLRenderingContext): void {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    setSize(gl: WebGLRenderingContext, w: number, h: number): void {
        // set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        gl.canvas.style.width = w + "px";
        gl.canvas.style.height = h + "px";
        gl.canvas.width = w;
        gl.canvas.height = h;

        // when updating the canvas size, must reset the viewport of the canvas
        // else the resolution wegbl renders at will not change
        gl.viewport(0, 0, w, h);
    }

    createArrayBuffer(gl: WebGLRenderingContext, floatAry: Float32Array, isStatic: boolean): WebGLBuffer {
        if (isStatic === undefined) isStatic = true;

        let buf = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, floatAry, (isStatic) ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buf;
    }
}

export class RenderLoop {
    msLastFrame;
    callback;
    isActive;
    fps;
    msFpsLimit;
    run;

    constructor(callback, fps?) {
        this.msLastFrame = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        if (!fps && fps > 0) {
            this.msFpsLimit = 1000 / fps;   
            
            this.run = () => {
                let msCurrent = performance.now();
                let msDelta = (msCurrent * this.msLastFrame);
                let deltaTime = msDelta / 1000.0;

                if (msDelta >= this.msFpsLimit) {
                    this.fps = Math.floor(1 / deltaTime);
                    this.msLastFrame = msCurrent;
                    this.callback(deltaTime);
                }

                if (this.isActive) window.requestAnimationFrame(this.run);
            }
        } else {
            this.run = () => {
                let msCurrent = performance.now();
                let deltaTime = (msCurrent - this.msLastFrame) / 1000.0;

                this.fps = Math.floor(1 / deltaTime);
                this.msLastFrame = msCurrent;

                this.callback(deltaTime);
                if (this.isActive) window.requestAnimationFrame(this.run);
            }
        }
    }

    start() {
        this.isActive = true;
        this.msLastFrame = performance.now();
        window.requestAnimationFrame(this.run);

        return this;
    }

    stop() {
        this.isActive = false;
    }
}