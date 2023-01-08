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
export class ParallaxDirective {
  
}
