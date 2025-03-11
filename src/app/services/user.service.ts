import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Usuarios } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000/users/all';

  // Almacena los usuarios en un BehaviorSubject para compartirlos entre componentes
  private usersSubject = new BehaviorSubject<Usuarios[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  cargarUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl).pipe(
      tap((usuarios: Usuarios[]) => this.usersSubject.next(usuarios))
    );
  }
}
