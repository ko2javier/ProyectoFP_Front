import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Articulo } from '../../models/articulo';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  productos: Articulo[] = []; 
  productosUnicos: string[] = [];
  categoriasUnicas: string[] = [];

  searchNombre: string = '';
  searchCategoria: string = '';
  filteredProductos: Articulo[] = [];

  mostrarListaNombres: boolean = false;
  mostrarListaCategorias: boolean = false;

  rowsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  paginatedArticulos: Articulo[] = [];
  flag_search: boolean = false;

  constructor(private articuloService: ArticuloService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarProductos();
  }

  /**
   * 🔹 Carga todos los productos desde el backend
   */
  cargarProductos() {
    this.articuloService.cargarArticulos().subscribe(
      (data) => {
        this.productos = data;
        this.obtenerProductosUnicos();
        this.obtenerCategoriasUnicas();
        console.log("✅ Productos obtenidos:", this.productos);
        this.cdr.detectChanges(); // Forzar actualización
      },
      (error) => {
        console.error("❌ Error al obtener productos:", error);
      }
    );
  }

  /**
   * 🔹 Obtiene los productos únicos para la lista de sugerencias
   */
  obtenerProductosUnicos() {
    const nombresSet = new Set<string>();
    this.productos.forEach((producto) => nombresSet.add(producto.nombre));
    this.productosUnicos = Array.from(nombresSet);
    this.cdr.detectChanges(); 
  }

  /**
   * 🔹 Obtiene las categorías únicas para la lista de sugerencias
   */
  obtenerCategoriasUnicas() {
    const categoriasSet = new Set<string>();
    this.productos.forEach((producto) => categoriasSet.add(producto.categoria));
    this.categoriasUnicas = Array.from(categoriasSet);
    this.cdr.detectChanges(); 
  }

  /**
   * 🔍 Realiza la búsqueda de productos en función del nombre y la categoría
   */
  buscarProductos() {
    this.flag_search = true;
    this.filteredProductos = this.productos.filter(producto => 
      (this.searchNombre === '' || producto.nombre === this.searchNombre) &&
      (this.searchCategoria === '' || producto.categoria === this.searchCategoria)
    );

    this.calcularPaginacion();
  }

  /**
   * 🔄 Limpia los filtros y restablece la vista
   */
  clear() {
    this.searchNombre = '';
    this.searchCategoria = '';
    this.mostrarListaNombres = false;
    this.mostrarListaCategorias = false;
    this.filteredProductos = [];
    this.flag_search = false;
    this.calcularPaginacion();
  }

  /**
   * 📑 Calcula la paginación de los resultados filtrados
   */
  calcularPaginacion() {
    this.totalPages = Math.ceil(this.filteredProductos.length / this.rowsPerPage);
    this.displayTable(1);
  }

  /**
   * 📊 Muestra los resultados paginados
   */
  displayTable(page: number): void {
    const start = (page - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedArticulos = this.filteredProductos.slice(start, end);
    this.cdr.detectChanges(); 
  }

  /**
   * 🔀 Cambia la página en la paginación
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.displayTable(page);
    }
  }

  /**
   * 🔹 Muestra u oculta la lista de productos dependiendo de la longitud del input
   */
  actualizarListaNombres() {
    this.mostrarListaNombres = this.searchNombre.length >= 2;
    this.cdr.detectChanges(); 
  }

  /**
   * 🔹 Muestra u oculta la lista de categorías dependiendo de la longitud del input
   */
  actualizarListaCategorias() {
    this.mostrarListaCategorias = this.searchCategoria.length >= 2;
    this.cdr.detectChanges(); 
  }
}
