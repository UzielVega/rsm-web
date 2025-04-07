import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormService {
  private errorMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio',
    email: 'Correo electrónico inválido',
    minlength: 'Mínimo de caracteres no alcanzado',
    maxlength: 'Máximo de caracteres excedido',
    mismatch: 'Las contraseñas no coinciden',
    pattern: 'El formato es inválido',
    max: 'El valor es demasiado alto',
    min: 'El valor es demasiado bajo',
    date: 'Fecha inválida',
    number: 'Número inválido',
    url: 'URL inválida',
    phone: 'Número de teléfono inválido',
    passwordValidated: 'Contraseña temporal inválida',
  };
  constructor() {}
  getErrorMessage(
    form: FormGroup,
    controlName: string
  ): string | null {
    const control = form.get(controlName);
    
    if (control?.touched && control.invalid) {
      const errors = control.errors;

      if (errors) {
        for (const key of Object.keys(errors)) {
          return this.errorMessages[key];
        }
      }
    }
    return null;
  }

  validateStepForm(
    form: FormGroup,
    nextCallback: any,
    controlName: string[]
  ): void {
    let errors: number = 0;

    controlName.forEach((controlName) => {
      let control = form.get(controlName);
      if (control?.invalid) {
        control.markAsTouched();
        errors++;
      }
    });

    if (errors > 0) {
      return;
    }
    nextCallback.emit();
  }

  passwordMatchValidator(form: FormGroup): void {
    const password = form.get('password');
    const passwordConfirm = form.get('passwordConfirm');
    if (
      password &&
      passwordConfirm &&
      password.value !== passwordConfirm.value
    ) {
      passwordConfirm.setErrors({ mismatch: true });
    } else {
      passwordConfirm?.setErrors(null);
    }
  }
}
