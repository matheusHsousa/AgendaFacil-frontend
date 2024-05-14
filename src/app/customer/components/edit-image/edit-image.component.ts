import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataCustomerComponent } from '../data-customer/data-customer.component';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Base64Service } from 'src/app/shared/services/base64.service';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent {
  url: any;
  newImage: File | null = null;
  base64: any;

  constructor(
    private dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    private base64String: Base64Service,
    private snackBar: MatSnackBar,
  ) {
    this.url = data;

    console.log('a', this.url.img)
    this.newImage = this.base64String.convertBase64ToFile(this.url.img);

  }

  onFileSelected(event: any) {
    this.newImage = event.target.files[0];
    console.log('new', this.newImage)

    if (this.newImage) {
      this.base64String.fileToBase64(this.newImage).then((base64String) => {
        this.base64 = base64String;
        console.log(this.base64)
      });
    }
  }

  uploadImage() {
    const data = {
      id: this.url.id,
      iconPerfil: this.base64,
    };
    if (this.newImage) {
      this.customerService.editProfilePicture(data).subscribe((response) => {
        this.dialogRef.close();
        location.reload();
        this.openSnackBar('imagem Editada com sucesso', 'Fechar');
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  
}
