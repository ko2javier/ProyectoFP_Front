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

  // Variables del paginado
   rowsPerPage: number = 8;
    currentPage: number = 1;
    totalPages: number = 0;
    paginatedArticulos: VentaUsuario[] = [];

  constructor(private ventasService: VentasUserService) {}


  ngOnInit(): void {
    this.obtenerVentas();
  }
  

  obtenerVentas(): void {
    this.ventasService.cargarVentas().subscribe(
      (data) => {
        console.log("✅ Ventas obtenidas:", data); // 👀 Verificar si hay datos
        this.totalPages = Math.ceil(data.length / this.rowsPerPage);
        this.ventas = data; // 🔹 Asignamos los datos después del cálculo del total
        this.displayTable(1);
      },
      (error) => {
        console.error('❌ Error al obtener ventas:', error);
      }
    );
  }
  
/**Abajo los 2 metodos que tienen que ver con el paginado */

displayTable(page: number): void {
  if (!this.ventas.length) return; // 🚨 Previene errores si el array está vacío
  const start = (page - 1) * this.rowsPerPage;
  const end = start + this.rowsPerPage;
  this.paginatedArticulos = this.ventas.slice(start, end);
  console.log("📌 Página actual:", page, "Datos paginados:", this.paginatedArticulos);
}

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.displayTable(page);
    }
  }
}
