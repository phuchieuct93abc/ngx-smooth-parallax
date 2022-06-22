# NgxSmoothParallax
## [DEMO](https://angular-ivy-mftzqa.stackblitz.io)
## How to use:
### Install:
```
npm i ngx-smooth-scroll
```
### Import module
```
import { NgxSmoothParallaxModule } from 'ngx-smooth-parallax';

@NgModule({
    imports: [...
        NgxSmoothParallaxModule
    ],
    ...
})
export class AppModule {}

```
### User directive with overflow:hidden wrapper:
```
<div class="scroll-element" style="height: 200vh">
  <div class="parallax-wrapper" style="overflow:hidden">
    <img
      style="height:200px"
      [parallax]="true"
      src="https://picsum.photos/1000/300"
    />
  </div>

  <div>
    Content
  </div>
</div>

```