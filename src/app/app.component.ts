import { Component, ViewChild, ElementRef } from '@angular/core';

import { GLService, RenderLoop } from './gl/gl.service';
import { GLShaderService } from './gl/gl-shader.sevice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('glcanvas') glcanvas: ElementRef;
  gl: WebGLRenderingContext;
  gVertCnt = 0;
  uPointSizeLoc: WebGLUniformLocation;
  uAngle: WebGLUniformLocation;
  gRLoop;
  RLoop;
  gPointSize = 0;
  gPSizeStep = 3;
  gAngle = 0;
  gAngleStep = (Math.PI / 180.0) * 90; // 90 degrees in Radians

  constructor(
    public glService: GLService,
    public glShaderService: GLShaderService) { }

  ngOnInit() {
    // get our gl context
    this.gl = this.glService.glInstance(this.glcanvas);
    this.glService.setSize(this.gl, 500, 500);
    this.glService.clear(this.gl);

    // shader steps
    this.glShaderService.getShadersText(['assets/shaders/vertex.shader', 'assets/shaders/fragment.shader']).subscribe((shaders: string[]) => {
      let shaderProg = this.glShaderService.createShaderProgram(this.gl, shaders[0], shaders[1]);

      // get location of uniforms and attributes         
      this.gl.useProgram(shaderProg);
      let aPositionLoc = this.gl.getAttribLocation(shaderProg, "a_position");
      
      this.uAngle = this.gl.getUniformLocation(shaderProg, "uAngle");
      this.uPointSizeLoc = this.gl.getUniformLocation(shaderProg, "uPointSize");
      this.gl.useProgram(null);

      // set up data buffers
      let aryVerts = new Float32Array([0, 0, 0]);
      let bufVerts = this.glService.createArrayBuffer(this.gl, aryVerts, true);

      this.gVertCnt = aryVerts.length / 3;

      // set up for drawing
      this.gl.useProgram(shaderProg); // activate the shader
      //this.gl.uniform1f(uPointSizeLoc, 50.0); // store data to the shader's uniform variable

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufVerts);
      this.gl.enableVertexAttribArray(aPositionLoc);
      this.gl.vertexAttribPointer(aPositionLoc, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

      //this.gl.drawArrays(this.gl.POINTS, 0, this.gVertCnt);
      let onRender = (dt) => {
        this.gPointSize += this.gPSizeStep * dt;
        let size = (Math.sin(this.gPointSize) * 10.0) + 30.0;        
        this.gl.uniform1f(this.uPointSizeLoc, size);

        this.gAngle += this.gAngleStep * dt;
        this.gl.uniform1f(this.uAngle, this.gAngle);

        this.glService.clear(this.gl);
        this.gl.drawArrays(this.gl.POINTS, 0, this.gVertCnt);
      }

      this.RLoop = new RenderLoop(onRender).start();
    });
  }
}

