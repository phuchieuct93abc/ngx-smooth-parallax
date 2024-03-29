import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  NgZone,
  PLATFORM_ID,
  AfterViewInit,
  OnChanges,
  
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Directive({
  selector: '[parallax]',
})
export class ParallaxDirective implements OnDestroy, AfterViewInit, OnChanges {
  @Input()
  public maxParallax = 0;
  @Input()
  public startOffsetParallax = 0;
  @Input()
  public parallax = false;
  @Input()
  public scrollVelocity = 0.3;
  @Input()
  public animation = false;

  @Input()
  public log = false;

  private hasStartedParallax = false;

  public onDestroy$ = new Subject<void>();
  private observer: IntersectionObserver | null = null;
  private previousTransition: string = '';
  private isNodePlatform = isPlatformServer(PLATFORM_ID);

  private parallaxObserver = new BehaviorSubject<boolean>(true);

  public constructor(
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone
  ) {}

  ngOnChanges(): void {
    this.parallaxObserver.next(this.parallax);
  }

  ngAfterViewInit(): void {
    if (this.isNodePlatform) {
      return;
    }
    this.parallaxObserver.subscribe(() => {
      this.zone.runOutsideAngular(() => {
        if(this.hasStartedParallax){
          this.stopParallax();
          this.hasStartedParallax = false;
        }

        if (this.parallax) {
          this.startParallax();
          this.hasStartedParallax = true;

        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.observer?.disconnect();
    this.parallaxObserver.complete();
  }

  private getThresholdSet(): number[] {
    let step = 1 / this.elementRef.nativeElement.offsetHeight;
    const result: number[] = [];
    for (let i = 0; i <= 1; i+=step) {  
      result.push(i);
    }
    return result;
  }

  private startParallax(): void {
    if (this.animation) { 
      this.previousTransition = this.elementRef.nativeElement.style.transition;
      this.elementRef.nativeElement.style.transition = 'transform 0.05s linear';
    }
   
    this.observer?.disconnect?.();
    this.observer = new IntersectionObserver(
      (entries) => this.updateAnimation(entries),
      {
        root:null,
        rootMargin: `${0 - this.startOffsetParallax}px 0px 0px 0px`,
        threshold: this.getThresholdSet(),
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  private stopParallax(): void {
    if (this.isNodePlatform) {
      return;
    }
    if (this.animation) { 
      this.elementRef.nativeElement.style.transition = this.previousTransition;
    }
    this.observer?.disconnect?.();
    this.updateTransform(0);
  }

  private updateAnimation([entry]: IntersectionObserverEntry[]) {
    this.log && console.log('Start update animation');
    const underViewFold = entry.boundingClientRect.bottom > window.innerHeight

    if (underViewFold ) {
      this.log && console.log('prevent parallax when under view fold');

      // prevent parallax when under view fold
      this.updateTransform(0);
      return;
    }
    const deltaY = (1 - (entry.intersectionRect.height / entry.boundingClientRect.height)) * this.scrollVelocity * 100;
    this.log && console.log('intersectionRatio deltaY',entry,deltaY);

    this.updateTransform(deltaY);
  }

  private updateTransform(translateY: number) {
    this.log && console.log('tofixed deltaY',translateY.toFixed(1));

    this.elementRef.nativeElement.style.transform = `translateY(${translateY.toFixed(2)}%)`;
  }
}
