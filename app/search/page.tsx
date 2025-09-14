"use client"

import type React from "react"
import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect, type Option } from "@/components/ui/multi-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DocumentPreviewModal } from "@/components/document/document-preview-modal"
import { apiClient } from "@/lib/api"
import { downloadSingleFile, downloadMultipleFiles } from "@/lib/download-utils"
import { Search, Filter, Download, Eye, FileText, Calendar, Tag, User, Loader2, RefreshCw, Archive } from "lucide-react"

// Static data matching upload page
const personalNames = [
  { label: "John", value: "John" },
  { label: "Tom", value: "Tom" },
  { label: "Emily", value: "Emily" },
  { label: "Sarah", value: "Sarah" },
  { label: "Michael", value: "Michael" },
]

const departments = [
  { label: "HR", value: "HR" },
  { label: "IT", value: "IT" },
  { label: "Finance", value: "Finance" },
  { label: "Accounts", value: "Accounts" },
  { label: "Marketing", value: "Marketing" },
]

const availableTags: Option[] = [
  { label: "Important", value: "Important" },
  { label: "Urgent", value: "Urgent" },
  { label: "Draft", value: "Draft" },
  { label: "Final", value: "Final" },
  { label: "Review", value: "Review" },
]

interface Document {
  id: string
  file_name: string
  file_path: string
  major_head: string
  minor_head: string
  document_date: string
  document_remarks: string
  uploaded_by: string
  upload_date: string
  tags: { tag_name: string }[]
  file_size?: number
  file_type?: string
}

export default function SearchPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null)

  // Search filters
  const [searchTerm, setSearchTerm] = useState("")
  const [majorHead, setMajorHead] = useState("")
  const [minorHead, setMinorHead] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const searchDocuments = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const searchData = {
        major_head: majorHead || undefined,
        minor_head: minorHead || undefined,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        tags: selectedTags.length > 0 ? selectedTags.map((tag) => ({ tag_name: tag })) : undefined,
        start: (page - 1) * pageSize,
        length: pageSize,
        search: searchTerm ? { value: searchTerm } : undefined,
      }

      const result = await apiClient.searchDocuments(searchData)

      if (result.success && result.data) {
        setDocuments(result.data.data || [])
        setTotalRecords(result.data.recordsTotal || 0)
        setCurrentPage(page)
      } else {
        setError(result.error || "Failed to search documents")
        setDocuments([])
      }
    } catch (error) {
      setError("An error occurred while searching documents")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchDocuments(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setMajorHead("")
    setMinorHead("")
    setSelectedTags([])
    setFromDate("")
    setToDate("")
    setDocuments([])
    setSelectedDocuments([])
  }

  const handleMajorHeadChange = (value: string) => {
    setMajorHead(value)
    setMinorHead("") // Reset minor head when major head changes
  }

  const getMinorHeadOptions = () => {
    return majorHead === "Personal" ? personalNames : departments
  }

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const selectAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id))
    }
  }

  const handlePreview = (document: Document) => {
    setPreviewDocument(document)
    setIsPreviewOpen(true)
  }

  const handleDownload = async (document: Document) => {
    setDownloadLoading(document.id)

    const result = await downloadSingleFile({
      id: document.id,
      file_name: document.file_name,
      file_path: document.file_path,
      file_type: document.file_type,
    })

    if (!result.success) {
      setError(result.error || "Failed to download file")
    }

    setDownloadLoading(null)
  }

  const handleDownloadSelected = async () => {
    if (selectedDocuments.length === 0) return

    setLoading(true)

    const documentsToDownload = documents
      .filter((doc) => selectedDocuments.includes(doc.id))
      .map((doc) => ({
        id: doc.id,
        file_name: doc.file_name,
        file_path: doc.file_path,
        file_type: doc.file_type,
      }))

    const result = await downloadMultipleFiles(documentsToDownload)

    if (result.success) {
      setSelectedDocuments([])
    } else {
      setError(result.error || "Failed to download files")
    }

    setLoading(false)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const totalPages = Math.ceil(totalRecords / pageSize)

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Search Documents</h1>
              <p className="text-muted-foreground mt-2">
                Find and manage your documents with powerful search and filtering options.
              </p>
            </div>

            <div className="space-y-6">
              {/* Search Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Search Filters
                  </CardTitle>
                  <CardDescription>Use filters to narrow down your document search</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-4">
                    {/* Search Term */}
                    <div className="space-y-2">
                      <Label htmlFor="search-term" className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search Term
                      </Label>
                      <Input
                        id="search-term"
                        placeholder="Search in document names, remarks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Major Head */}
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={majorHead} onValueChange={handleMajorHeadChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="All categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            <SelectItem value="Personal">Personal</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Minor Head */}
                      <div className="space-y-2">
                        <Label>
                          {majorHead === "Personal"
                            ? "Name"
                            : majorHead === "Professional"
                              ? "Department"
                              : "Subcategory"}
                        </Label>
                        <Select value={minorHead} onValueChange={setMinorHead} disabled={!majorHead}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                majorHead === "Personal"
                                  ? "All names"
                                  : majorHead === "Professional"
                                    ? "All departments"
                                    : "Select category first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {majorHead === "Personal" ? "All names" : "All departments"}
                            </SelectItem>
                            {majorHead &&
                              getMinorHeadOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* From Date */}
                      <div className="space-y-2">
                        <Label htmlFor="from-date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          From Date
                        </Label>
                        <Input
                          id="from-date"
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </div>

                      {/* To Date */}
                      <div className="space-y-2">
                        <Label htmlFor="to-date" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          To Date
                        </Label>
                        <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </Label>
                      <MultiSelect
                        options={availableTags}
                        selected={selectedTags}
                        onChange={setSelectedTags}
                        placeholder="Select tags to filter..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={clearFilters}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Results */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Search Results
                      </CardTitle>
                      <CardDescription>
                        {totalRecords > 0
                          ? `Found ${totalRecords} document${totalRecords !== 1 ? "s" : ""}`
                          : "No documents found"}
                      </CardDescription>
                    </div>

                    {documents.length > 0 && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={selectAllDocuments}>
                          {selectedDocuments.length === documents.length ? "Deselect All" : "Select All"}
                        </Button>
                        {selectedDocuments.length > 0 && (
                          <Button size="sm" onClick={handleDownloadSelected} disabled={loading}>
                            {loading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Archive className="mr-2 h-4 w-4" />
                            )}
                            Download Selected ({selectedDocuments.length})
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No documents found</p>
                      <p className="text-sm">Try adjusting your search filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Documents List */}
                      {documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(document.id)}
                              onChange={() => toggleDocumentSelection(document.id)}
                              className="rounded border-border"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                <h3 className="font-medium text-foreground truncate">{document.file_name}</h3>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {document.uploaded_by}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(document.document_date)}
                                </span>
                                <span>
                                  {document.major_head} - {document.minor_head}
                                </span>
                                {document.file_size && <span>{formatFileSize(document.file_size)}</span>}
                              </div>

                              {document.tags && document.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {document.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag.tag_name}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {document.document_remarks && (
                                <p className="text-sm text-muted-foreground mt-2 truncate">
                                  {document.document_remarks}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreview(document)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(document)}
                              disabled={downloadLoading === document.id}
                            >
                              {downloadLoading === document.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                          <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * pageSize + 1} to{" "}
                            {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} results
                          </p>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => searchDocuments(currentPage - 1)}
                              disabled={currentPage === 1 || loading}
                            >
                              Previous
                            </Button>

                            <span className="text-sm text-muted-foreground">
                              Page {currentPage} of {totalPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => searchDocuments(currentPage + 1)}
                              disabled={currentPage === totalPages || loading}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setPreviewDocument(null)
        }}
        onDownload={handleDownload}
      />
    </ProtectedRoute>
  )
}
