

import { Component, Input } from "@angular/core";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-evr-form',
  templateUrl: './evr-form.component.html',
  styleUrls: ['./evr-form.component.scss']
})
export class EvrFormComponent {

  @Input() label: string
  @Input() state: FormControl

  constructor(
  ) { }

  isStateNotValid(): boolean {
    if (!this.state || !this.state.errors) {
      return false
    }
    return this.label && this.state && !this.state.valid
  }
}

