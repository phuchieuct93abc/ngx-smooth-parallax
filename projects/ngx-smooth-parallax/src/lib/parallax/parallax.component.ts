import {Component, OnInit, ElementRef, Input, NgZone, PLATFORM_ID, ViewChild, AfterContentInit, ContentChild, AfterViewInit} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'ngx-smooth-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.css']
})
export class ParallaxComponent implements AfterViewInit {
  @Input()
  public maxParallax = 0;
  @Input()
  public startOffsetParallax = 0;
  @Input()
  public parallax = false;
  @Input()
  public scrollVelocity = 0.3;


  private hasStartedParallax = false;

  public onDestroy$ = new Subject<void>();
  private observer: IntersectionObserver | null = null;
  private previousTransition: string = '';
  private isNodePlatform = isPlatformServer(PLATFORM_ID);

  private parallaxObserver = new BehaviorSubject<boolean>(true);

  @ViewChild('wrapper')
  private wrapper!: ElementRef<HTMLElement>;

  private requestFrame: number = 0;


  public constructor(
    private zone: NgZone,
    private elementRef: ElementRef<HTMLElement>
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
    this.parallaxObserver.next(this.parallax)
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.observer?.disconnect();
    this.parallaxObserver.complete();
  }

  private getThresholdSet(): number[] {
    const result: number[] = [];
    for (let i = 0; i <= 1; i+=0.1) {  
      result.push(i);
    }
    return result;
  }

  private startParallax(): void {
    this.previousTransition = this.elementRef.nativeElement.style.transition;
    this.wrapper.nativeElement.style.transition = 'transform 0.05s linear';
    this.observer?.disconnect?.();
    this.observer = new IntersectionObserver(
      () => this.updateAnimation(),
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
    this.elementRef.nativeElement.style.transition = this.previousTransition;
    this.observer?.disconnect?.();
    this.updateTransform(0);
  }

  private updateAnimation() {
    cancelAnimationFrame(this.requestFrame);
    this.animate(new Date().getTime())
  }

  private animate(startTime: number) {
    const time = new Date().getTime();
    if (time - startTime > 2000) { 
      return;
    }
    this.requestFrame = requestAnimationFrame(() => { 
      this.updateTransform(this.getIntersectionRatio());
      this.animate(startTime);
    })

   }


  private getIntersectionRatio():number { 
    const { top } = this.elementRef.nativeElement.getBoundingClientRect();
    if (top >= 0) { 
      return 0;
    };
    return (-top+this.startOffsetParallax) * this.scrollVelocity;

  }

  private updateTransform(translateY: number) {
    this.wrapper.nativeElement.style.transform = `translateY(${translateY}px)`; 
  }

}
