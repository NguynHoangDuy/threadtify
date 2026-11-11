import { PostPartDto } from '../post-parts/dto/post-parts.dto.js';
import { PostDto } from '../posts/dto/post.dto.js';

interface ThreadsPost {
     pk: string;
     user?: {
          username?: string;
          profile_pic_url?: string;
     };
     caption?: {
          text?: string;
     };
     text_post_app_info?: {
          text_fragments?: {
               fragments?: Array<{
                    plaintext?: string;
               }>;
          };
     };
     image_versions2?: {
          candidates?: Array<{
               url?: string;
          }>;
     };
     url?: string;
}

interface ThreadsComment {
     text: string | null;
}

export function mapToPostDto(post: ThreadsPost, jobId: number): PostDto {
     const content = post.caption?.text ?? post.text_post_app_info?.text_fragments?.fragments?.map((fragment) => fragment.plaintext ?? '').join('') ?? '';

     return {
          threadId: post.pk,
          jobId,
          author: JSON.stringify({
               username: post.user?.username ?? '',
               profileUrl: post.user?.profile_pic_url ?? '',
          }),
          content,
          imageUrl: post.image_versions2?.candidates?.[0]?.url ?? '',
          postUrl: post.url ?? '',
     };
}

export function mapToPostPartDto(comment: ThreadsComment, postId: string): PostPartDto {
     return {
          postId,
          content: comment.text ?? '',
     };
}
