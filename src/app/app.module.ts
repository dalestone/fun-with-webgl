import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { GLService } from './gl/gl.service';
import { GLShaderService } from './gl/gl-shader.sevice';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ GLService, GLShaderService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
