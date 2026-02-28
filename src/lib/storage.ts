import { supabase } from './supabase'

export const BUCKETS = {
  PROPERTY_MEDIA: 'property-media',
  AVATARS:        'avatars',
  DOCUMENTS:      'documents',
  MESSAGES:       'message-attachments',
} as const

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadFile(
  bucket: string,
  file: File,
  folder: string
): Promise<{ path: string; url: string; error?: string }> {
  try {
    const ext  = file.name.split('.').pop() ?? 'bin'
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7)
    const path = `${folder}/${uniqueId}.${ext}`

    // 30 second timeout to prevent infinite hang
    const uploadPromise = supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
      setTimeout(() => reject(new Error('Upload timed out after 30 seconds')), 30000)
    )

    const { error } = await Promise.race([uploadPromise, timeoutPromise])

    if (error) {
       console.error(`[Storage] Upload failed for ${file.name}:`, error)
       return { path: '', url: '', error: error.message || 'Unknown upload error' }
    }
    
    return { path, url: getPublicUrl(bucket, path) }
  } catch (err: any) {
    console.error(`[Storage] Exception during upload for ${file.name}:`, err)
    return { path: '', url: '', error: err.message || 'Upload exception occurred' }
  }
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  return !error
}

export function getStoragePath(url: string): string {
  // Extract path from full Supabase storage URL
  const parts = url.split('/storage/v1/object/public/')
  if (parts.length < 2) return ''
  const withoutBucket = parts[1]?.split('/').slice(1).join('/')
  return withoutBucket ?? ''
}
