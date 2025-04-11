import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Articulo } from '../../models/articulo';
import { CarritoItem } from '../../models/CarritoItem';
import { ToastService } from '../../services/toast.service';
import { VentaDTO } from '../../models/VentaDTO';
import { VentasUserService } from '../../services/ventas-user.service';
import { ComprasCliente } from '../../models/ComprasCliente';
import { VentaUsuario } from '../../models/VentaUsuario';
import { ComprasClienteService } from '../../services/compras-cliente-service.service';
import { ArticuloService } from '../../services/articulo.service';
import { UpdateDto } from '../../models/UpdateDTO';

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
mostrarFormulario = false;
errorMessage: string = '';
tipoDocumento: string = "";  // Almacena el tipo de documento (DNI/NIE)
identificacion: string = ""; // Almacena el valor ingresado


  carrito: CarritoItem[] = [];

  constructor(public carritoService: CarritoService,  private toastService: ToastService, 
    private ventasService:VentasUserService, private comprasService:ComprasClienteService ,
    private articuloService: ArticuloService ) {}

  ngOnInit() {
    this.carritoService.obtenerCarrito().subscribe((productos) => {
      this.carrito = productos.filter(item => item.cantidadCompra > 0); // ✅ Solo productos con cantidad > 0
    });
  }


  /**
   * 📌 Elimina un producto del carrito
   */
  eliminarDelCarrito(id: number) {
    this.carritoService.reducirCantidad(id); // ✅ Usa `reducirCantidad` en lugar de `eliminarProducto`
  }
  

  /**
   * 📌 Vacía todo el carrito
   */
  vaciarCarrito() {
    this.mostrarFormulario = false;
    this.carritoService.vaciarCarrito(); // ✅ Reinicia el carrito a un array vacío
  }
  
    
  /**
   * 📌 Validar Identificacion
   */

  validarIdentificacion(tipo: string, valor: string): boolean {

  
    switch (tipo) {

      // Agrupamos aquí los casos vacíos o "Choose..."
    case "":
      case "Choose...":
        this.toastService.showToast(
          "Error",
          "❌ Escoja tipo de Documento !!",
          true,
          "Error"
        );
        return false;

      case "DNI":
        if (!/^[0-9]{8}[A-Za-z]$/.test(valor.toUpperCase())) {
          this.toastService.showToast(
            "Error",
            "❌ DNI inválido. Debe tener 8 números y 1 letra final.",
            true,
            "Error"
          );
          return false;
        }
        break;
  
      case "NIE":
        if (!/^[XYZ][0-9]{7}[A-Za-z]$/.test(valor.toUpperCase())) {
          this.toastService.showToast(
            "Error",
            "❌ NIE inválido. Debe comenzar con X, Y o Z, seguido de 7 números y una letra.",
            true,
            "Error"
          );
          return false;
        }
        break;
  
      default:
        // Si el 'tipo' no es DNI, NIE, "Choose..." ni vacío,
        // se muestra un error de tipo no válido.
        this.toastService.showToast(
          "Error",
          `❌ Tipo de documento '${tipo}' no válido.`,
          true,
          "Error"
        );
        return false;
    }
  
    // Si pasa las validaciones sin problema
    return true;
  }
  

    /*
    validarIdentificacion(tipo: string, valor: string): boolean {
      // Si es un DNI
      if (tipo === "DNI") {
        if (!/^[0-9]{8}[A-Za-z]$/.test(valor)) {
          this.toastService.showToast(
            "Error",
            "❌ DNI inválido. Debe tener 8 números y 1 letra final.",
            true,
            "Error"
          );
          return false;
        }
        return true;
      } 
      
      // Si es un NIE
      else if (tipo === "NIE") {
        if (!/^[XYZ][0-9]{7}[A-Za-z]$/.test(valor)) {
          this.toastService.showToast(
            "Error",
            "❌ NIE inválido. Debe comenzar con X, Y o Z, seguido de 7 números y una letra.",
            true,
            "Error"
          );
          return false;
        }
        return true;
      }
      
      // Si no es ninguno de los tipos reconocidos
      else {
        this.toastService.showToast(
          "Error",
          `❌ Tipo de documento no soportado.`,
          true,
          "Error"
        );
        return false;
      }
    }*/

  showform(){
    this.mostrarFormulario=(!this.mostrarFormulario)?true:false;
  }
  Completar() {
    // Validar DNI/NIE antes de continuar
    if (!this.validarIdentificacion(this.tipoDocumento, this.identificacion)) {
      console.warn("No se puede completar la compra: Identificación no válida.");
      return;
    }
  
    console.log("✅ Identificación válida, procesando compra...");
    this.registrarVenta(); // Pasamos al siguiente paso
  

  }
  
 

    // 1) Función externa para validar los ítems carrito
// -------------------------------------------------------
validarItems(carrito: any[]): boolean {
  for (const item of carrito) {
    // Caso 1: cantidad <= 0 . No es ncesario xq se eliminan los art con cantidad<=0!!
    /*
    if (item.cantidadCompra <= 0) {
      this.toastService.showToast(
        'Error',
        '❌ La cantidad de compra debe ser mayor a 0',
        true,
        'Error'
      );
      return false; // Interrumpir validación
    }*/
    // Caso 2: cantidadCompra > stock
    if (item.cantidadCompra > item.articulo.cantidad) {
      this.toastService.showToast(
        'Error',
        `❌ No hay suficiente stock para ${item.articulo.nombre}. 
         Solo dispones de ${item.articulo.cantidad} unidades.`,
        true,
        'Error'
      );
      return false; // Interrumpir validación
    }
  }
  // Si todos los ítems pasan la validación, devolvemos true
  return true;
}

 
  registrarVenta() {

      // 0. Primero validamos todos los ítems del carrito
      if (!this.validarItems(this.carrito)) {
        // Si la validación retorna false, detenemos todo aquí
        return;
      }
      // 1. Generar el array de VentaDTO (solo ítems válidos)
        const ventasDTO: VentaDTO[] = this.carrito
        .map(item => ({
          dnicliente: this.identificacion,
          nameproducto: item.articulo.nombre,
          cantidad: item.cantidadCompra,
          importe: item.articulo.precio * item.cantidadCompra,
          codigo: item.articulo.codigo  // <-- AÑADIR ESTO
        }));
    
      // 2) Llamas al servicio
      this.ventasService.registrarVentas(ventasDTO).subscribe({
        next: (response: VentaUsuario[]) => {
          console.log('Ventas registradas con éxito:', response);
          this.toastService.showToast(
            'Success',
            'Venta(s) Registrada(s) con Éxito',
            false,
            'Success'
          );
          this.vaciarCarrito();
    
          // 3) Directamente registras la compra usando la respuesta 
          this.registrarCompra(response);
          this.actualizarStockBatch();
        },
        error: (err) => {
          console.error('Error al registrar ventas:', err);
          this.toastService.showToast(
            'Error',
            '❌ Error al registrar ventas',
            true,
            'Error'
          );
        }
      });
    }

    registrarCompra(ventas: VentaUsuario[]) {
      // Construir array de ComprasClienteDTO en base a las ventas
      const comprasDTO: ComprasCliente[] = ventas.map(venta => ({
        ventaId: venta.id,
        dnicliente: venta.dnicliente,
        producto: venta.nameproducto,
        cantidad: venta.cantidad,
        importe: venta.importe
      }));
    
      // Llamar a tu servicio de Compras
      this.comprasService.registrarComprasCliente(comprasDTO).subscribe({
        next: (respuesta: ComprasCliente[]) => {
          console.log('Compras registradas con éxito:', respuesta);
          this.toastService.showToast(
            'Success',
            'Compra(s) Registrada(s) con Éxito',
            false,
            'Success'
          );
        },
        error: (err) => {
          console.error('Error al registrar compras:', err);
          this.toastService.showToast(
            'Error',
            '❌ Error al registrar compras',
            true,
            'Error'
          );
        }
      });
    }

    actualizarStockBatch(): void {
      // Construir el array de actualizaciones a partir de los ítems del carrito con cantidad > 0
      const updates: UpdateDto[] = this.carrito
        .filter(item => item.cantidadCompra > 0)
        .map(item => ({
          codigo: item.articulo.codigo,
          cantidadVendida: item.cantidadCompra
        }));
    
      // Llamar al método del servicio que soporte actualizaciones en batch
      this.articuloService.updateStockBatch(updates).subscribe({
        next: (response) => {
          console.log('Stock actualizado en batch:', response);
          // Actualiza la UI si es necesario
        },
        error: (err) => {
          console.error('Error al actualizar stock en batch:', err);
          // Muestra el error al usuario mediante toastService, por ejemplo.
        }
      });
    }

    calcularTotal(): number {
      return this.carrito.reduce((suma, item) =>
        suma + (item.cantidadCompra * item.articulo.precio), 0
      );
    }
    
    

  
}