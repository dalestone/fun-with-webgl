import { Component, ViewChild, ElementRef } from '@angular/core';

import { GLService } from './gl/gl.service';
import { GLShaderService } from './gl/gl-shader.sevice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('glcanvas') glcanvas: ElementRef;
  gl: WebGLRenderingContext;

  constructor(
    public glService: GLService,
    public glShaderService: GLShaderService) {}

  ngOnInit() {
    // get our gl context
    this.gl = this.glService.glInstance(this.glcanvas);
    this.glService.setSize(this.gl, 500, 500);    
    this.glService.clear(this.gl);

    // shader steps
    this.glShaderService.getShadersText(['assets/shaders/vertex.shader', 'assets/shaders/fragment.shader']).subscribe((shaders:string[]) => {
      // get vertex and fragment shader text
      let vShaderTxt = shaders[0];
      let fShaderTxt = shaders[1];
      // compile text and validate
      let vShader = this.glShaderService.createShader(this.gl, vShaderTxt, this.gl.VERTEX_SHADER);
      let fShader = this.glShaderService.createShader(this.gl, fShaderTxt, this.gl.FRAGMENT_SHADER);
      // link the shaders together as a program
      let shaderProg = this.glShaderService.createProgram(this.gl, vShader, fShader, true);

      // get location of uniforms and attributes         
      this.gl.useProgram(shaderProg);
      let aPositionLoc = this.gl.getAttribLocation(shaderProg, "a_position");
      let uPointSizeLoc = this.gl.getUniformLocation(shaderProg, "uPointSize");

      this.gl.useProgram(null);

      // set up data buffers
      let aryVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0, 0.2, 0.2, 0]);
      let bufVerts = this.gl.createBuffer();

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufVerts);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, aryVerts, this.gl.STATIC_DRAW);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      // set up for drawing
      this.gl.useProgram(shaderProg); // activate the shader
      this.gl.uniform1f(uPointSizeLoc, 50.0); // store data to the shader's uniform variable

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufVerts);
      this.gl.enableVertexAttribArray(aPositionLoc);
      this.gl.vertexAttribPointer(aPositionLoc, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      this.gl.drawArrays(this.gl.POINTS, 0, aryVerts.length / 3);
    });
  }
}

