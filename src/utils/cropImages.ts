/**
 * Fallback images for crops.
 * Used only when a crop doesn't have an admin-uploaded image_url.
 */

import cropFallback from '@/assets/images/crop-fallback.jpg'
import heroField from '@/assets/images/hero-field.jpg'

/** Generic crop fallback — green rice field */
const DEFAULT_CROP_IMAGE = cropFallback

/**
 * Get the image URL for a crop.
 * Priority: crop.image_url (admin-uploaded) → generic fallback.
 */
export function getCropImage(imageUrl: string | null | undefined): string {
    return imageUrl || DEFAULT_CROP_IMAGE
}

/** Hero background image for the home page — green field at golden hour */
export const HERO_IMAGE = heroField
