import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarPage } from './modificar.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';  // Importar ActivatedRoute
import { of } from 'rxjs';  // Importar of para crear un observable simulado

describe('ModificarPage', () => {
  let component: ModificarPage;
  let fixture: ComponentFixture<ModificarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModificarPage],
      providers: [
        SQLite,
        {
          provide: ActivatedRoute,  // Proveer ActivatedRoute
          useValue: { snapshot: { paramMap: of({}) } }  // Simular un objeto de ActivatedRoute
        },
      ], // Añadimos ActivatedRoute simulado
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
