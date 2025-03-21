import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mercancia',
  templateUrl: './mercancia.component.html',
  styleUrl: './mercancia.component.css',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export default class MercanciaComponent {


}
