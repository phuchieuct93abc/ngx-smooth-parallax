import { Component, OnInit, ElementRef, Input, NgZone, PLATFORM_ID, ViewChild, AfterContentInit, ContentChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'ngx-smooth-parallax',
  templateUrl: './parallax.component.html',
})
export class ParallaxComponent implements AfterViewInit {
  @Input()
  public startOffsetParallax = 0;

  @Input()
  public set parallax(value:boolean) {
    this.parallaxObserver.next(value);
  }
  @Input()
  public scrollVelocity = 7;

  public onDestroy$ = new Subject<void>();
  private observer: IntersectionObserver | null = null;
  private isNodePlatform = isPlatformServer(PLATFORM_ID);

  private parallaxObserver = new BehaviorSubject<boolean>(true);
  private inertia = 2000;
  @ViewChild('wrapper')
  private wrapper!: ElementRef<HTMLElement>;

  private requestFrame: number = 0;
  thresholdSet = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

  public constructor(
    private zone: NgZone,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit(): void {
    if (this.isNodePlatform) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.parallaxObserver.subscribe((enableParallax) => {

        if (enableParallax) {
          this.startParallax();
        } else {
          this.stopParallax();
        }
      });
      
    });
  }

  public ngOnDestroy(): void {
    this.stopParallax();
    this.onDestroy$.next();
    this.observer?.disconnect();
    this.parallaxObserver.complete();
  }

  private startParallax(): void {
    this.observer?.disconnect?.();
    this.observer = new IntersectionObserver(
      () => this.updateAnimation(),
      {
        root: null,
        rootMargin: `${0 - this.startOffsetParallax}px 0px 0px 0px`,
        threshold: this.thresholdSet,
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  private stopParallax(): void {
    if (this.isNodePlatform) {
      return;
    }
    cancelAnimationFrame(this.requestFrame);
    this.observer?.disconnect?.();
    this.updateTransform(0);

  }

  private updateAnimation() {
    cancelAnimationFrame(this.requestFrame);
    this.animate(new Date().getTime())
  }

  private animate(startTime: number) {
    const time = new Date().getTime();
    if (time - startTime > this.inertia) {
      return;
    }
    this.requestFrame = requestAnimationFrame(() => {
      this.updateTransform(this.getIntersectionRatio());
      this.animate(startTime);
    })

  }

  private getIntersectionRatio(): number {
    const top = this.elementRef.nativeElement.getBoundingClientRect().top - this.startOffsetParallax;
    if (top >= 0) {
      return 0;
    };
    return Math.min(-top * (this.scrollVelocity / 10), this.elementRef.nativeElement.offsetHeight * 0.7);

  }

  private updateTransform(translateY: number) {
    this.wrapper.nativeElement.style.transform = `translateY(${translateY}px)`;
  }

}
