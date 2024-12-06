import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZapatillasPage } from './zapatillas.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ZapatillasPage', () => {
  let component: ZapatillasPage;
  let fixture: ComponentFixture<ZapatillasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZapatillasPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(ZapatillasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
