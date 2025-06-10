import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export default class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async submit() {
    if (this.form.invalid) return;

    const email = this.form.value.email!;
    try {
      await this.authService.resetPassword(email);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      toast.error('Error al enviar el correo');
    }
  }
}
