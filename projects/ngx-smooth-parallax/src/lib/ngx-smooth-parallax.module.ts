import { NgModule } from '@angular/core';
import { ParallaxDirective } from './parallax.directive';
import { ParallaxComponent } from './parallax/parallax.component';

@NgModule({
  declarations: [
    ParallaxDirective,
    ParallaxComponent

  ],
  imports: [
    
  ],
  exports: [
    ParallaxDirective,
    ParallaxComponent
  ]
})
export class NgxSmoothParallaxModule { }
