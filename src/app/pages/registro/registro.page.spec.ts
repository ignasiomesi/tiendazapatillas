import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroPage],
      providers: [
        { provide: ServicebdService, useValue: { insertarUsuario: jasmine.createSpy().and.returnValue(Promise.resolve()) } },
        { provide: ToastController, useValue: { create: jasmine.createSpy().and.returnValue({ present: jasmine.createSpy() }) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    });
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('El usuario se registra y dirige al login', async () => {
    component.nomUser = 'juanperez';
    component.contra = 'password123';
    component.repiteContra = 'password123';
    component.codigo = '1234';
    component.nombre = 'Juan';
    component.apellido = 'Pérez';
    component.foto = 'foto.jpg';

    await component.registrarUsuario();

    expect(component['router'].navigate).toHaveBeenCalledWith(['/inicio-sesion']);
  });

  it('No debería registrar al usuario si las contraseñas no coinciden', async () => {
    // Establecer los valores de entrada donde las contraseñas no coinciden
    component.nomUser = 'juanperez';
    component.contra = 'password123';
    component.repiteContra = 'differentPassword';  // Contraseñas NO coinciden
    component.codigo = '1234';
    component.nombre = 'Juan';
    component.apellido = 'Pérez';
    component.foto = 'foto.jpg';

    // Llamar al método de registro
    await component.registrarUsuario();

    // Verificar que el método `navigate` NO haya sido llamado (no debe redirigir)
    expect(component['router'].navigate).not.toHaveBeenCalled();
    
    // También puedes verificar que se haya mostrado un mensaje de error con ToastController
    expect(component['toastController'].create).toHaveBeenCalled();
  });

  it('no debería registrar al usuario si algún campo está vacío', async () => {
    // Establecer valores con un campo vacío
    component.nomUser = ''; // Campo vacío
    component.contra = 'password123';
    component.repiteContra = 'password123';
    component.codigo = '1234';
    component.nombre = 'Juan';
    component.apellido = 'Pérez';
    component.foto = 'foto.jpg';

    // Llamar al método de registro
    await component.registrarUsuario();

    // Verificar que el método `navigate` NO haya sido llamado (no debe redirigir)
    expect(component['router'].navigate).not.toHaveBeenCalled();
  });
});
