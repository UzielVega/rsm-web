import { Directive, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';

// Define the directive with the selector 'appUppercase'.
// The 'standalone: true' option makes this directive self-contained, so it doesn't need to be declared in a module.
@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  // Inject the ElementRef service to get access to the DOM element.
  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Apply titlecase transformation when the directive is initialized
    this.transformToUpperCase();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      // Apply titlecase transformation when the input value changes
      this.transformToUpperCase();
    }
  }

  // Listen to the 'blur' event on the host element (input field).
  @HostListener('blur') onBlur() {
    this.transformToUpperCase();
  }

  // Transform the value of the input field to uppercase when the blur event occurs.
  private transformToUpperCase() {
    // Get the current value of the input field.
    let value: string = this.el.nativeElement.value;
    // Convert the value to uppercase and set it back to the input field.
    this.el.nativeElement.value = value.toUpperCase();
  }
}
