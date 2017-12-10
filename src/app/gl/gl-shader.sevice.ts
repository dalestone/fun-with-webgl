import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from "rxjs/observable/forkJoin";

@Injectable()
export class GLShaderService {

    constructor(public httpClient: HttpClient) {

    }

    /**
     * Load shader from text file
     * @param url 
     */
    getShaderText(url: string) {
        return this.httpClient.get(url, { responseType: 'text' });
    }

    /**
     * Load shaders from text files
     * @param urls 
     */
    getShadersText(urls: string[]) {
        let shaders = [];

        urls.forEach((url:string) => {
            let shaderText = this.httpClient.get(url, { responseType: 'text' });
            shaders.push(shaderText);
        });

        return forkJoin(shaders);
    }

    createShader(gl: WebGLRenderingContext, src: string, type: number): WebGLShader {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        // get error data if shader failed compiling
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader : " + src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createProgram(gl: WebGLRenderingContext, vShader, fShader, doValidate: boolean): WebGLProgram {
        // link shaders together
        let prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);
        gl.linkProgram(prog);

        // check if successful
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }

        // only do this for additional debugging.
        if (doValidate) {
            gl.validateProgram(prog);
            if(!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                console.error("Error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        // can delete the shaders since the program has been made
        gl.detachShader(prog, vShader);
        gl.detachShader(prog, fShader);
        gl.deleteShader(fShader);
        gl.deleteShader(vShader);

        return prog;
    }

    createShaderProgram(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram {
      // compile text and validate
      let vShader = this.createShader(gl, vertexShader, gl.VERTEX_SHADER);
      let fShader = this.createShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
      
      // link the shaders together as a program
      let shaderProg = this.createProgram(gl, vShader, fShader, true);

      return shaderProg;
    }
}