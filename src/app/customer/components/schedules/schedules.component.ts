import { Component } from '@angular/core';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent {
  listaItens = [{ nome: '', horarios: [] as string[] }];
  dataSelecionada: Date = new Date('');

  obterValorData() {
    console.log(this.dataSelecionada);

    if (isNaN(this.dataSelecionada.getTime())) {
      this.dataSelecionada = new Date();
    }

    console.log(this.dataSelecionada);
    
    const dia = this.dataSelecionada.getDate();
    const mes = this.dataSelecionada.getMonth() + 1;
    const ano = this.dataSelecionada.getFullYear();

    this.listaItens[0].nome = `${dia}/${mes}/${ano}`;
    console.log('Data selecionada:', this.listaItens[0].nome);
}
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.gerarHorarios();
    this.dateAdapter.setLocale('en-GB');
  }

  gerarHorarios() {
    const inicioDia = moment('09:00', 'HH:mm');
    const fimDia = moment('18:00', 'HH:mm');

    this.listaItens.forEach((item) => {
      let horaAtual = inicioDia.clone();
      while (horaAtual.isBefore(fimDia)) {
        item.horarios.push(horaAtual.format('HH:mm') as string);
        horaAtual.add(30, 'minutes');
      }
    });
  }

  alterarDataNova(dataNova: Date) {
    console.log('Data alterada para:', dataNova);
  }
}
