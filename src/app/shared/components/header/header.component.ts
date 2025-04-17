import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nombreUsuario: string | null = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
  }

  cerrarSesion() {
    this.authService.logout(); // Usa el método logout del AuthService
    this.router.navigate(['login']); // Redirigir a la página de login
  }
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
}