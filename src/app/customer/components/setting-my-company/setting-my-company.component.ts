import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { Base64Service } from 'src/app/shared/services/base64.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-setting-my-company',
  templateUrl: './setting-my-company.component.html',
  styleUrls: ['./setting-my-company.component.scss'],
})
export class SettingMyCompanyComponent implements OnInit {
  formCustomer!: FormGroup;
  selectedFiles: File[] = [];
  nextId = 1;
  categorys: any;
  roles: any;
  hide = true;
  formEditValues: any;
  completeForm: any;
  getId: any;
  jsonString: any;
  desable = true;
  defaultImages: string[] = Array(4).fill('grey-image-url');
  fotos: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private base64: Base64Service,
    private cdr: ChangeDetectorRef
  ) {
    this.jsonString = localStorage.getItem('userId');
    this.getId = JSON.parse(this.jsonString);
    this.setInitialFormVoid();
  }

  ngOnInit() {
    forkJoin([
      this.customerService.getCategorias(),
      this.customerService.getRoles(),
      this.customerService.getCustumerById(this.getId.id),
      this.customerService.getFotos(this.getId.id),
    ]).subscribe(([categorias, roles, customerData, fotosResponse]) => {
      this.categorys = categorias;
      this.roles = roles;
      this.formEditValues = customerData;
      this.editForm();
      const fotosArray = fotosResponse as any[];

      if (fotosArray && Array.isArray(fotosArray)) {
        fotosArray.forEach((item: any) => {
          const file = this.base64.convertBase64ToFile(item);
          if (file) {
            this.selectedFiles.push(file);
          }
        });
      } else {
        console.error('Resposta de fotos inválida:', fotosResponse);
      }
      console.log('Fotos array:', fotosArray);
    });
  }

  setInitialFormVoid() {
    this.formCustomer = this.formBuilder.group({
      id: this.getId,
      customer: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      celNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(15),
        ],
      ],
      CEP: ['', Validators.required],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      status: true,
      login: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      description: [''],
    });
  }

  editForm() {
    this.formCustomer.patchValue(this.formEditValues);
  }

  edit() {
    if (this.formCustomer.valid) {
      const formData = this.formCustomer.value;
      this.customerService.editEstabelecimento(formData).subscribe(
        (response) => {
          this.openSnackBar('Estabelecimento Editado com sucesso', 'Fechar');
          this.router.navigate(['/customer']);
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

  save() {
    if (this.formCustomer.valid) {
      const formData = this.formCustomer.value;
      this.customerService.editEstabelecimento(formData).subscribe(
        (response) => {
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
    this.editForm();
  }

  onCepBlur() {
    const formCustomer = this.formCustomer;

    if (formCustomer) {
      const cepControl = formCustomer.get('CEP');

      if (cepControl) {
        const CEP = cepControl.value;

        if (CEP && CEP.length === 8) {
          this.customerService.getAddressByCep(CEP).subscribe(
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
    const celNumberControl = this.formCustomer.get('celNumber');
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
    const cnpjControl = this.formCustomer.get('cnpj');
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

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (this.selectedFiles.length + files.length <= 4) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(files)];
    } else {
      console.warn('Número máximo de imagens atingido (4).');
    }
  }

  onAddImage(): void {
    if (this.selectedFiles.length < 4) {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.multiple = true;
      inputElement.addEventListener('change', (event: any) => {
        this.onFileSelected(event);
      });
      inputElement.click();
    } else {
      this.openSnackBar('Número máximo de imagens atingido (4).', 'Fechar');
    }
  }

  onUpload(): void {
    if (this.selectedFiles.length > 0) {
      const base64Values: string[] = [];
      const processFiles = async () => {
        for (const file of this.selectedFiles) {
          const base64Value = await this.base64.fileToBase64(file);
          if (typeof base64Value === 'string') {
            base64Values.push(base64Value);
          }
        }
        if (base64Values.length > 0) {
          const data = {
            id: this.getId.id,
            fotos: base64Values,
          };
          this.customerService.addphotos(data).subscribe(
            (response) => {
              this.openSnackBar('Deu certo com sucesso', 'Fechar');
            },
            (error) => {
              this.openSnackBar(
                'Erro ao editar estabelecimento, verifique se todos os dados devem ser preenchidos',
                'Fechar'
              );
            }
          );
        }
      };
      processFiles();
    }
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    const values = {
      index: index,
      id: this.getId.id,
    };
    this.customerService.deleteImage(values).subscribe(
      (response) => {
        this.openSnackBar('Apagou', 'Fechar');
      },
      (error) => {
        this.openSnackBar(
          'Pagou não',
          'Fechar'
        );
      }
    );
  }
}
