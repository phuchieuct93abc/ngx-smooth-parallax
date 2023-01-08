# NgxSmoothParallax
## [DEMO](https://stackblitz.com/edit/angular-ivy-mftzqa)
## Get started:
### Install:
```
npm i ngx-smooth-parallax
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
    <ngx-smooth-parallax [startOffsetParallax]="300">
      <img
        style="height:200px"
        [parallax]="true"
        src="https://picsum.photos/1000/300"
      />
    </ngx-smooth-parallax>
  </div>
  <div>
    Content
  </div>
</div>

```

### Options
| Name          | Description |
| ------------- | ------------- |
| parallax | `type:boolean` : True to enable parallax effect, otherwise false to turn it off. *Default: true*   |
| startOffsetParallax  |`type: number` Offset top to start parallax  *Default: 0*  |
| scrollVelocity  |`type: number` The parallax velocity, value from 0 - 10  *Default: 0*  |