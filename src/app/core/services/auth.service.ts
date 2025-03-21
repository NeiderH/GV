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

  private userSubject = new BehaviorSubject<string | null>(this.getUser()); // 🔹 Mantiene el estado del usuario
  user$ = this.userSubject.asObservable(); // 🔹 Permite suscribirse a los cambios del usuario

  private permissionSubject = new BehaviorSubject<string | null>(this.getPermission()); // 🔹 Mantiene el estado del permiso
  permission$ = this.permissionSubject.asObservable(); // 🔹 Permite suscribirse a los cambios del permiso
  
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
          console.log("Token guardado"/*, response.token*/);
          console.log("Nombre guardado"/*, response.userData.nombre*/);
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

  isAuth(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.permissionKey);
    this.userSubject.next(null); // Actualiza el BehaviorSubject
    this.permissionSubject.next(null); // Actualiza el BehaviorSubject
  }
}