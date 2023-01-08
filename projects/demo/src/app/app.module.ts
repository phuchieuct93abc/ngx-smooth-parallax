import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSmoothParallaxModule } from 'ngx-smooth-parallax';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxSmoothParallaxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
