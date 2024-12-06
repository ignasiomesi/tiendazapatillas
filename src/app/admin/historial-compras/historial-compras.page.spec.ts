import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialComprasPage } from './historial-compras.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('HistorialComprasPage', () => {
  let component: HistorialComprasPage;
  let fixture: ComponentFixture<HistorialComprasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialComprasPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
