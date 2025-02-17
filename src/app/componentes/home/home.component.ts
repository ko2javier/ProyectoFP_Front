import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  /* Defino las variables de los NgIf para mostrar un componente 
  insertado o no
  */
    almacen:boolean=true;

  constructor(private router: Router) {}

  logout(): void {
    // Aquí puedes eliminar el token de autenticación
    localStorage.removeItem('token'); // O donde sea que guardes el token
    // Redirige al usuario a la página de login
    console.log("redirecciono a login");
    this.router.navigate(['/login']);
  }

}
