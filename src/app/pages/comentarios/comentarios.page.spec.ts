import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComentariosPage } from './comentarios.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ComentariosPage', () => {
  let component: ComentariosPage;
  let fixture: ComponentFixture<ComentariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComentariosPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(ComentariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
