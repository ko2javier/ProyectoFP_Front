import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Articulo } from '../../models/articulo';

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  carrito: Articulo[] = [];

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.obtenerCarrito().subscribe((productos) => {
      this.carrito = productos;
    });
  }

  /**
   * 📌 Elimina un producto del carrito
   */
  eliminarDelCarrito(id: number) {
    this.carritoService.eliminarProducto(id);
  }

  /**
   * 📌 Vacía todo el carrito
   */
  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }
}