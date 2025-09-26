import { Injectable } from '@nestjs/common';

/**
 * Cloudflare Stream Service
 * Docs: https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/
 * API: POST /accounts/:account_id/stream/direct_upload
 */
@Injectable()
export class CloudflareStreamService {
  private readonly accountId: string;
  private readonly apiToken: string;
  private readonly baseUrl: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN || '';

    if (!this.accountId || !this.apiToken) {
      throw new Error(
        'CloudflareStreamService: Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_STREAM_API_TOKEN in environment',
      );
    }

    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    } as Record<string, string>;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    const data = text ? (JSON.parse(text) as any) : {};

    if (!res.ok || data?.success === false) {
      const errors = data?.errors || [];
      const messages = data?.messages || [];
      const errorMsg = [
        `HTTP ${res.status} ${res.statusText}`,
        ...errors.map((e: any) => `${e?.code ?? ''} ${e?.message ?? ''}`.trim()),
        ...messages.map((m: any) => (typeof m === 'string' ? m : m?.message)).filter(Boolean),
      ]
        .filter(Boolean)
        .join(' | ');

      throw new Error(`Cloudflare Stream API error: ${errorMsg || text}`);
    }

    return (data?.result ?? data) as T;
  }

  /**
   * Create a direct upload URL for the client to upload a video directly to Cloudflare Stream
   * Returns an object containing the uploadURL and video UID among other fields.
   */
  async createDirectUploadUrl(payload?: {
    maxDurationSeconds?: number;
    creator?: string;
    allowedOrigins?: string[];
    requireSignedURLs?: boolean;
    thumbnailTimestampPct?: number;
    watermark?: { uid: string } | null;
    meta?: Record<string, any>;
  }): Promise<{
    uploadURL: string;
    uid: string;
    // include passthrough result for flexibility
    [key: string]: any;
  }> {
    const url = `${this.baseUrl}/direct_upload`;
    payload.maxDurationSeconds = 30;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload ?? {}),
    });

    return this.handleResponse(res);
  }
}
