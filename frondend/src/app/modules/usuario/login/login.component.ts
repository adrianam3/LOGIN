import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  recoveryEmail: string = '';
  display: boolean = false;
  public loading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  login() {
    const formData = new FormData();
    formData.append("email", this.email);
    formData.append("password", this.password);

    this.postData(formData).subscribe({
      next: (response) => {
        this.showToast('success', 'Autorizado', 'Inicio de sesión exitoso.');

        localStorage.setItem('idUsuario', response.user.idUsuario);
        localStorage.setItem('idRol', response.user.idRol);
        localStorage.setItem('email', response.user.email);
        localStorage.setItem('nombres', response.user.nombres);
        localStorage.setItem('apellidos', response.user.apellidos);

        setTimeout(() => {
          this.router.navigate(['/usuario/usuario-list']);
        }, 200);
      },
      error: () => {
        this.showToast('error', 'No autorizado', 'Inicio de sesión fallido.');
      }
    });
  }


  recuperarContrasena() {
    this.display = true;
  }
  sendRecoveryEmail() {
    this.loading = true;
    const formData = new FormData();
    formData.append("email", this.recoveryEmail);

    this.http.post<any>(`${environment.apiUrl}/controllers/recuperarcontrasena.controller.php?op=recuperar`, formData).subscribe({
      next: () => {
        this.showToast('success', 'Correo enviado', 'Revisa tu bandeja de entrada.');
        this.display = false;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('error', 'Error', 'No se pudo enviar el correo.');
      }
    });
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/controllers/login.controller.php`, data);
  }
  public showToast(severity: 'success' | 'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}