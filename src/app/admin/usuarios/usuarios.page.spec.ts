import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';  // Importamos SQLite

describe('UsuariosPage', () => {
  let component: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosPage],
      providers: [SQLite],  // Proveemos el servicio SQLite
    });

    fixture = TestBed.createComponent(UsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
