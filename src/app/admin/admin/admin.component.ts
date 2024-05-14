import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  FormCustomer: FormGroup;
  categorys: any;
  roles: any;
  hide = true;
  qrCodeData: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    this.FormCustomer = this.setInitialForm();
  }

  ngOnInit() {
    this.adminService.getCategorias().subscribe((data) => {
      this.categorys = data;
    });

    this.adminService.getRoles().subscribe((data) => {
      this.roles = data;
    });

    this.http.post('http://localhost:8800/obterQRCode', {})
    .subscribe((response: any) => {
      console.log('Resposta do backend (QR Code):', response);
      this.qrCodeData = response.qrCodeData;
    }, (error) => {
      console.error('Erro ao obter o QR Code:', error);
    });
  }

  setInitialForm() {
    return this.formBuilder.group({
      customer: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      celNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
      CEP: ['', Validators.required],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      status: false,
      login: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  register() {
    if (this.FormCustomer.valid) {
      const formData = this.FormCustomer.value;
      this.adminService.createEstabelecimento(formData).subscribe(
        (response) => {
          this.openSnackBar('Estabelecimento criado com sucesso', 'Fechar');
          this.FormCustomer = this.setInitialForm();
        },
        (error) => {
          this.openSnackBar('Erro ao criar estabelecimento, verifique se todos os dados devem ser preenchidos', 'Fechar');
        }
      );
    } else {
      console.log('Formulário inválido. Corrija os erros antes de enviar.');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  clean() {
    this.FormCustomer = this.setInitialForm();
  }

  onCepBlur() {
    const formCustomer = this.FormCustomer;
  
    if (formCustomer) {
      const cepControl = formCustomer.get('CEP');
      
      if (cepControl) {
        const CEP = cepControl.value;
  
        if (CEP && CEP.length === 8) {
          this.adminService.getAddressByCep(CEP).subscribe(
            (data) => {
              formCustomer.patchValue({
                address: data.logradouro,
                city: data.localidade,
                state: data.uf
              });
            },
            (error) => {
              console.error('Erro ao buscar o endereço:', error);
            }
          );
        }
      }
    }
  }  

  formatPhoneNumber() {
    const celNumberControl = this.FormCustomer.get('celNumber');
    if (celNumberControl) {
      let phoneNumber = celNumberControl.value.toString().replace(/\D/g, '');
      if (phoneNumber.length === 11) {
        phoneNumber = `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;
        celNumberControl.setValue(phoneNumber, { emitEvent: false });
      }
    }
  }

  formatCnpj() {
    const cnpjControl = this.FormCustomer.get('cnpj');
    if (cnpjControl) {
      let cnpj = cnpjControl.value.toString().replace(/\D/g, '');
      if (cnpj.length === 14) {
        cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`;
        cnpjControl.setValue(cnpj, { emitEvent: false });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
