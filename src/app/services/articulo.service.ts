import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Articulo } from '../models/articulo';


@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  private apiUrl = 'http://localhost:5000/articulos/all'; // URL del backend

  constructor(private http: HttpClient) {}
  
// Comportamiento para almacenar los artículos en memoria y compartirlos entre componentes
private articulosSubject = new BehaviorSubject<Articulo[]>([]);
articulos$ = this.articulosSubject.asObservable(); // Observable para que otros componentes se suscriban



// Obtener artículos del backend y almacenarlos en memoria
cargarArticulos(): Observable<Articulo[]> {
  return this.http.get<Articulo[]>(this.apiUrl).pipe(
    tap((articulos: Articulo[]) => this.articulosSubject.next(articulos)) // Se especifica el tipo
  );
}

// Método para obtener los artículos almacenados (sin hacer nueva petición)
obtenerArticulos(): Articulo[] {
  return this.articulosSubject.value;
}

}
