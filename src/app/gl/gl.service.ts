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
}