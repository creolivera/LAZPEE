import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // BehaviorSubject holds the current value and emits it to new subscribers
  private searchTermSource = new BehaviorSubject<string>('');
  
  // Components will listen to this observable
  currentSearchTerm = this.searchTermSource.asObservable();

  constructor() {}

  // Function to update the search term
  updateSearchTerm(term: string) {
    this.searchTermSource.next(term.toLowerCase().trim());
  }
}