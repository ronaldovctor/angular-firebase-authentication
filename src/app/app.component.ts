import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './auth/models/User';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fire-auth';

  user$?: Observable<User>
  authenticated$?: Observable<boolean>

  constructor(private authService: AuthService, private router: Router){
    this.user$ = authService.getUser() as Observable<User>
    this.authenticated$ = authService.authenticated()
  }

  logout(): void {
    this.authService.logout()
    this.router.navigateByUrl('/auth/login')
  }
}
