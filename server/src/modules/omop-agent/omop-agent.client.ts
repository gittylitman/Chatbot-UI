// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// @Injectable()
// export class ChatClientService {
//     private readonly baseUrl = 'http://your-api-host.com'; // change to real API base URL

//     constructor(private readonly http: HttpService) { }

//     async createSession(userId: string): Promise<any> {
//         const url = `${this.baseUrl}/chat/session/${userId}`;

//         try {
//             const response = await firstValueFrom(
//                 this.http.post(url)
//             );

//             return response.data;
//         } catch (error) {
//             console.error('Failed to create chat session', error);
//             throw error;
//         }
//     }
// }
