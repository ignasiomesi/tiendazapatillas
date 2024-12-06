import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModperfilPage } from './modperfil.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModperfilPage', () => {
  let component: ModperfilPage;
  let fixture: ComponentFixture<ModperfilPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModperfilPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(ModperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
