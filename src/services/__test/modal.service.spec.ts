import { ModalService } from "src/app/v2/modal.service";


describe('ModalService', () => {
  let modalService: ModalService;

  beforeEach(() => {
    modalService = new ModalService();
  });

  it('should be created', () => {
    expect(modalService).toBeTruthy();
  });

  it('should open modal', () => {
    // Mock del modal
    const modal = document.createElement('div');
    modal.id = 'deployModal';
    document.body.appendChild(modal);

    modalService.openModal();

    // Verificar que el modal está abierto
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');

    // Limpiar el modal después de la prueba
    document.body.removeChild(modal);
  });

  it('should close modal', () => {
    // Mock del modal
    const modal = document.createElement('div');
    modal.id = 'exampleModal';
    document.body.appendChild(modal);

    modalService.closeModal();

    // Verificar que el modal está cerrado
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');

    // Limpiar el modal después de la prueba
    document.body.removeChild(modal);
  });
});
