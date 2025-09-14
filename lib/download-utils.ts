// Utility functions for file downloads and bulk operations

export interface DownloadableDocument {
  id: string
  file_name: string
  file_path: string
  file_type?: string
}

export const downloadSingleFile = async (document: DownloadableDocument) => {
  try {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate the download
    const response = await fetch(document.file_path)

    if (!response.ok) {
      throw new Error("Failed to download file")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = document.file_name
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    console.error("Download failed:", error)
    return { success: false, error: "Failed to download file" }
  }
}

export const downloadMultipleFiles = async (documents: DownloadableDocument[]) => {
  try {
    // In a real implementation, this would call a backend API that creates a ZIP file
    // For now, we'll download files individually
    const results = await Promise.allSettled(documents.map((doc) => downloadSingleFile(doc)))

    const successful = results.filter((result) => result.status === "fulfilled" && result.value.success).length

    const failed = results.length - successful

    return {
      success: true,
      message: `Downloaded ${successful} files${failed > 0 ? `, ${failed} failed` : ""}`,
    }
  } catch (error) {
    console.error("Bulk download failed:", error)
    return { success: false, error: "Failed to download files" }
  }
}

export const getFileIcon = (fileName: string, fileType?: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  const type = fileType?.toLowerCase()

  if (type?.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
    return "image"
  }

  if (type === "application/pdf" || extension === "pdf") {
    return "pdf"
  }

  return "file"
}

export const isPreviewable = (fileName: string, fileType?: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  const type = fileType?.toLowerCase()

  // Images and PDFs are previewable
  return (
    type?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "") ||
    type === "application/pdf" ||
    extension === "pdf"
  )
}
