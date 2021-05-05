import { Component, Input, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from "@angular/animations";

interface ImageSrc{
  src: string
}

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit {
  @Input() slides: string[];
  currentSlide = 0;

  constructor() { }

  ngOnInit(): void {
    this.preloadImages();
  }

  preloadImages() {
    for (const slide of this.slides) {
      new Image().src = slide;
    }
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }
}
