import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-olvido-contrasena',
    templateUrl: './olvido-contrasena.component.html',
    styleUrl: './olvido-contrasena.component.scss',
    providers: [MessageService]
})
export class OlvidoContrasenaComponent implements OnInit {
    resetPasswordForm: FormGroup;
    token: string;
    email: string;
    showPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private messageService: MessageService,
    ) {
        this.resetPasswordForm = this.fb.group({
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(8),
                    this.passwordStrengthValidator
                ]
            ],
            confirmPassword: ['',
                [
                    Validators.required,
                    Validators.minLength(8)
                ]
            ]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        // Obtener el token de la URL
        this.token = this.route.snapshot.queryParams['token'];
        this.email = atob(this.route.snapshot.queryParams['usuario']);
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('password').value === form.get('confirmPassword').value
            ? null : { mismatch: true };
    }

    // Validador personalizado
    passwordStrengthValidator(control: any) {
        const value = control.value;
        const hasUpperCase = /[A-Z]/.test(value);  // Tiene mayúsculas
        const hasLowerCase = /[a-z]/.test(value);  // Tiene minúsculas
        const hasNumeric = /\d/.test(value);       // Tiene números
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value); // Tiene caracteres especiales
        const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

        if (!valid) {
            return { weakPassword: true };
        }
        return null;
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }


    resetPassword(): void {
        if (this.resetPasswordForm.valid) {
            const password = this.resetPasswordForm.get('password').value;
            const formData = new FormData();
            formData.append("usuario", this.email);
            formData.append("token", this.token);
            formData.append("password", password);
            // Enviar la nueva contraseña y el token al backend
            this.http.post(`${environment.apiUrl}/controllers/recuperarcontrasena.controller.php?op=cambiar`, formData).subscribe(
                () => {
                    window.location.href = '/login';
                    setTimeout(() => {
                        this.showToast('success', 'Exito', 'Contraseña restablecida con éxito.');
                    }, 300);
                },
                (error) => {
                    this.showToast('error', 'Error', 'Hubo un error al restablecer la contraseña.');
                }
            );
        }
    }
    public showToast(severity: 'success' | 'error', summary: string, detail: string) {
        this.messageService.add({ severity, summary, detail });
    }
}
