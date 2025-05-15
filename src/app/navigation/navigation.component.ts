import { Component, inject, LOCALE_ID } from '@angular/core'; // Importa LOCALE_ID
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule, registerLocaleData } from '@angular/common'; // Importa registerLocaleData
import localeEsCl from '@angular/common/locales/es-CL'; // Importa el locale para Chile

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// Para HttpClient (descomentar y configurar si lo usas para llamar a tu backend)
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// Registrar el locale chileno para el pipe number
registerLocaleData(localeEsCl);

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    // HttpClientModule, // Si HttpClient se usa aquí y este es el componente raíz o un módulo principal
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' } // Proveer LOCALE_ID para el pipe number
  ]
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  // private http = inject(HttpClient); // Descomenta si vas a hacer llamadas HTTP

  // Variables para los montos de las deudas (pueden venir de un servicio)
  readonly montoDeudaHogar = 12990;
  readonly montoDeudaMovil = 0; // O el monto que corresponda

  // Booleanos para saber si el checkbox está seleccionado
  deudaHogarSeleccionada: boolean = true; // Deuda hogar seleccionada por defecto
  deudaMovilSeleccionada: boolean = false;

  email: string = '';
  pagoSeleccionado: string | null = null;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Getters para mostrar los montos en el HTML (útil si los montos fueran dinámicos)
  get totalDeudaHogar(): number {
    return this.montoDeudaHogar;
  }

  get totalDeudaMovil(): number {
    return this.montoDeudaMovil;
  }

  get totalAPagar(): number {
    let total = 0;
    if (this.deudaHogarSeleccionada) {
      total += this.montoDeudaHogar;
    }
    if (this.deudaMovilSeleccionada) {
      total += this.montoDeudaMovil;
    }
    return total;
  }

  seleccionarMetodoPago(metodo: string): void {
    if (this.pagoSeleccionado === metodo) {
      this.pagoSeleccionado = null; // Permite deseleccionar si se hace clic de nuevo
    } else {
      this.pagoSeleccionado = metodo;
    }
    console.log(`Método de pago seleccionado: ${this.pagoSeleccionado}`);
  }

  procederAlPagoFinal(): void {
    if (!this.email || !this.email.includes('@')) { // Validación simple de email
      alert('Por favor, ingresa un email válido.');
      return;
    }
    if (!this.pagoSeleccionado) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }
    if (this.totalAPagar <= 0) {
      alert('No hay monto a pagar. Selecciona al menos un servicio.');
      return;
    }

    console.log(`Procediendo al pago final con: ${this.pagoSeleccionado}`);
    console.log(`Monto total: $${this.totalAPagar}`);
    console.log(`Email del cliente: ${this.email}`);

    const datosPago = {
      method: this.pagoSeleccionado,
      amount: this.totalAPagar,
      currency: 'CLP',
      email: this.email,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // ID de orden más único
      description: `Pago servicios Erizcafe: ${this.deudaHogarSeleccionada ? 'Hogar' : ''} ${this.deudaMovilSeleccionada ? 'Móvil' : ''}`.trim(),
      // Otros datos que tu backend necesite
    };

    // --- INICIO DE SIMULACIÓN DE LLAMADA AL BACKEND ---
    // En una aplicación real, aquí harías una llamada HTTP POST a tu backend.
    // Ejemplo:
    // this.http.post('URL_DE_TU_BACKEND/api/v1/payments/initiate-payment', datosPago)
    //   .subscribe({
    //     next: (response: any) => {
    //       console.log('Respuesta del backend:', response);
    //       if (response.redirectUrl) {
    //         window.location.href = response.redirectUrl; // Redirige a la pasarela
    //       } else if (response.token && this.pagoSeleccionado === 'webpay') {
    //         // Lógica para Webpay JS si el backend devuelve un token para eso
    //         console.log('Token de Webpay JS recibido:', response.token);
    //         // Aquí integrarías Webpay.checkout(...) o similar
    //         alert('Integración con Webpay JS iniciada (simulación).');
    //       }
    //       else {
    //         alert('Respuesta inesperada del backend al iniciar el pago.');
    //       }
    //     },
    //     error: (error) => {
    //       console.error('Error al contactar el backend:', error);
    //       alert(`Error al iniciar el pago: ${error.message || 'Error desconocido del servidor.'}`);
    //     }
    //   });
    // --- FIN DE SIMULACIÓN DE LLAMADA AL BACKEND ---

    // --- ALERTA DE SIMULACIÓN ACTUAL ---
    alert(`SIMULACIÓN:\n\nSe iniciaría el pago con ${datosPago.method.toUpperCase()}.\nOrden ID: ${datosPago.orderId}\nMonto: $${datosPago.amount.toLocaleString('es-CL')}\nEmail: ${datosPago.email}\nDescripción: ${datosPago.description}\n\nEn una aplicación real, después de que tu backend procese esto, serías redirigido a la pasarela de pago o se mostraría un widget de pago.`);
    // --- FIN ALERTA DE SIMULACIÓN ---
  }
}