import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss'],
})
export class EditCustomerComponent {
  FormCustomer: FormGroup;
  categorys: any;
  roles: any;
  hide = true;
  formEditValues: any;
  completeForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formEditValues = data;

    this.FormCustomer = this.setInitialForm();

  }

  ngOnInit() {
    this.adminService.getCategorias().subscribe((data) => {
      this.categorys = data;
    });

    this.adminService.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }

  setInitialForm() {
    return this.formBuilder.group({
      id: this.formEditValues.id,
      customer: [this.formEditValues.data.customer, Validators.required],
      name: [this.formEditValues.data.name, Validators.required],
      type: [ this.formEditValues.data.type, Validators.required],
      cnpj: [this.formEditValues.data.cnpj, [Validators.required, Validators.minLength(14)]],
      celNumber: [
        this.formEditValues.data.celNumber,
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
        ],
      ],
      cep: [this.formEditValues.data.CEP, Validators.required],
      address: [this.formEditValues.data.address, Validators.required],
      addressNumber: [this.formEditValues.data.addressNumber, Validators.required],
      state: [this.formEditValues.data.state, Validators.required],
      city: [this.formEditValues.data.city, Validators.required],
      role: [this.formEditValues.data.role, Validators.required],
      status: true,
      login: [this.formEditValues.data.login, [Validators.required, Validators.email]],
      password: [this.formEditValues.data.password, Validators.required],
    });
  }

  save() {
    if (this.FormCustomer.valid) {
      const formData = this.FormCustomer.value;
      this.adminService.editEstabelecimento(formData).subscribe(
        (response) => {
          this.dialogRef.close();
          this.openSnackBar('Estabelecimento Editado com sucesso', 'Fechar');
        },
        (error) => {
          this.openSnackBar(
            'Erro ao editar estabelecimento, verifique se todos os dados devem ser preenchidos',
            'Fechar'
          );
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
                state: data.uf,
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
        phoneNumber = `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(
          2,
          7
        )}-${phoneNumber.substring(7)}`;
        celNumberControl.setValue(phoneNumber, { emitEvent: false });
      }
    }
  }

  formatCnpj() {
    const cnpjControl = this.FormCustomer.get('cnpj');
    if (cnpjControl) {
      let cnpj = cnpjControl.value.toString().replace(/\D/g, '');
      if (cnpj.length === 14) {
        cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(
          2,
          5
        )}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(
          12
        )}`;
        cnpjControl.setValue(cnpj, { emitEvent: false });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
