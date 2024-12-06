import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioSesionPage } from './inicio-sesion.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('InicioSesionPage', () => {
  let component: InicioSesionPage;
  let fixture: ComponentFixture<InicioSesionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioSesionPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(InicioSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
