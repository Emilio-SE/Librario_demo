import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { LoginService } from '../models/services/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ToastrUtils } from 'src/app/core/utils/Toastr/toastr.utils';

import { AuthService } from 'src/app/core/services/auth.service';

import { Login } from '../models/interfaces/auth.interface';

import { Routes } from 'src/app/core/const/routes.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _authSvc = inject(LoginService);
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _cdr = inject(ChangeDetectorRef);
  private _router = inject(Router);

  private _toastrSvc = new ToastrUtils();
  public form: FormGroup;

  constructor() {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  public onSubmit() {
    if (this.form.invalid) {
      this._toastrSvc.emitInfoToast(
        'warning',
        'Por favor, complete todos los campos'
      );
      return;
    }

    this.sendData(this.form.value);
  }

  public get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  private sendData(data: Login) {
    this._authSvc
      .login(data)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          this._toastrSvc.emitInfoToast('success', '¡Bienvenido!');
          this._authService.setToken(data.token);
          this._cdr.detectChanges();
          this._router.navigate([Routes.REDIRECT_AFTER_LOGIN]);
        },
        error: (error) => {
          this._toastrSvc.emitInfoToast('danger', error.error.message);
          this._cdr.detectChanges();
        },
      });
  }
}
