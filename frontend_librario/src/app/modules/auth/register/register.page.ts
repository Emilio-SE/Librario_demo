import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { LoginService } from '../models/services/auth.service';

import { Register } from '../models/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _authSvc = inject(LoginService);
  private _fb = inject(FormBuilder);

  private _toastrSvc = new ToastrUtils();
  public form: FormGroup;

  constructor() {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  public get nameControl(): FormControl {
    return this.form.get('name') as FormControl;
  }

  public get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toastrSvc.emitInfoToast(
        'warning',
        'Por favor, complete todos los campos'
      );
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this._toastrSvc.emitInfoToast('warning', 'Las contraseñas no coinciden');
      return;
    }

    const data: Register = {
      name: this.form.value.name,
      email: this.form.value.email.toLowerCase(),
      password: this.form.value.password,
    };

    this.sendData(data);
  }

  private sendData(data: Register) {
    this._authSvc
      .register(data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this._toastrSvc.emitInfoToast(
            'success',
            'Usuario registrado correctamente. Por favor, inicie sesión.'
          );
        },
        error: (error) => {
          this._toastrSvc.emitInfoToast('danger', error.error.message);
        },
      });
  }
}
