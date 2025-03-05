import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

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
  currentSection: string = 'almacen'; // Al iniciar, muestra 'almacen'

   

  constructor(private router: Router, private cdr: ChangeDetectorRef,  public carritoService: CarritoService) {}

  logout(): void {
    // Aquí puedes eliminar el token de autenticación
    localStorage.removeItem('token'); // O donde sea que guardes el token
    // Redirige al usuario a la página de login
    console.log("redirecciono a login");
    this.router.navigate(['/login']);
  }

  cambiarSeccion(seccion: string) {
    console.log(`✅ Sección cambiada a: ${seccion}`);
    
    this.currentSection = seccion;
    this.cdr.detectChanges();  // 🔄 Forzar actualización de la UI
  }

  debugEvent(event: any) {
    console.log("📢 Evento recibido en HomeComponent: ", event);
    this.cambiarSeccion(event);
  }
  



}
