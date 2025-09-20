import { Injectable } from '@nestjs/common';

/**
 * Cloudflare Images Service (V1)
 * Docs: https://developers.cloudflare.com/api/resources/images/subresources/v1/
 */
@Injectable()
export class CloudflareImagesService {
  private readonly baseUrl: string;
  private readonly accountId: string;
  private readonly apiToken: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';

    if (!this.accountId || !this.apiToken) {
      throw new Error(
        'CloudflareImagesService: Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in environment',
      );
    }

    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`;
  }

  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.apiToken}`,
    } as Record<string, string>;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const text = await res.text();
    const data = text ? (JSON.parse(text) as any) : {};

    // Cloudflare API envelope
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

      throw new Error(`Cloudflare Images API error: ${errorMsg || text}`);
    }

    return (data?.result ?? data) as T;
  }

  /**
   * Upload an image
   * @param file - The image content (Buffer | Blob | File)
   * @param filename - Original filename (used for content disposition)
   * @param options - Additional options like id, requireSignedURLs, metadata
   */
  async uploadImage(
    file: Blob | Buffer,
    filename: string,
    options?: {
      id?: string; // Custom image ID
      requireSignedURLs?: boolean;
      metadata?: Record<string, any>;
    },
  ): Promise<any> {
    const form = new FormData();

    // Convert Buffer to Blob if needed
    const blob =
      typeof Blob !== 'undefined' && file instanceof Blob
        ? file
        : new Blob([file as Buffer]);

    form.append('file', blob, filename);

    if (options?.id) form.append('id', options.id);
    if (typeof options?.requireSignedURLs === 'boolean')
      form.append('requireSignedURLs', String(options.requireSignedURLs));
    if (options?.metadata)
      form.append('metadata', JSON.stringify(options.metadata));

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        // form headers are auto-included by fetch for FormData
      },
      body: form as any,
    });

    return this.handleResponse(res);
  }

  /**
   * Delete an image by ID
   */
  async deleteImage(imageId: string): Promise<{ id: string } & Record<string, any>> {
    const url = `${this.baseUrl}/${encodeURIComponent(imageId)}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    return this.handleResponse(res);
  }

  /**
   * Update an image by ID
   * Cloudflare allows updating metadata and requireSignedURLs
   */
  async updateImage(
    imageId: string,
    payload: {
      metadata?: Record<string, any>;
      requireSignedURLs?: boolean;
    },
  ): Promise<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(imageId)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload ?? {}),
    });

    return this.handleResponse(res);
  }

  /**
   * Get image details by ID
   */
  async getImageDetails(imageId: string): Promise<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(imageId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    return this.handleResponse(res);
  }

  /**
   * List images with pagination and filters
   * @param params - page, per_page, order, direction
   */
  async listImages(params?: {
    page?: number;
    per_page?: number;
    order?: 'created' | 'uploaded' | 'id';
    direction?: 'asc' | 'desc';
  }): Promise<any> {
    const url = new URL(this.baseUrl);
    if (params?.page) url.searchParams.set('page', String(params.page));
    if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.direction) url.searchParams.set('direction', params.direction);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
      },
    });

    return this.handleResponse(res);
  }
}
