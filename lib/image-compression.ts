
/**
 * Compresses an image file using the Canvas API.
 * Resizes the image if it exceeds the maximum dimensions and reduces quality.
 * 
 * @param file The original image file
 * @param maxWidth Maximum width (default: 1920px)
 * @param maxHeight Maximum height (default: 1920px)
 * @param quality Image quality (0 to 1, default: 0.8)
 * @returns Promise resolving to the compressed File
 */
export async function compressImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8
): Promise<File> {
    return new Promise((resolve, reject) => {
        // If not an image, return original file
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        if (width > maxWidth) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Draw image
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not compress image'));
                            return;
                        }

                        // Create new file
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/webp', // Convert to WebP for better compression
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}
