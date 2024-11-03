import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-form-error',
  templateUrl: './formError.component.html',
  styleUrls: ['./formError.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonIcon, CommonModule],
})
export class FormErrorComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  @Input() control: FormControl | null | undefined = null;

  @Input() validate: string[] = [
    'required',
    'email',
    'pattern',
    'whitespace',
    'onlyLetters',
    'telephone',
    'onlyPositives',
    'minlength',
    'maxlength',
  ];
  @Input() messages: {[key: string]: string} = {
    required: '*El campo es requerido',
    email: '*Debe ser un correo válido',
    pattern: '*Patrón no valido',
    whitespace: '*No se permiten solo espacios',
    onlyLetters: '*Caracteres válidos: Aa - Zz',
    telephone: '*Ingrese número telefónico de 10 dígitos. Lada opcional',
    onlyPositives: '*Solo se permiten números positivos',
    minlength: '*Debe tener al menos {0} caracteres',
    maxlength: '*Debe tener máximo {0} caracteres',
  };

  constructor() {}

  ngOnInit() {
    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._cdr.markForCheck();
      }) || null;

    this.control?.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._cdr.markForCheck();
      }) || null;
  }
}
