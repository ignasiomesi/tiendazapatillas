import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Si no carga la foto de perfil del usuario, muestre una predeterminada', () => {
    const event = { target: { src: '' } };
    component.onImageError(event);
    expect(event.target.src).toBe('https://th.bing.com/th/id/R.910d743c758bd4103ff3528586fbb77f?rik=zDGAvxW1zCJGgQ&pid=ImgRaw&r=0');
  });


  
});
