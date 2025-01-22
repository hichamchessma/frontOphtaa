import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface Appointment {
  id: number;
  patientName: string;
  date: Date;
  time: string;
  reason: string;
  status: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  displayedColumns: string[] = ['patientName', 'date', 'time', 'reason', 'status', 'actions'];
  dataSource: MatTableDataSource<Appointment>;
  selectedDate: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Exemple de données (à remplacer par les vraies données de l'API)
  appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'John Doe',
      date: new Date(),
      time: '09:00',
      reason: 'Consultation',
      status: 'Confirmé'
    },
    // Ajoutez plus de données ici
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.appointments);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showTodayAppointments() {
    const today = new Date();
    this.dataSource.filter = today.toDateString();
    this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
      return data.date.toDateString() === filter;
    };
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.selectedDate = event.value;
      this.dataSource.filter = this.selectedDate.toDateString();
      this.dataSource.filterPredicate = (data: Appointment, filter: string) => {
        return data.date.toDateString() === filter;
      };
    }
  }
}
