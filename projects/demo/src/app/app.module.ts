import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSmoothParallaxModule } from 'projects/ngx-smooth-parallax/src/lib/ngx-smooth-parallax.module';

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
