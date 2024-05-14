import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Base64Service } from '../../services/base64.service';
import { SharedService } from '../../services/shared.service';

export interface DialogData {
  img: string[];
  value: any;
}

@Component({
  selector: 'app-dialog-details',
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss'],
})
export class DialogDetailsComponent {
  number: any;
  cep: any;
  city: any;
  address: any;
  idCustomer: any;
  fotos: File[] = [];
  nota: any;
  jsonString: any;
  getId: any;
  userNote: number = 0;
  commentText: any;
  replyText: string = '';
  comments: any[] = [];
  isAnsewr: boolean = false;
  label = 'Escreva seu comentario';
  commentId: any;
  replys: any;
  idReplies: any[] = [];
  showAllReplies: boolean = false;
  seeAnsewer: boolean = false;
  commentIscustomer: any;
  constructor(
    public dialogRef: MatDialogRef<DialogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private base64Service: Base64Service,
    private sharedService: SharedService
  ) {
    this.jsonString = localStorage.getItem('userId');
    this.getId = JSON.parse(this.jsonString);

  
    this.commentIscustomer = data.value.id

    this.number = data.value.addressNumber;
    this.cep = data.value.CEP;
    this.city = data.value.city;
    this.address = data.value.address;
    this.idCustomer = data.value.id;
    this.getComments();

    this.sharedService
      .getFotos(this.idCustomer)
      .subscribe((fotosData: string[]) => {
        this.fotos = fotosData
          .map((imagem) => this.base64Service.convertBase64ToFile(imagem))
          .filter((imagem) => imagem !== null) as File[];
      });

    this.getNotas();
  }

  ngOnInit() {}

  toggleReplies(comment: any) {
    comment.expanded = !comment.expanded;
  }

  resetCommentText() {
    this.commentText = '';
  }

  getComments() {
    this.sharedService.getComments(this.idCustomer).subscribe(
      (data: any[]) => {
        this.comments = data;
        this.idReplies = data.map((comment) => comment.id);
        this.getReplys();
      },
      (error) => {
        console.error('Erro ao buscar comentários:', error);
      }
    );
  }

  getReplys() {
    this.sharedService.getReplies(this.idReplies).subscribe(
      (data: any[]) => {
        this.replys = data;
  
        const repliesMap = data.reduce((acc, reply) => {
          if (!acc[reply.comment_id]) {
            acc[reply.comment_id] = [];
          }
          acc[reply.comment_id].push(reply);
          return acc;
        }, {});
  
        this.comments.forEach(comment => {
          comment.replies = repliesMap[comment.id] || [];
        });
          this.comments.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
      },
      (error) => {
        console.error('Erro ao buscar respostas:', error);
      }
    );
  }

 
  OpenAppointmentes(){
    
  }

  isAswer(customer: any, idCustomer: any) {
    this.isAnsewr = true;
    this.commentId = idCustomer;
    if (this.isAnsewr) {
      this.label = `Respondendo à ${customer}`;
    }
  }

  closeIsAnswer(){
    this.isAnsewr = false;
    if (!this.isAnsewr) {
      this.label = 'Escreva seu comentario';
    }
  }

  submitComment() {
    this.sharedService
      .addComment(this.idCustomer, this.getId.id, this.commentText)
      .subscribe(
        (data: any) => {
          this.getComments();
          this.commentText = '';
        },
        (error) => {
          console.error('Erro ao adicionar comentário:', error);
        }
      );
  }

  submitReply() {
    this.sharedService
      .addReply(this.commentId, this.getId.id, this.commentText)
      .subscribe(
        (data: any) => {
          this.getComments();
          this.getReplys();
          this.commentText;
        },
        (error) => {
          console.error('Erro ao adicionar resposta:', error);
        }
      );
  }

  getNotas() {
    this.sharedService.getAvaliations(this.idCustomer).subscribe((data) => {
      this.nota = data;
    });
  }

  getStarsArray(nota: number): number[] {
    return new Array(Math.round(nota));
  }

  onRatingSet(rating: number): void {
    this.userNote = rating;

    const values = {
      id_user: this.getId.id,
      customer_id: this.idCustomer,
      avaliation: this.userNote,
    };

    this.sharedService.avaliation(values).subscribe();

    this.getNotas();
  }

  getLocal(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const address = `${this.number}, ${this.city}, ${this.cep}, , ${this.address}`;

      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const latitude = results[0].geometry.location.lat();
          const longitude = results[0].geometry.location.lng();
          resolve({ latitude, longitude });
        } else {
          console.error(
            'Nenhum resultado encontrado para o endereço fornecido.'
          );
          reject('Geocoding failed');
        }
      });
    });
  }

  getPreviewUrl(file: File): string {
    if (file) {
      return URL.createObjectURL(file);
    } else {
      return '../../../../assets/img/icone.webp';
    }
  }

  onChatClick(): void {
    const locationData = {
      latitude: this.data.value.latitude,
      longitude: this.data.value.longitude,
    };
    this.dialogRef.close(locationData);
  }

  openImage(file: File): void {
    console.log('Abrir imagem:', file);
  }

  trocarPosicaoImagens(index: number) {
    [this.fotos[0], this.fotos[index]] = [this.fotos[index], this.fotos[0]];
  }
}
