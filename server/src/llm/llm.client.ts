import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PostPartDto } from '../post-parts/dto/post-parts.dto.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { LLMService } from './llm.service.js';
import { LLMStatus, LLMType } from '../common/constants/status.enum.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

@Injectable()
export class LLMClient {
    private readonly client: OpenAI;
    private readonly model: string;

    constructor(
        config: ConfigService,
        private readonly LLMService: LLMService,
    ) {
        this.client = new OpenAI({
            apiKey: config.getOrThrow<string>('LLM_API_KEY'),
            baseURL: config.getOrThrow<string>('LLM_BASE_URL'),
            maxRetries: 5, // tự thử lại khi 429 hoặc 5xx
            timeout: 120_000, // 2 phút
        });
        this.model = config.getOrThrow<string>('LLM_MODEL');
    }

    async filterStoryPart(post: { content: string }, comments: { id: string; content: string }[]): Promise<{ id: string; isRelevant: boolean }[]> {
        if (!comments.length) return [];

        const prompt = await readFile(join(__dirname, 'prompts', 'filter-story-comments.prompt.md'), 'utf-8');

        const commentsForPrompt = comments.map((c) => ({ id: c.id, content: c.content }));

        const finalPrompt = prompt.replace('{{POST}}', () => JSON.stringify(post)).replace('{{COMMENTS}}', () => JSON.stringify(commentsForPrompt));

        const llmRun = await this.LLMService.create({ prompt: finalPrompt, type: LLMType.FILTER_COMMENT });
        try {
            console.log('llm start');
            const start = Date.now();

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: finalPrompt }],
                response_format: { type: 'json_object' },
                temperature: 0,
            });

            console.log(`llm end: ${Date.now() - start}ms`, response.usage);

            const choice = response.choices[0];
            const text = choice?.message?.content;

            if (!text) {
                await this.LLMService.update(llmRun.id, { error: choice?.finish_reason, status: LLMStatus.FAILED });
                return [];
            }

            await this.LLMService.update(llmRun.id, { result: text, status: LLMStatus.SUCCESS });

            const { results } = JSON.parse(text) as {
                results: { id: string; isRelevant: boolean }[];
            };

            if (!Array.isArray(results)) {
                await this.LLMService.update(llmRun.id, { error: 'LLM error format, missing results', status: LLMStatus.FAILED });
                return [];
            }

            return results;
        } catch (error) {
            await this.LLMService.update(llmRun.id, { error: 'LLM error format, missing results', status: LLMStatus.FAILED });
            return [];
        }
    }

    async mergeStory(content: string): Promise<{ content: string; score: number } | null> {
        const prompt = await readFile(join(__dirname, 'prompts', 'merge-story.prompt.md'), 'utf-8');

        const finalPrompt = prompt.replace('{{CONTENT}}', () => content);

        const llmRun = await this.LLMService.create({ prompt: finalPrompt, type: LLMType.MERGE_STORY });
        try {
            console.log('llm merge start');
            const start = Date.now();

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: finalPrompt }],
                response_format: { type: 'json_object' },
                temperature: 0,
                max_tokens: 8000,
            });

            console.log(`llm merge end: ${Date.now() - start}ms`, response.usage);

            const choice = response.choices[0];
            const text = choice?.message?.content;

            console.log('text', text);

            if (!text) {
                await this.LLMService.update(llmRun.id, { error: `LLM empty, finish_reason=${choice?.finish_reason}`, status: LLMStatus.FAILED });
                return null;
            }

            const result = JSON.parse(text) as { content: string; score: number };

            if (typeof result?.content !== 'string' || typeof result?.score !== 'number') {
                await this.LLMService.update(llmRun.id, { result: text, error: 'LLM error format, missing content or score', status: LLMStatus.FAILED });
                return null;
            }

            await this.LLMService.update(llmRun.id, { result: text, status: LLMStatus.SUCCESS });

            return result;
        } catch (error: any) {
            await this.LLMService.update(llmRun.id, {
                error: String(error?.error?.failed_generation ?? error?.message ?? error),
                status: LLMStatus.FAILED,
            });
            return null;
        }
    }
}
