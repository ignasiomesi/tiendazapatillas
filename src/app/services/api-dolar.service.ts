import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiDolarService {
  private apiKey = '052e207dbaf4726f410f9311'; // Asegúrate de que esta sea tu clave API válida
  private apiUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/USD`;

  constructor(private http: HttpClient) {}

  getDollarValue(): Observable<number> {
    console.log('Llamando a getDollarValue en el servicio');
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        console.log('Datos recibidos de la API:', data);
        if (data && data.conversion_rates && data.conversion_rates.CLP) {
          return data.conversion_rates.CLP;
        } else {
          throw new Error('Datos no válidos recibidos de la API');
        }
      }),
      catchError(this.handleError)
    );
  }

  convertToChileanPesos(amount: number): Observable<number> {
    return this.getDollarValue().pipe(
      map(dollarValue => amount * dollarValue),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ocurrió un error en la solicitud:', error);
    return throwError(() => new Error('Error de conexión con la API. Por favor, verifica tu conexión a Internet o intenta más tarde.'));
  }
}