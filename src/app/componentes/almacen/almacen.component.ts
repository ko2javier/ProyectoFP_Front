import { Component } from '@angular/core';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo } from '../../models/articulo';

@Component({
  selector: 'app-almacen',
  standalone: false,
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent {
  articulos: Articulo[] = []; // Variable para almacenar los artículos

  rowsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  paginatedArticulos: Articulo[] = [];
  

  constructor(private articuloService: ArticuloService) {}

  ngOnInit() {
    this.cargarArticulos();
  }

  cargarArticulos() {
    this.articuloService.cargarArticulos().subscribe(
      (data) => {
        this.articulos = data;
        this.totalPages = Math.ceil(this.articulos.length / this.rowsPerPage);
        this.displayTable(1);
      },
      (error) => {
        console.error('Error al obtener artículos', error);
      }
    );
  }

  displayTable(page: number): void {
    console.log("Cambiando a página:", page);  // 🔹 Verifica en la consola si el método se ejecuta
    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedArticulos = this.articulos.slice(start, end);
    console.log("Datos paginados:", this.paginatedArticulos); // 🔹 Verifica los datos
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.displayTable(page);
    }
  }

/* aun sin definir los metodos de abajo*/
decrementQuantity(id:number) { }
incrementQuantity(id:number) { }

 

 
  
}