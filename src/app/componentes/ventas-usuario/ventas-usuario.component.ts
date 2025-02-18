import { Component, OnInit } from '@angular/core';
import { VentasUserService } from '../../services/ventas-user.service';

import { VentaUsuario } from '../../models/VentaUsuario';

@Component({
  selector: 'app-ventas-usuario',
  standalone: false,
  templateUrl: './ventas-usuario.component.html',
  styleUrl: './ventas-usuario.component.css'
})
export class VentasUsuarioComponent implements OnInit {
  ventas: VentaUsuario[] = []; // Lista de ventas por usuario
   rowsPerPage: number = 8;
    currentPage: number = 1;
    totalPages: number = 0;
    paginatedArticulos: VentaUsuario[] = [];

  constructor(private ventasService: VentasUserService) {}


  ngOnInit(): void {
    this.obtenerVentas();
  }
  

  obtenerVentas(): void {
     // 🔹 Ahora llamamos a `cargarVentas()` para obtener TODAS las ventas
     this.ventasService.cargarVentas().subscribe(
      (data) => {
        this.ventas = data;
        console.log("✅ Ventas obtenidas:", this.ventas); // 👀 Verificar si hay datos
        this.totalPages = Math.ceil(this.ventas.length / this.rowsPerPage);
        this.displayTable(1);
      },
      (error) => {
        console.error('❌ Error al obtener ventas:', error);
      }
    ); 
  }

  displayTable(page: number): void {
    console.log("Cambiando a página:", page);  // 🔹 Verifica en la consola si el método se ejecuta
    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedArticulos = this.ventas.slice(start, end);
    console.log("Datos paginados:", this.paginatedArticulos); // 🔹 Verifica los datos
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.displayTable(page);
    }
  }
}
