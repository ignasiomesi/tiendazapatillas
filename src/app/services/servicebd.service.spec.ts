import { TestBed } from '@angular/core/testing';
import { ServicebdService } from './servicebd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ServicebdService', () => {
  let service: ServicebdService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ServicebdService, SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    service = TestBed.inject(ServicebdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
