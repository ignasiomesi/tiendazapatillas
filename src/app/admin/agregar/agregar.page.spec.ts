import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPage } from './agregar.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AgregarPage', () => {
  let component: AgregarPage;
  let fixture: ComponentFixture<AgregarPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarPage],
      providers: [
        { provide: ServicebdService, useValue: { insertarProducto: jasmine.createSpy().and.returnValue(Promise.resolve()) } },
        { provide: ToastController, useValue: { create: jasmine.createSpy().and.returnValue({ present: jasmine.createSpy() }) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    });
    fixture = TestBed.createComponent(AgregarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('Debe registrar la zapatilla y guardar en la base de datos', async () => {
    component.nombre = 'Zapatilla Nueva';
    component.marca = 'Nike';
    component.precio = 100;
    component.descripcion = 'Zapatilla deportiva';
    component.stock = 10;
    component.seccion = 'D';
    component.foto = 'foto.jpg';

    await component.crear();

    expect(component['toastController'].create).toHaveBeenCalledWith(jasmine.objectContaining({ message: 'Producto agregado correctamente.' }));  });
});
