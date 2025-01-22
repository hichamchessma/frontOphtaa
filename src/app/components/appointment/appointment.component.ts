import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
  displayedColumns: string[] = ['patientName', 'date', 'time', 'reason', 'status', 'actions'];
  dataSource: MatTableDataSource<Appointment>;
  selectedDate: Date = new Date();
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Appointment>();
  }

  ngOnInit() {
    this.loadAppointments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAppointments() {
    this.isLoading = true;
    this.appointmentService.getAllAppointments()
      .subscribe({
        next: (appointments) => {
          this.dataSource.data = appointments;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des rendez-vous', error);
          this.isLoading = false;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showTodayAppointments() {
    this.isLoading = true;
    this.appointmentService.getTodayAppointments()
      .subscribe({
        next: (appointments) => {
          this.dataSource.data = appointments;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des rendez-vous du jour', error);
          this.isLoading = false;
        }
      });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.selectedDate = event.value;
      this.isLoading = true;
      this.appointmentService.getAppointmentsByDate(this.selectedDate)
        .subscribe({
          next: (appointments) => {
            this.dataSource.data = appointments;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des rendez-vous par date', error);
            this.isLoading = false;
          }
        });
    }
  }

  editAppointment(appointment: Appointment) {
    // TODO: Implémenter la modification du rendez-vous avec un dialogue
  }

  deleteAppointment(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      this.appointmentService.deleteAppointment(id)
        .subscribe({
          next: () => {
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Erreur lors de la suppression du rendez-vous', error);
          }
        });
    }
  }
}
