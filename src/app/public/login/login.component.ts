import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ButtonModule, DividerModule,InputTextModule, FormsModule, ReactiveFormsModule,PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  Formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private router:Router){
    this.Formulario = this.formBuilder.group({
      email: ['liz@gmail.com', [Validators.required, Validators.email]],
      password: ['123456789', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(){

  }

  formularioRegistro() {
    this.router.navigate(['/registro']);
  }

}
