import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  UserService,
  RoleService,
  FormService,
  SocketsService,
  ErrorHandlerService,
} from '../../../../../services';
import { Role, User } from '../../../../../interfaces';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-create-user',
  templateUrl: './form-create-user.component.html',
  styleUrl: './form-create-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCreateUserComponent {
  private destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private rolService = inject(RoleService);
  private socketService = inject(SocketsService);
  private errorHandlerService = inject(ErrorHandlerService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private formsService = inject(FormService);
  public roles = toSignal<Role[]>(this.rolService.getAll());
  form!: FormGroup;
  gender: any;
  stepperActive = signal<number>(0);

  imageFile = signal<File | undefined>(undefined);

  ngOnInit() {
    this.buildForm();

    this.gender = [
      { name: 'Femenino', code: 'f' },
      { name: 'Masculino', code: 'm' },
    ];
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hola(step: number) {
    this.stepperActive.set(step);
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(this.form, controlName);
  }

  validateForm(nextCallback: any, controlName: string[]) {
    this.formsService.validateStepForm(this.form, nextCallback, controlName);
  }

  passwordMatchValidator(form: FormGroup) {
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

  buildForm() {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        lastname: ['', [Validators.required, Validators.minLength(4)]],
        gender: ['', [Validators.required]],
        birthday: ['', [Validators.required]],
        ext: ['+52', [Validators.required]],
        phoneNumber: [null, [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(4)]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  create() {
    const {passwordConfirm,role,...rest} = this.form.value;
    const roleId = role.id;
    this.userService
      .create({roleId,...rest})
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message
          })
          return throwError(()=> err)
        })
      )
      .subscribe({
        next: (user) => {
          this.dialog.close();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Usuario Creado',
            life: 2000,
          });
          this.form.reset();
          this.socketService.emit('user:added', user);
        },
      });
  }
}
