import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  openModal() {
    // Lógica para abrir el modal
    const modal = document.getElementById('deployModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeModal() {
    // Lógica para abrir el modal
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
}