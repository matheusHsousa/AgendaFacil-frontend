import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from 'src/app/shared/components/dialog-details/dialog-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { format, addDays } from 'date-fns';

@Component({
  selector: 'app-dialog-appointments',
  templateUrl: './dialog-appointments.component.html',
  styleUrls: ['./dialog-appointments.component.scss'],
})
export class DialogAppointmentsComponent implements OnInit {
  qrCodeData: string = '';
  backendUrl = 'http://localhost:8800';
  buttonColors = ['#329cff', '#2497d5', '#1b709d', '#155577']; 
  currentColorIndex = 0;
  jsonString: any;
  getId: any;
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'customer',
    'iconPerfil',
    'appointment_date',
    'appointment_time',
    'status',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  startTime: any;
  endTime: any;
  interval: any;
  currentWeekIndex: number = 1;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogAppointmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.jsonString = localStorage.getItem('userId');
    this.getId = JSON.parse(this.jsonString);
    console.log(this.getId, data);
  }

  ngOnInit() {
    this.loadAppointments();
  }

  getButtonColor(index: number): string {
    // Ciclo para a próxima cor
    this.currentColorIndex = index % this.buttonColors.length;
    return this.buttonColors[this.currentColorIndex];
  }

  generateTimeSlots(startTime: any, endTime: any, interval: number) {
    const timeSlots = [];
    let currentTime = new Date(`01/01/2023 ${startTime}`);

    while (currentTime <= new Date(`01/01/2023 ${endTime}`)) {
      timeSlots.push(
        currentTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return timeSlots;
  }

  loadAppointments() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);
  
    const monthDates: string[] = [];
    for (let i = 0; i <= endOfMonth.getDate(); i++) {  
      const currentDate = addDays(startOfMonth, i);
      monthDates.push(format(currentDate, 'dd-MM-yyyy'));
    }
  
    const startOfWeek = addDays(startOfMonth, this.currentWeekIndex * 7);
    const endOfWeek = addDays(startOfWeek, 6);
  
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startOfWeek, i);
      weekDates.push(format(currentDate, 'dd-MM-yyyy'));
    }
  
    this.startTime = '09:00:00';
    this.endTime = '18:00:00';
    this.interval = 30;
  
    const hours = this.generateTimeSlots(
      this.startTime,
      this.endTime,
      this.interval
    );
  
    this.http
      .get<any[]>('http://localhost:8800/getAppointments')
      .subscribe((data) => {
        const availableSlots = this.extractAvailableSlots(data, weekDates);
  
        const filteredSlots = this.filterAvailableSlots(availableSlots, hours);
  
        this.dataSource = new MatTableDataSource(filteredSlots);
        this.dataSource.paginator = this.paginator;
      });
  }

  extractAvailableSlots(data: any[], monthDates: string[]): any[] {
    const availableSlotsMap: { [key: string]: string[] } = {};

    data.forEach((appointment) => {
      const date = format(new Date(appointment.appointment_date), 'dd-MM-yyyy');
      const time = appointment.appointment_time;

      if (monthDates.includes(date)) {
        if (!availableSlotsMap[date]) {
          availableSlotsMap[date] = [];
        }

        availableSlotsMap[date].push(time);
      }
    });

    return monthDates.map((date) => {
      return { date, times: availableSlotsMap[date] || [] };
    });
  }

  filterAvailableSlots(availableSlots: any[], hours: string[]): any[] {
    return availableSlots.map((slot) => {
      const availableTimes = hours.filter(
        (time) => !this.isTimeInSlot(time, slot)
      );
      return { date: slot.date, times: availableTimes };
    });
  }

  isTimeInSlot(time: string, slot: { date: string; times: string[] }): boolean {
    const dateTimeString = `${slot.date} ${time}`;
    const slotDateTime = new Date(dateTimeString);

    return slot.times.some((slotTime) => {
      const slotTimeString = `${slot.date} ${slotTime}`;
      const occupiedDateTime = new Date(slotTimeString);
      return occupiedDateTime.getTime() === slotDateTime.getTime();
    });
  }


  enviar() {
  }

  selectDate(a: any) {
    console.log('banana');
  }

  selectTime(date: string, time: string) {
    console.log(`Data selecionada: ${date}, Hora selecionada: ${time}`);
    const name = this.data.value.customer
    
    const requestData = {
      phone: this.data.value.celNumber,
      msg: `Olá ${name}, Horario agendado do ${this.getId.name} para Data: ${date}, e Hora: ${time}`,
    };

    this.http
      .post(`http://localhost:8800/enviarMensagem`, requestData)
      .subscribe(
        (response: any) => {
          console.log('Resposta do backend (enviarMensagem):', response);
        },
        (error) => {
          console.error('Erro ao enviar mensagem:', error);
        }
      );
  }

  nextWeek() {
    if (this.currentWeekIndex < 20) {
      this.currentWeekIndex++;
      this.loadAppointments();
    }
  }

  previousWeek() {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.loadAppointments();
    }
  }
}
