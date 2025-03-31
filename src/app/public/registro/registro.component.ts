import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';





@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, FloatLabel,InputTextModule,ButtonModule,PasswordModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  Formulario: FormGroup;
  value: string | undefined;

  constructor(private formBuilder: FormBuilder){
    this.Formulario = this.formBuilder.group({
      id: [''],
      name: ['Lizbeth', [Validators.required, Validators.minLength(2)]],
      email: ['liz@gmail.com', [Validators.required, Validators.email]],
      password: ['123456789', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(){

  }

}
