import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterViewInit {

  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  chatForm!: FormGroup;
  messages: { text: string, type: 'sent' | 'received' }[] = [
    { text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?", type: 'received' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
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
      
      // Simulating a received message (You can replace this with actual chatbot logic)
      setTimeout(() => {
        this.messages.push({ text: 'I got your message!', type: 'received' });
        setTimeout(() => {
          this.scrollToBottom();
        }, 0); 
      }, 1000);
    }
  }

}