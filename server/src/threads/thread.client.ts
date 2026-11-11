import axios, { AxiosInstance } from 'axios';
import { PostDto } from '../posts/dto/post.dto.js';
import { mapToPostDto, mapToPostPartDto } from './thread.mapper.js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostPartDto } from '../post-parts/dto/post-parts.dto.js';
import { Scavio } from 'scavio';

@Injectable()
export class ThreadsClient {
     private readonly http: AxiosInstance;
     private readonly scavio: any;

     constructor(config: ConfigService) {
          this.http = axios.create({
               baseURL: 'https://api.scrapecreators.com/v1/threads',
               headers: { 'x-api-key': config.getOrThrow<string>('SCRAPECREATORS_API_KEY') },
               timeout: 30_000,
          });

          this.scavio = new Scavio({ apiKey: config.getOrThrow<string>('SCAVIO_API_KEY') });
     }

     async searchPostByKeyword(keyword: string, jobId: number): Promise<PostDto[]> {
          try {
               const response = await this.http.get('/search', { params: { query: keyword } });
               const data = response.data;

               if (!data || data.success !== true || Array.isArray(data.posts) === false) {
                    console.error('Invalid data format:', data);
                    return [];
               }

               const postDtos = data.posts.map((post: any) => mapToPostDto(post, jobId));
               return postDtos;
          } catch (error) {
               console.log('error', error);
               throw error;
          }
     }

     async searchPostInfo(threadId: string, postId: string): Promise<PostPartDto[]> {
          const MAX_PAGES = 5;
          const allComments: any[] = [];
          let cursor: string | null = null;
          let page = 0;

          try {
               do {
                    const results: {
                         data?: {
                              comments?: any[];
                              next_cursor?: string | null;
                         };
                    } = await this.scavio.threads.postComments({
                         post_id: threadId,
                         ...(cursor ? { cursor } : {}),
                    });

                    const comments = results?.data?.comments;
                    if (!Array.isArray(comments)) {
                         console.error('Invalid comments data:', results);
                         break;
                    }

                    allComments.push(...comments);

                    const nextCursor: string | null = results?.data?.next_cursor ?? null;

                    if (!nextCursor || nextCursor === cursor) {
                         break;
                    }

                    cursor = nextCursor;
                    page++;
               } while (page < MAX_PAGES);

               return allComments.map((comment) => mapToPostPartDto(comment, postId));
          } catch (error) {
               console.log('error', error);
               throw error;
          }
     }
}
