import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  ErrorHandlerService,
  FormService,
  RoleService,
  SocketsService,
  UserService,
} from '../../../../../services';
import { MessageService } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { Role, User } from '../../../../../interfaces';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-form-update-user',
  templateUrl: './form-update-user.component.html',
  styleUrl: './form-update-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormUpdateUserComponent {
  private destroy$ = new Subject<void>();
  public dialog = inject(DynamicDialogRef);
  public dialogConfig = inject(DynamicDialogConfig);
  private errorHandlerService = inject(ErrorHandlerService);
  public type = signal<string>(this.dialogConfig.data.type);
  private fb = inject(FormBuilder);
  private rolService = inject(RoleService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketsService);
  private formsService = inject(FormService);
  public roles = toSignal<Role[]>(this.rolService.getAll());
  urlImage = environment.urlServer + environment.pathProfilePhoto;
  imageFile = signal<File | undefined>(undefined);

  form: FormGroup = this.fb.group({});
  subscription: Subscription = new Subscription();

  data = computed<User>(() => this.dialogConfig.data.user);
  profileImage = signal<any>(this.urlImage + this.data()?.profileImage);

  uuid = this.data().uuid!;

  constructor() {}
  ngOnInit() {
    this.buildForms();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  errorMessages: any = {
    role: {
      required: 'El rol es obligatorio',
    },
    branch: {
      required: 'La sucursal es obligatoria',
    },
    name: {
      required: 'El nombre es obligatorio',
      minlength: 'El nombre debe tener al menos 3 caracteres',
    },
    lastname: {
      minlength: 'El apellido debe tener al menos 4 caracteres',
    },
    email: {
      required: 'El correo electrónico es obligatorio',
      minlength: 'El correo electrónico debe tener al menos 4 caracteres',
      email: 'Introduce una dirección de correo electrónico válida',
    },
    phoneNumber: {
      required: 'El número de teléfono es obligatorio',
      minlength: 'El número de teléfono debe tener al menos 4 caracteres',
    },
    username: {
      required: 'El nombre de usuario es obligatorio',
      minlength: 'El nombre de usuario debe tener al menos 4 caracteres',
    },
    password: {
      required: 'La contraseña es obligatoria',
      minlength: 'La contraseña debe tener al menos 4 caracteres',
    },
    passwordConfirm: {
      required: 'La confirmacion de contraseña es obligatoria',
      minlength: 'La contraseña debe tener al menos 4 caracteres',
      passwordsMismatch: 'Las contraseñas no coinciden',
    },
    extension: {
      required: 'La extension es obligatoria',
    },
  };

  chargeImage(image: any) {
    this.imageFile.set(image.currentFiles[0]);
    this.profileImage.set(image.currentFiles[0].objectURL);
  }
  clearImage() {
    this.profileImage.set(this.urlImage + this.data()?.profileImage);
  }
  buildForms() {
    switch (this.type()) {
      case 'update':
        this.form = this.fb.group({
          name: [
            { value: this.data()!.name, disabled: true },
            [Validators.required, Validators.minLength(3)],
          ],
          lastname: [
            { value: this.data()!.lastname, disabled: true },
            [Validators.minLength(4)],
          ],
          email: [
            { value: this.data()!.email, disabled: true },
            [Validators.required, Validators.minLength(4), Validators.email],
          ],
          phoneNumber: [
            { value: this.data().phoneNumber, disabled: true },
            [Validators.required, Validators.minLength(4)],
          ],
          username: [
            { value: this.data()!.username, disabled: true },
            [Validators.required, Validators.minLength(4)],
          ],
        });
        break;
      case 'update-password':
        this.form = this.fb.group({
          password: ['', [Validators.required, Validators.minLength(4)]],
        });
        break;
      case 'update-role':
        this.form = this.fb.group({
          roleId: ['', [Validators.required, Validators.minLength(4)]],
        });
        break;
      default:
        break;
    }
  }

  getErrorMessage(controlName: string): string | null {
    return this.formsService.getErrorMessage(
      this.form,
      controlName
    );
  }

  enableInput(controlName: string[]) {
    controlName.forEach((name) => {
      this.form.get(name)?.enable();
    });
  }

  save() {
    switch (this.type()) {
      case 'update':
        this.update();
        break;

      case 'update-password':
        this.updatePassword();
        break;

      case 'update-role':
        this.update();
        break;

      case 'update-photo':
        this.updatePhoto();
        break;

      default:
        break;
    }
  }

  update() {
    let data = this.form.value;
    const uuid = this.data()!.uuid;

    if (this.form.invalid) {
      return;
    }

    this.userService
      .update(data, uuid!)
      .pipe(
        this.errorHandlerService.handleError<User>({}),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user: User) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Usuario Actualizado.',
            life: 2000,
          });
          this.form.reset();
          this.dialog.close();
          this.socketService.emit('user:updated', user);
        },
      });
  }

  updatePhoto() {
    const formData = new FormData();

    formData.append('profileImage', this.imageFile()!);

    this.userService
      .updatePhoto(formData, this.data()?.username!, this.uuid)
      .pipe(
        this.errorHandlerService.handleError<User>({}),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user: User) => {
          this.dialog.close();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Foto de Perfil Actualizada',
            life: 2000,
          });
          this.socketService.emit('user:updated', user);
        },
      });
  }
  updatePassword() {
    const data = this.form.value;

    this.userService
      .updatePassword(data, this.uuid!)
      .pipe(
        this.errorHandlerService.handleError<User>({}),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user: User) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Contraseña Restablecida',
            detail: 'La contraseña se actualizo con exito.',
            life: 3000,
          });
          this.form.reset();
          this.dialog.close();
          this.socketService.emit('user:updated', user);
        },
      });
  }
}
