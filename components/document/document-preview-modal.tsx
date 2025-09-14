"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, FileText, ImageIcon, AlertTriangle, Calendar, User, Tag } from "lucide-react"

interface Document {
  id: string
  file_name: string
  file_path: string
  file_type?: string
  major_head: string
  minor_head: string
  document_date: string
  document_remarks: string
  uploaded_by: string
  upload_date: string
  tags: { tag_name: string }[]
  file_size?: number
}

interface DocumentPreviewModalProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
  onDownload: (document: Document) => void
}

export function DocumentPreviewModal({ document, isOpen, onClose, onDownload }: DocumentPreviewModalProps) {
  const [previewError, setPreviewError] = useState(false)

  if (!document) return null

  const isImage = document.file_type?.startsWith("image/") || document.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  const isPDF = document.file_type === "application/pdf" || document.file_name.endsWith(".pdf")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const renderPreview = () => {
    if (previewError) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to preview this file. You can still download it to view the content.
          </AlertDescription>
        </Alert>
      )
    }

    if (isImage) {
      return (
        <div className="flex justify-center bg-muted/20 rounded-lg p-4">
          <ImageIcon
            src={document.file_path || "/placeholder.svg"}
            alt={document.file_name}
            className="max-w-full max-h-96 object-contain rounded"
            onError={() => setPreviewError(true)}
          />
        </div>
      )
    }

    if (isPDF) {
      return (
        <div className="bg-muted/20 rounded-lg p-4">
          <iframe
            src={`${document.file_path}#toolbar=0`}
            className="w-full h-96 rounded"
            title={document.file_name}
            onError={() => setPreviewError(true)}
          />
        </div>
      )
    }

    return (
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>Preview not available for this file type. Click download to view the file.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                {document.file_name}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {document.major_head} - {document.minor_head}
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onDownload(document)} className="ml-4">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Document Date:</span>
                <span>{formatDate(document.document_date)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Uploaded by:</span>
                <span>{document.uploaded_by}</span>
              </div>

              {document.file_size && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">File Size:</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Upload Date:</span>
                <span>{formatDate(document.upload_date)}</span>
              </div>

              {document.tags && document.tags.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Remarks */}
          {document.document_remarks && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Remarks</h4>
              <p className="text-sm text-muted-foreground">{document.document_remarks}</p>
            </div>
          )}

          {/* File Preview */}
          <div className="space-y-2">
            <h4 className="font-medium">File Preview</h4>
            {renderPreview()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
