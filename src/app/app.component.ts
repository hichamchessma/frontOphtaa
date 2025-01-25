import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontOphtaa';
  isLoginPage = false;

  constructor(private router: Router) {
    // S'abonner aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Vérifier si on est sur la page login, forgot-password ou reset-password
      this.isLoginPage = event.url === '/login' || 
                        event.url === '/forgot-password' ||
                        event.url === '/register'|| 
                        event.url.includes('/reset-password');
    });
  }
}
