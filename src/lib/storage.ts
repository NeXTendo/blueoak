import { supabase } from './supabase'
import { nanoid } from 'nanoid'

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
  const ext  = file.name.split('.').pop() ?? 'bin'
  const path = `${folder}/${nanoid()}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return { path: '', url: '', error: error.message }
  return { path, url: getPublicUrl(bucket, path) }
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
