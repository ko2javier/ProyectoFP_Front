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
decrementQuantity(id:number) {

}
incrementQuantity(id:number) {

}
  almacen:boolean=false;
  articulos: Articulo[] = []; // Variable para almacenar los artículos

  constructor(private articuloService: ArticuloService) {}

  ngOnInit(): void {
    // Suscribirse al observable de artículos
    this.articuloService.articulos$.subscribe((data) => {
      this.articulos = data;
    });

    // Cargar los artículos si aún no se han cargado
    if (this.articuloService.obtenerArticulos().length === 0) {
      this.articuloService.cargarArticulos().subscribe();
    }
  }
 
  
}


