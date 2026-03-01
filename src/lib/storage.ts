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
    console.log(`[Storage] Starting upload flow for ${file.name} to bucket ${bucket}...`)
    const ext  = file.name.split('.').pop() ?? 'bin'
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7)
    const path = `${folder}/${uniqueId}.${ext}`

    console.log(`[Storage] Target path: ${path}. Initiating supabase.storage.upload...`)
    
    // 30 second timeout to prevent infinite hang
    const uploadPromise = supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    const timeoutPromise = new Promise<{ data: any, error: any }>((_, reject) => 
      setTimeout(() => {
        console.warn(`[Storage] Upload timeout triggered for ${file.name}`)
        reject(new Error('Upload timed out after 30 seconds'))
      }, 30000)
    )

    console.log(`[Storage] Racing upload vs timeout for ${file.name}...`)
    const raceResult = await Promise.race([uploadPromise, timeoutPromise]) as any
    const { error } = raceResult || {}

    if (error) {
       console.error(`[Storage] Upload error returned for ${file.name}:`, error)
       return { path: '', url: '', error: error.message || 'Unknown upload error' }
    }
    
    console.log(`[Storage] Upload succeeded for ${file.name}. Generating public URL...`)
    return { path, url: getPublicUrl(bucket, path) }
  } catch (err: any) {
    console.error(`[Storage] Exception caught during upload for ${file.name}:`, err)
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
