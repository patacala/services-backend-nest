# Cloudflare Images Service (V1)

Location: `src/shared/cloudflare/images/cloudflare-images.service.ts`

Implements basic operations for Cloudflare Images API v1:

- Upload image
- Update image (metadata, requireSignedURLs)
- Get image details
- List images
- Delete image

## Environment variables

Set the following variables (e.g. in your `.env`):

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The service throws an error at construction time if these variables are missing.

## Usage in NestJS

1. The service is registered in `SharedModule` and exported, so you can inject it anywhere:

```ts
import { CloudflareImagesService } from 'src/shared/cloudflare/images';

@Injectable()
export class MyService {
  constructor(private readonly cfImages: CloudflareImagesService) {}

  async upload(buffer: Buffer) {
    return this.cfImages.uploadImage(buffer, 'photo.jpg', {
      metadata: { source: 'profile' },
      requireSignedURLs: false,
    });
  }
}
```

2. Methods:

```ts
// Upload
cfImages.uploadImage(fileOrBuffer, 'name.jpg', { id?, metadata?, requireSignedURLs? })

// Update
cfImages.updateImage(imageId, { metadata?, requireSignedURLs? })

// Details
cfImages.getImageDetails(imageId)

// List
cfImages.listImages({ page?, per_page?, order?, direction? })

// Delete
cfImages.deleteImage(imageId)
```

## Notes

- Uses native `fetch`/`FormData` available in Node 18+.
- Errors from Cloudflare API are parsed and thrown with details from the `errors` and `messages` arrays when available.
