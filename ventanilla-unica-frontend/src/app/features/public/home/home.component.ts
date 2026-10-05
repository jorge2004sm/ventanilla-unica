import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly auth = inject(AuthService);
  readonly pasos = [
    {
      numero: 1,
      titulo: 'Elige trámite',
      descripcion: 'Selecciona qué gestión necesitas realizar',
    },
    {
      numero: 2,
      titulo: 'Elige organización',
      descripcion: 'Selecciona dónde quieres realizar el trámite',
    },
    {
      numero: 3,
      titulo: 'Fecha y hora',
      descripcion: 'Elige el día y la hora que mejor te venga',
    },
    {
      numero: 4,
      titulo: 'Rellena tus datos',
      descripcion: 'Rellena el formulario con tus datos personales',
    },
  ];
}