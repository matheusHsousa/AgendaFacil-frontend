import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
@Component({
  selector: 'app-customers-registered',
  templateUrl: './customers-registered.component.html',
  styleUrls: ['./customers-registered.component.scss'],
})
export class CustomersRegisteredComponent {
  displayedColumns = [
    'customer',
    'name',
    'type',
    'cnpj',
    'celNumber',
    'state',
    'city',
    'role',
    'address',
    'addressNumber',
    'actionDelete',
    'actionEdit'
  ];
  customers: any;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.adminService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }

  getAll() {
    this.adminService.getCustomers().subscribe((data) => {
      this.customers = data;
    });
  }
  ngOnInit(): void {}

  deleteCustomer(a: number) {
    const data = {
      id: a,
      status: false,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        name: 'Deletar',
        text: 'Dessa forma vc estará excluindo e não poderá mais recuperar os dados da empresa',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.deleteEstabelecimento(data).subscribe(
          (response) => {
            this.getAll();
            this.openSnackBar('Exclusão bem-sucedida', 'Fechar');
          },
          (error) => {
            this.openSnackBar('Erro ao excluir o cliente', 'Fechar');
          }
        );
      } else {
        this.openSnackBar('Exclusão cancelada', 'Fechar');
      }
    });
  }

  editCustomer(a: number) {
    this.adminService.getCustumerById(a).subscribe((data) => {
      let value: any[] = data;
  
      const dialogRef = this.dialog.open(EditCustomerComponent, {
        width: '900px',
        data: {
          id: a,
          data: value
        },
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.getAll();
      });
    });
  }
  
  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
