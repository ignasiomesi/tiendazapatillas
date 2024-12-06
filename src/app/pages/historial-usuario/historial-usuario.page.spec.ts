import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialUsuarioPage } from './historial-usuario.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('HistorialUsuarioPage', () => {
  let component: HistorialUsuarioPage;
  let fixture: ComponentFixture<HistorialUsuarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialUsuarioPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
