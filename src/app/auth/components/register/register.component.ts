import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup = this.fb.group({
    firstname: ['',[Validators.required]],
    lastname: ['',[Validators.required]],
    address: ['',[]],
    city: ['',[]],
    state: ['',[]],
    phone: ['',[]],
    mobilephone: ['',[]],
    email: ['',[Validators.required, Validators.email]],
    password1: ['',[Validators.required, Validators.minLength(6)]],
    password2: ['',[Validators.required, Validators.minLength(6)]],
  }, {
    validator: this.matchingPasswords
  })

  states = ['MG', 'RJ', 'SP', 'PR', 'SC']

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  matchingPasswords(abstractControl: AbstractControl) {
    if(abstractControl){
      const password1 = abstractControl.get('password1')?.value
      const password2 = abstractControl.get('password2')?.value
      if(password1 == password2)
        return null
    }
    return {matching: false}
  }

  onSubmit(): void {
    const user: User = {
      firstName: this.formRegister.value.firstName,
      lastName: this.formRegister.value.lastName,
      address: this.formRegister.value.address,
      city: this.formRegister.value.city,
      state: this.formRegister.value.city,
      phone: this.formRegister.value.mobilePhone,
      mobilePhone: this.formRegister.value.mobilePhone,
      email: this.formRegister.value.email,
      password: this.formRegister.value.password1
    }
    this.authService.register(user)
    .subscribe({
      next: (u) => {
        this.snackBar.open('Successfully registered!', 'OK', {duration: 2000})
        this.router.navigateByUrl('/auth/login')
      },
      error: (err) => {
        throwError(() => Error(err))
        this.snackBar.open('Error! You are not registered.', 'OK', {duration: 2000})
      }
    })
  }

}
