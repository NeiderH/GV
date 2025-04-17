import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginurl = 'http://localhost:3016/api/Usuario/LogUsuarios';
  private tokenKey = 'authToken';
  private userKey = 'authUser';
  private permissionKey = 'authPermission';
  private useremailKey = 'authEmail';
  private userStatusKey = 'authStatus';

  private userSubject = new BehaviorSubject<string | null>(this.getUser());
  user$ = this.userSubject.asObservable();

  private permissionSubject = new BehaviorSubject<string | null>(this.getPermission());
  permission$ = this.permissionSubject.asObservable();
  
  private useremailSubject = new BehaviorSubject<string | null>(this.getEmail());
  useremail$ = this.useremailSubject.asObservable(); 

  private userStatusSubject = new BehaviorSubject<string | null>(this.getStatus());
  userStatus$ = this.userStatusSubject.asObservable(); 

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(correo: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.loginurl, { correo, password }).pipe(
      tap(response => {
        console.log("Respuesta de la API:", response); // 👀 Verifica qué devuelve la API
        if (response.token) {
          this.setToken(response.token); // Guarda el token en localStorage
          this.setUser(response.userData.nombre); // Guarda el nombre del usuario en localStorage
          this.userSubject.next(response.userData.nombre); // Actualiza el BehaviorSubject
          this.setPermiso(response.userData.permiso); // Guarda el permiso en localStorage
          this.permissionSubject.next(response.userData.permiso); // Actualiza el BehaviorSubject
          this.useremailSubject.next(correo); // Actualiza el BehaviorSubject con el correo
          this.setEmail(correo); 
          this.setStatus(response.userData.estado);
          this.userStatusSubject.next(response.userData.estado); // Actualiza el BehaviorSubject con el estado
        } else {
          console.error("⚠️ No se recibió un token en la respuesta");
        }
      })
    );
  }

  // Registro de usuario
  register(userData: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:3016/api/Usuario/RegUsuarios', userData);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(nombre: string): void {
    console.log("Guardando nombre de usuario en localStorage");
    localStorage.setItem(this.userKey, nombre);
  }
  private setPermiso(permiso: string): void {
    console.log("Guardando permiso de usuario en localStorage");
    localStorage.setItem(this.permissionKey, permiso);
  }
  private setEmail(email: string): void {
    console.log("Guardando correo electrónico en localStorage");
    localStorage.setItem(this.useremailKey, email);
  }
  private setStatus(status: string): void {
    console.log("Guardando estado de usuario en localStorage");
    localStorage.setItem(this.userStatusKey, status);
  }

  private getUser(): string | null {
    const user = localStorage.getItem(this.userKey);
    console.log("Obteniendo nombre de usuario de localStorage");
    return user;
  }
  private getPermission(): string | null {
    const permiso = localStorage.getItem(this.permissionKey);
    console.log("Obteniendo permiso de usuario de localStorage");
    return permiso;
  }
  private getEmail(): string | null {
    const email = localStorage.getItem(this.useremailKey);
    console.log("Obteniendo correo electrónico de localStorage");
    return email;
  }
  private getStatus(): string | null {
    const status = localStorage.getItem(this.userStatusKey);
    console.log("Obteniendo estado de usuario de localStorage");
    return status;
  }

  getUsuario(): Observable<any> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      throw new Error("Token no encontrado");
    }
  
    return this.httpClient.get<any>('http://localhost:3016/api/Usuario/GetUsuario', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  isAuth(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.permissionKey);
    localStorage.removeItem(this.useremailKey);
    localStorage.removeItem(this.userStatusKey);
    this.userSubject.next(null); // Actualiza el BehaviorSubject
    this.permissionSubject.next(null); // Actualiza el BehaviorSubject
    this.useremailSubject.next(null); // Actualiza el BehaviorSubject
    this.userStatusSubject.next(null); // Actualiza el BehaviorSubject
  }
}