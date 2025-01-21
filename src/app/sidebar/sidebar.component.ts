import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isOpen: boolean = false;
  mouseInTriggerZone: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Zone de déclenchement de 50px depuis le bord gauche
    const triggerZone = 50;
    
    if (event.clientX <= triggerZone) {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    } else if (event.clientX > 250 && this.isOpen) { // 250px est la largeur du sidebar
      this.isOpen = false;
    }
  }
}
