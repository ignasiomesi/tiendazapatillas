import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AggComentarioPage } from './agg-comentario.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('AggComentarioPage', () => {
  let component: AggComentarioPage;
  let fixture: ComponentFixture<AggComentarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggComentarioPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(AggComentarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
