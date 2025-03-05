import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { VentaUsuario } from '../models/VentaUsuario';
import { VentaDTO } from '../models/VentaDTO';

@Injectable({
  providedIn: 'root'
})
export class VentasUserService {
  private apiUrl = 'http://localhost:5000/ventas/all'; // URL del backend
  private sales_Url = 'http://localhost:5000/ventas'; // URL del backend

  // Almacén de datos para compartir entre componentes
  private ventasSubject = new BehaviorSubject<VentaUsuario[]>([]);
  ventas$ = this.ventasSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * 🔹 Obtiene todas las ventas desde el backend y las almacena en `ventasSubject`
   */
  cargarVentas(): Observable<VentaUsuario[]> {
    console.log('✅ Ejecutando cargarVentas() para obtener TODAS las ventas'); // 👀 Verificar que se ejecuta

    return this.http.get<VentaUsuario[]>(this.apiUrl).pipe(
      tap(ventas => {
        console.log('✅ Ventas obtenidas:', ventas); // 👀 Verificar los datos antes de almacenar
        this.ventasSubject.next(ventas); // Almacena las ventas en BehaviorSubject
      })
    );
  }

  /**
   * 🔹 Obtiene las ventas almacenadas en `ventasSubject`
   */
  obtenerVentas(): Observable<VentaUsuario[]> {
    return this.ventas$;
  }

  
  /**
   * 🔹 Guardo la lista de ventas
   */
  registrarVentas(ventas: VentaDTO[]): Observable<any> {
    return this.http.post(`${this.sales_Url}/registrar/list`, ventas);
  }
}
