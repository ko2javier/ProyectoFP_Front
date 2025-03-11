import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../models/usuarios';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  lista_usuarios: Usuarios[] = [];
  rowsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 0;
  paginatedUsuarios: Usuarios[] = [];
  operation: 'insert' | 'update' | 'none' = 'none';

 /* Variables para realizar el update y new user*/
 selectedUser: Usuarios = { id: 0, username: '', password: '', enabled: 1, permiso: 0 };
 newUser: Usuarios = { username: '', password: '', enabled: 1, permiso: 0 };

 constructor(private user_service: UserService, private toastService: ToastService ) {}

 ngOnInit(): void {
  this.cargarUsuarios();
}

cargarUsuarios(): void {
  this.user_service.cargarUsuarios().subscribe({
    next: (usuarios: Usuarios[]) => {

      console.log('Usuarios cargados:', usuarios);
      this.lista_usuarios = usuarios;
      this.totalPages = Math.ceil(usuarios.length / this.rowsPerPage);
      this.displayTable(1); 
    },
    error: (err) => {
      console.error('Error al cargar usuarios:', err);
      this.toastService.showToast('Error', 'Error al cargar usuarios', true, 'Error');
    }
  });
}

displayTable(page: number): void {
   
  const start = (page - 1) * this.rowsPerPage;
  const end = start + this.rowsPerPage;
  this.paginatedUsuarios = this.lista_usuarios.slice(start, end);
  
}

changePage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.displayTable(page);
  }
}

 // Metodo para el modo

 setMode(mode: 'none' | 'insert' | 'update', usuario?: Usuarios) {
   switch (mode) {
     case 'update':
       this.operation = 'update';
       if (usuario) {
         // Clonamos el objeto para evitar mutar la lista original
         this.selectedUser = { ...usuario };
       }
       break;
     case 'insert':
       this.operation = 'insert';
       // Reinicializamos newUser para tener un formulario vacío
       this.newUser = { username: '', password: '', enabled: 1, permiso: 0 };
       break;
     case 'none':
       this.operation = 'none';
       // Limpiamos las variables
       this.selectedUser = { id: 0, username: '', password: '', enabled: 1, permiso: 0 };
       this.newUser = { username: '', password: '', enabled: 1, permiso: 0 };
       break;
     default:
       this.operation = 'none';
       this.selectedUser = { id: 0, username: '', password: '', enabled: 1, permiso: 0 };
       this.newUser = { username: '', password: '', enabled: 1, permiso: 0 };
       break;
   }
 }

 eliminar_user(id: number): void{}

 /*
 1 - falta implenmentar estas funciones !! */

 insertUsuario() {  }

  /*  2 - falta implenmentar estas funciones !! */

 updateUsuario(){}
  /* 3- falta implenmentar estas funciones !! */
  deleteUsuario( id: number){}

}





