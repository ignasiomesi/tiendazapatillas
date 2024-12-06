import { TestBed } from '@angular/core/testing';
import { ApiDolarService } from './api-dolar.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule

describe('ApiDolarService', () => {
  let service: ApiDolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiDolarService, SQLite], // Añadimos ApiDolarService y SQLite como proveedores
      imports: [HttpClientTestingModule],  // Añadimos HttpClientTestingModule
    });
    service = TestBed.inject(ApiDolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
