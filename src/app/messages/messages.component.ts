import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  chatForm!: FormGroup;
  messages: { text: string, type: 'sent' | 'received' }[] = [
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", type: 'received' }
  ];

  messageSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the message subscription to avoid memory leaks
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const messageText = this.chatForm.get('message')?.value;
      this.messages.push({ text: messageText, type: 'sent' });
      this.chatForm.reset();
      
      // Send message to Flask backend
      this.http.post<any>('http://127.0.0.1:5000/process_message', { message: messageText }).subscribe(
        () => {
          // Fetch messages after sending the message
          this.fetchMessages();
        },
        (error) => {
          console.error('Error occurred while sending message:', error);
        }
      );
    }
  }

  fetchMessages(): void {
    // Fetch messages from the backend
    this.http.get<any>('http://127.0.0.1:5000/fetch_processed_messages').subscribe(
      (response) => {
        // Handle the response from the Flask backend
        const receivedMessages = response.processed_messages; // Access 'processed_messages' key
        this.messages.push({ text: receivedMessages, type: 'received' });
        
        setTimeout(() => {
          this.scrollToBottom();
        }, 0); 
      },
      (error) => {
        console.error('Error occurred while fetching messages:', error);
      }
    );
  }
}

