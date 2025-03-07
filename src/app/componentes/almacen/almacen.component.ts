import { Component } from '@angular/core';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo } from '../../models/articulo';
import Swal from 'sweetalert2';

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
  operation: 'insert' | 'update' | 'none' = 'none';
  selectedArticulo = { id: 0, nombre: '', categoria: '', precio: 0, cantidad: 0, codigo: '' };
  

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
   
    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedArticulos = this.articulos.slice(start, end);
    
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

// Metodo para eliminar articulo

eliminarArticulo(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.articuloService.deleteArticulo(id).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El artículo se ha eliminado', 'success');
          this.cargarArticulos();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo eliminar el artículo', 'error');
        }
      });
    }
  });
}


// Metodo para cambiar a los diferentes Modos 'insert' | 'update' | 'none' = 'none'!!

setMode(mode: 'none' | 'insert' | 'update', articulo?: Articulo){
  switch(mode){

    case 'update':
      this.operation = 'update';
      this.selectedArticulo = { ...articulo! }; // ¡Forzamos la no-null assertion!
      
      break;

      case 'insert':
        this.operation = 'insert';
        break;

        case 'none':
          this.operation = 'none';
          break;
      
      default:
        this.operation = 'none';
        break;
    
  }
}

 

 
  
}