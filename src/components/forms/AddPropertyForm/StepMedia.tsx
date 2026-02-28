import { useState, useRef, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Video, FileText, Upload, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { uploadFile, BUCKETS, deleteFile, getStoragePath } from '@/lib/storage'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface StepMediaProps {
  data: any
  updateData: (newData: any) => void
}

interface UploadStatus {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
}

export default function StepMedia({ data, updateData }: StepMediaProps) {
  const [uploads, setUploads] = useState<Record<string, UploadStatus>>({})
  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const { userId } = useAuth()

  const handleUpload = async (files: File[], bucket: string, type: 'image' | 'video' | 'document') => {
    console.log(`[StepMedia] handleUpload initiated for ${files.length} files. Bucket: ${bucket}, Type: ${type}`);
    if (!userId) {
      console.error('[StepMedia] handleUpload failed: User is not logged in.');
      toast.error('You must be logged in to upload files')
      return
    }

    for (const file of files) {
      const id = Math.random().toString(36).substring(7)
      console.log(`[StepMedia] Processing file: ${file.name} (Size: ${file.size}, ID: ${id})`);
      setUploads(prev => ({
        ...prev,
        [id]: { id, file, progress: 10, status: 'uploading' }
      }))

      try {
        console.log(`[StepMedia] Calling uploadFile for ${file.name}...`);
        // RLS policy requires path to start with userId: auth.uid()::text = (storage.foldername(name))[1]
        const result = await uploadFile(bucket, file, `${userId}/listings`)
        console.log(`[StepMedia] uploadFile result for ${file.name}:`, result);
        
        if (result.error) {
           console.error(`[StepMedia] uploadFile returned an error object for ${file.name}:`, result.error);
           throw new Error(result.error);
        }

        console.log(`[StepMedia] Upload successful for ${file.name}. URL: ${result.url}`);
        setUploads(prev => ({
          ...prev,
          [id]: { ...prev[id], status: 'completed', progress: 100, url: result.url }
        }))

        if (type === 'image' || type === 'video') {
          const currentMedia = data.media || []
          const isFirstImage = type === 'image' && currentMedia.filter((m: any) => m.type === 'image').length === 0
          
          updateData({ 
            media: [...currentMedia, { url: result.url, type, order: currentMedia.length, is_cover: isFirstImage }],
            ...(isFirstImage ? { cover_image_url: result.url } : {})
          })
          console.log(`[StepMedia] State updated with new media item.`);
        } else {
          const currentDocs = data.documents || []
          updateData({ 
            documents: [...currentDocs, { url: result.url, name: file.name, size: file.size }] 
          })
          console.log(`[StepMedia] State updated with new document.`);
        }
      } catch (err: any) {
        console.error(`[StepMedia] Caught exception during upload of ${file.name}:`, err);
        setUploads(prev => ({
          ...prev,
          [id]: { ...prev[id], status: 'error' }
        }))
        toast.error(`Failed to upload ${file.name}: ${err.message}`)
      }
    }
  }

  const removeMedia = async (url: string, type: 'media' | 'document') => {
    const path = getStoragePath(url)
    const bucket = type === 'media' ? BUCKETS.PROPERTY_MEDIA : BUCKETS.DOCUMENTS
    
    const success = await deleteFile(bucket, path)
    if (success) {
      if (type === 'media') {
        updateData({ media: data.media.filter((m: any) => m.url !== url) })
      } else {
        updateData({ documents: data.documents.filter((d: any) => d.url !== url) })
      }
      toast.success('File removed')
    } else {
      toast.error('Failed to remove file from storage')
    }
  }

  // Expose upload status to parent component using a callback or just store
  // To avoid prop drilling, we can check if there are any uploading files locally
  const hasActiveUploads = Object.values(uploads).some(u => u.status === 'uploading')

  // We need to inform the parent if uploads are active to disable the next button
  // A cleaner way is just updating the form data with a transient `_hasActiveUploads` flag
  useEffect(() => {
    updateData({ _hasActiveUploads: hasActiveUploads })
  }, [hasActiveUploads])

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* ── Asset Photography ────────────────────────────────── */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest">Asset Photography</Label>
                <span className="text-[10px] font-bold text-muted-foreground italic">
                  {data.media?.filter((m: any) => m.type === 'image').length || 0} / 50 Uploaded
                </span>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {data.media?.filter((m: any) => m.type === 'image').map((m: any, i: number) => (
                    <motion.div 
                      key={m.url}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="aspect-square rounded-2xl overflow-hidden relative group border-2 border-secondary"
                    >
                      <img src={m.url} alt="Property" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeMedia(m.url, 'media')}
                      title="Remove image"
                      className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-md">
                          Cover Image
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-square rounded-2xl border-2 border-dashed border-secondary/50 flex flex-col items-center justify-center gap-3 bg-secondary/5 hover:bg-secondary/10 hover:border-primary/30 transition-all cursor-pointer group"
                >
                   <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={18} />
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Add Archive</span>
                     <input 
                       type="file" 
                       title="Upload Property Images"
                       className="hidden" 
                       multiple 
                       accept="image/*" 
                       ref={imageInputRef}
                       onChange={(e) => handleUpload(Array.from(e.target.files || []), BUCKETS.PROPERTY_MEDIA, 'image')}
                     />
                </div>
             </div>
          </div>

          {/* ── Technical & Video ────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest">Technical Documents</Label>
                <div className="space-y-3">
                   {data.documents?.map((doc: any) => (
                     <div key={doc.url} className="flex items-center justify-between p-3 bg-secondary/10 rounded-xl border border-secondary">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <FileText size={16} className="text-primary shrink-0" />
                           <span className="text-[10px] font-bold truncate">{doc.name}</span>
                        </div>
                        <button 
                          onClick={() => removeMedia(doc.url, 'document')} 
                          title="Remove document"
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                           <X size={14} />
                        </button>
                     </div>
                   ))}
                   <div 
                     onClick={() => docInputRef.current?.click()}
                     className="h-24 rounded-2xl border-2 border-dashed border-secondary/50 flex flex-col items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer"
                   >
                      <FileText size={20} className="text-muted-foreground" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Upload PDF Pack</span>
                      <input 
                        type="file" 
                        title="Upload PDF Document"
                        className="hidden" 
                        accept=".pdf" 
                        ref={docInputRef}
                        onChange={(e) => handleUpload(Array.from(e.target.files || []), BUCKETS.DOCUMENTS, 'document')}
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest">Cinematic Video</Label>
                {data.media?.some((m: any) => m.type === 'video') ? (
                  <div className="aspect-video rounded-2xl overflow-hidden relative group border-2 border-secondary bg-black">
                     <video src={data.media.find((m: any) => m.type === 'video').url} className="w-full h-full object-cover opacity-60" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Video size={30} className="text-white opacity-40" />
                     </div>
                     <button 
                       onClick={() => removeMedia(data.media.find((m: any) => m.type === 'video').url, 'media')}
                       title="Remove video"
                       className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <X size={16} />
                     </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="h-24 rounded-2xl border-2 border-dashed border-secondary/50 flex flex-col items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer"
                  >
                     <Video size={20} className="text-muted-foreground" />
                     <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Upload MP4 Stream</span>
                     <input 
                       type="file" 
                       title="Upload Property Video"
                       className="hidden" 
                       accept="video/*" 
                       ref={videoInputRef}
                       onChange={(e) => handleUpload(Array.from(e.target.files || []), BUCKETS.PROPERTY_MEDIA, 'video')}
                     />
                  </div>
                )}
             </div>
          </div>

          {/* ── Active Uploads Progress ───────────────────────────── */}
          <AnimatePresence>
            {Object.values(uploads).filter(u => u.status === 'uploading').length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Loader2 size={16} className="text-primary animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Synchronizing Media Repository</span>
                   </div>
                </div>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                   {Object.values(uploads).filter(u => u.status === 'uploading' || u.status === 'error').map((u) => (
                     <div key={u.id} className="space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-tight">
                           <span className="truncate max-w-[200px]">{u.file.name}</span>
                           <span className={cn(u.status === 'error' ? "text-red-500" : "text-primary")}>
                              {u.status === 'error' ? 'Transmission Failed' : `${u.progress}%`}
                           </span>
                        </div>
                        {u.status === 'error' ? (
                           <div className="h-1 bg-red-500/20 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 w-full" />
                           </div>
                        ) : (
                           <Progress value={u.progress} className="h-1" />
                        )}
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Upload Protocols ────────────────────────────────────── */}
        <div className="space-y-6">
           <div className="p-8 bg-secondary/10 rounded-[2.5rem] border-2 border-secondary/50 space-y-8 sticky top-6">
              <div className="space-y-1">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Upload Protocols</h4>
                 <p className="text-[9px] font-medium text-muted-foreground italic">BlueOak indexing standards for digital assets.</p>
              </div>

              <ul className="space-y-5">
                 {[
                   { icon: ImageIcon, text: "High-res JPEG/WebP", status: "Validated" },
                   { icon: Video, text: "Max 200MB / 60s", status: "4K Support" },
                   { icon: FileText, text: "Compliance PDF", status: "Secure" }
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm border border-secondary/50">
                         <item.icon size={16} className="text-primary" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[10px] font-black uppercase tracking-tight text-foreground">{item.text}</p>
                         <p className="text-[8px] font-bold text-primary/60 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 size={8} />
                            {item.status}
                         </p>
                      </div>
                   </li>
                 ))}
              </ul>
              
              <div className="pt-4 space-y-4">
                 <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3">
                    <AlertCircle size={14} className="text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-[8px] font-bold text-orange-700/70 leading-relaxed uppercase tracking-tight italic">
                       Professional photography increases lead conversion by 40%.
                    </p>
                 </div>
                 <Button variant="outline" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest border-2 h-14 bg-background hover:bg-secondary/10">
                   VIRTUAL TOUR LINK
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
