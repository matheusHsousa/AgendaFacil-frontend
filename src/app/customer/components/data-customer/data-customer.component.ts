import { ChangeDetectorRef, Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EditImageComponent } from '../edit-image/edit-image.component';
import { Base64Service } from 'src/app/shared/services/base64.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-data-customer',
  templateUrl: './data-customer.component.html',
  styleUrls: ['./data-customer.component.scss'],
})
export class DataCustomerComponent {
  isChecked: any;
  statusValue: any;
  formEditValues: any;
  getId: any;
  jsonString: any;
  originalCheckedValue: any;
  text: string = '';
  urlImage: any;
  showEdit: boolean = false;
  newImage: SafeUrl | null = null;
  imagePath: any;

  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private base64Service: Base64Service,
    private sanitizer: DomSanitizer
  ) {
    this.jsonString = localStorage.getItem('userId');
    this.getId = JSON.parse(this.jsonString);
  }

  ngOnInit() {
    this.status();
    this.customerService.getProfilePicture(this.getId.id).subscribe((data) => {
      this.urlImage = data;
    });

    this.customerService.getStatus(this.getId.id).subscribe((data) => {
      this.statusValue = data;

      if (this.statusValue == 1) {
        this.isChecked = true;
        this.originalCheckedValue = true;
        this.text = 'Inativar empresa';
      } else {
        this.isChecked = false;
        this.originalCheckedValue = false;
        this.text = 'Ativar empresa';
      }
    });
  }

  status() {
    this.customerService.getCustumerById(this.getId.id).subscribe((data) => {
      this.formEditValues = data;
    });
  }

  onToggleChange(event: MatSlideToggleChange) {
    const newValue = event.checked;

    if (newValue !== this.originalCheckedValue) {
      this.isChecked = newValue;
      this.text = newValue ? 'Inativar empresa' : 'Ativar empresa';
      this.openConfirmDialog();
    }
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        name: !this.isChecked ? 'Inativar empresa' : 'Ativar Empresa',
        text: !this.isChecked
          ? 'Dessa forma sua empresa não aparecerá para possíveis clientes.'
          : 'Dessa forma sua empresa irá aparecer para novos possíveis clientes.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.originalCheckedValue = this.isChecked;
        this.inactiverOrActiveCustomer();
      } else {
        this.isChecked = this.originalCheckedValue;
      }
    });
  }

  inactiverOrActiveCustomer() {
    const data = {
      id: this.getId.id,
      status: this.isChecked,
    };

    this.customerService.setStatus(data).subscribe(
      (response) => {
        this.status();
        this.openSnackBar('Ativação/Inativação bem-sucedida', 'Fechar');
        this.cdr.detectChanges();
      },
      (error) => {
        this.openSnackBar('Erro ao atualizar empresa', 'Fechar');
        this.status();
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onMouseOver() {
    this.showEdit = true;
  }

  onMouseOut() {
    this.showEdit = false;
  }

  edit() {
    const dialogRef = this.dialog.open(EditImageComponent, {
      data: {
        img: this.urlImage,
        id: this.getId.id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.customerService
        .getProfilePicture(this.getId.id)
        .subscribe((data) => {
          this.urlImage = data;
        });
    });
  }
}
