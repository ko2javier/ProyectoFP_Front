import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Articulo } from '../models/articulo';
import { CarritoItem } from '../models/CarritoItem';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: CarritoItem[] = [];
  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);

  constructor() {}

  /**
   * 📌 Inicializa el carrito con todos los productos de la búsqueda, estableciendo cantidadCompra = 0
   */
  inicializarCarrito(productos: Articulo[]) {
    this.carrito = productos.map(producto => ({
      articulo: producto,
      cantidadCompra: 0 // 🔹 Inicialmente todos los productos tienen cantidad en 0
    }));
    this.carritoSubject.next(this.carrito);
  }

  /**
   * 📌 Obtiene el carrito como un observable para actualizaciones en tiempo real
   */
  obtenerCarrito() {
    return this.carritoSubject.asObservable();
  }

  /**
   * 📌 Incrementa la cantidad de un producto en el carrito
   */
  incrementarCantidad(productoId: number) {
    const productoExistente = this.carrito.find(item => item.articulo.id === productoId);

    if (productoExistente) {
      if (productoExistente.cantidadCompra < productoExistente.articulo.cantidad) {
        productoExistente.cantidadCompra += 1;
      } else {
        console.warn('❌ No se puede agregar más de la cantidad disponible en stock.');
        return;
      }
    }

    this.carritoSubject.next(this.carrito);
  }

  /**
   * 📌 Disminuye la cantidad de un producto en el carrito
   */
  reducirCantidad(productoId: number) {
    const producto = this.carrito.find(item => item.articulo.id === productoId);

    if (producto) {
      if (producto.cantidadCompra > 0) {
        producto.cantidadCompra -= 1;
      }
      this.carritoSubject.next(this.carrito);
    }
  }

  /**
   * 📌 Filtra y obtiene solo los productos con `cantidadCompra > 0`
   */
  obtenerProductosSeleccionados(): CarritoItem[] {
    return this.carrito.filter(item => item.cantidadCompra > 0);
  }

  /**
   * 📌 Obtiene la cantidad total de productos en el carrito
   */
  obtenerCantidadTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidadCompra, 0);
  }
}
