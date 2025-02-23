import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PanelVentasService } from '../../services/panel-ventas.service';
import { CarritoService } from '../../services/carrito.service';
import { Articulo } from '../../models/articulo';
import { CarritoItem } from '../../models/CarritoItem';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: false,
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent implements OnInit {
  @Output() volverAlPanel = new EventEmitter<void>(); // ✅ Evento para volver

  carrito: CarritoItem[] = []; // 🔹 Para reflejar la cantidad en la UI

  constructor(
    public panelVentasService: PanelVentasService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // ✅ Inicializa el carrito con los productos obtenidos de la búsqueda
    this.carritoService.inicializarCarrito(this.panelVentasService.resultadosBusqueda);

    // 🔹 Se suscribe a los cambios en el carrito para reflejarlo en la UI
    this.carritoService.obtenerCarrito().subscribe(carrito => {
      this.carrito = carrito;
    });
  }

  /**
   * 📌 Obtiene la cantidad de un producto específico en el carrito
   */
  obtenerCantidad(productoId: number): number {
    const item = this.carrito.find(p => p.articulo.id === productoId);
    return item ? item.cantidadCompra : 0;
  }

  /**
   * 📌 Incrementa la cantidad de un producto en el carrito
   */
  incrementarCantidad(productoId: number) {
    this.carritoService.incrementarCantidad(productoId);
  }

  /**
   * 📌 Reduce la cantidad de un producto en el carrito
   */
  reducirCantidad(productoId: number) {
    this.carritoService.reducirCantidad(productoId);
  }

  /**
   * 📌 Vuelve al panel de ventas y limpia la búsqueda
   */
  volver() {
    this.panelVentasService.limpiarBusqueda();
    this.volverAlPanel.emit(); // ✅ Emitimos evento para que PanelComponent oculte la tabla
  }
}
