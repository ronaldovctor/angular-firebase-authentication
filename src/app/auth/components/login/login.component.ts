import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  loading: boolean = false

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe({
      next: (u) => {
        this.loginOKNotification(u as User)
        this.router.navigateByUrl('/')
        this.loading = false
      },
      error: (err) => {
        this.loginErrorNotification(err)
        this.loading = false
      }
    })
  }

  loginGoogle(){
    this.loading = true
    this.authService.loginGoogle()
    .subscribe({
      next: (u) => {
        this.loginOKNotification(u as User)
        this.router.navigateByUrl('/')
        this.loading = false
      },
      error: (err) => {
        this.loginErrorNotification(err)
        this.loading = false
      }
    })
  }

  private loginOKNotification(u: User): void {
    this.snackBar.open(
      `Logged succefully. Welcome ${u.firstName}!`, 'OK', {duration: 2000}
    )
  }

  private loginErrorNotification(err: string): void {
    this.snackBar.open(
      err, 'OK', {duration: 2000}
    )
  }
}
