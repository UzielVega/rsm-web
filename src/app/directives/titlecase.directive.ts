import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appTitlecase]',
  standalone: true,
})
export class TitlecaseDirective implements OnInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  // Apply titlecase transformation when the directive is initialized
  ngOnInit() {
    this.transformToTitleCase();
  }

  // Apply titlecase transformation when the input field loses focus
  @HostListener('blur') onBlur() {
    this.transformToTitleCase();
  }

  // Transform the current value of the input field to titlecase
  private transformToTitleCase() {
    const inputElement = this.el.nativeElement;
    inputElement.value = this.toTitleCase(inputElement.value);
  }

  // Convert a string to titlecase format
  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}