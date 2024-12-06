import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidacontraPage } from './olvidacontra.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('OlvidacontraPage', () => {
  let component: OlvidacontraPage;
  let fixture: ComponentFixture<OlvidacontraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OlvidacontraPage],
      providers: [SQLite], // Añadimos SQLite como proveedor
    }).compileComponents();

    fixture = TestBed.createComponent(OlvidacontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
