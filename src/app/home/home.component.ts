import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  names: string[] = ['home', 'messages', 'help'];
  filteredNames: string[] = [];

  constructor(private router: Router) {
    this.filteredNames = this.names;
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredNames = this.names;
      return;
    }

    this.filteredNames = this.names.filter(
      name => name.toLowerCase().startsWith(text.toLowerCase())
    );
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}




