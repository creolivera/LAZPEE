import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html'
})
export class MessagesComponent implements OnInit {
  currentUserEmail = localStorage.getItem('email') || '';
  contacts: string[] = [];
  activeContact: string = '';
  chatMessages: any[] = [];
  newMessageText: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.currentUserEmail) {
      alert('Please log in to use the messaging system!');
      return;
    }
    this.loadConversations();
  }

  loadConversations() {
    this.http.get<string[]>(`http://localhost:5000/api/messages/conversations/${this.currentUserEmail}`)
      .subscribe(data => {
        this.contacts = data;

        // Check if query params passed a targeted user to text immediately (e.g. from store page)
        this.route.queryParams.subscribe(params => {
          const targetUser = params['to'];
          if (targetUser && targetUser !== this.currentUserEmail) {
            this.activeContact = targetUser;
            if (!this.contacts.includes(targetUser)) {
              this.contacts.unshift(targetUser);
            }
            this.loadChatHistory();
          } else if (this.contacts.length > 0) {
            this.selectContact(this.contacts[0]);
          }
        });
      });
  }

  selectContact(contactEmail: string) {
    this.activeContact = contactEmail;
    this.loadChatHistory();
  }

  loadChatHistory() {
    if (!this.activeContact) return;
    this.http.get<any[]>(`http://localhost:5000/api/messages/thread/${this.currentUserEmail}/${this.activeContact}`)
      .subscribe(data => {
        this.chatMessages = data;
      });
  }

  sendMessage() {
    if (!this.newMessageText.trim() || !this.activeContact) return;

    const payload = {
      senderEmail: this.currentUserEmail,
      receiverEmail: this.activeContact,
      messageText: this.newMessageText.trim()
    };

    this.http.post('http://localhost:5000/api/messages/send', payload).subscribe((msg: any) => {
      this.chatMessages.push(msg);
      this.newMessageText = '';
      
      // Bring contact to top of sidebar if not already there
      this.contacts = [this.activeContact, ...this.contacts.filter(c => c !== this.activeContact)];
    });
  }
}