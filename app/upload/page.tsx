"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect, type Option } from "@/components/ui/multi-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { Upload, FileText, Calendar, Tag, MessageSquare, Loader2, CheckCircle, X } from "lucide-react"

// Static data as per requirements
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

export default function UploadPage() {
  const { userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentDate, setDocumentDate] = useState("")
  const [majorHead, setMajorHead] = useState("")
  const [minorHead, setMinorHead] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [remarks, setRemarks] = useState("")
  const [availableTags, setAvailableTags] = useState<Option[]>([
    { label: "Important", value: "Important" },
    { label: "Urgent", value: "Urgent" },
    { label: "Draft", value: "Draft" },
    { label: "Final", value: "Final" },
    { label: "Review", value: "Review" },
  ])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF, JPG, and PNG files are allowed")
        return
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setSelectedFile(file)
      setError("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
  })

  const handleMajorHeadChange = (value: string) => {
    setMajorHead(value)
    setMinorHead("") // Reset minor head when major head changes
  }

  const getMinorHeadOptions = () => {
    return majorHead === "Personal" ? personalNames : departments
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !documentDate || !majorHead || !minorHead || !userId) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const documentData = {
        major_head: majorHead,
        minor_head: minorHead,
        document_date: documentDate,
        document_remarks: remarks,
        tags: selectedTags.map((tag) => ({ tag_name: tag })),
        user_id: userId,
      }

      const result = await apiClient.uploadDocument(selectedFile, documentData)

      if (result.success) {
        setSuccess("Document uploaded successfully!")
        // Reset form
        setSelectedFile(null)
        setDocumentDate("")
        setMajorHead("")
        setMinorHead("")
        setSelectedTags([])
        setRemarks("")
      } else {
        setError(result.error || "Failed to upload document")
      }
    } catch (error) {
      setError("An error occurred while uploading the document")
    } finally {
      setLoading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Upload Document</h1>
              <p className="text-muted-foreground mt-2">
                Add new documents to the management system with proper categorization and tags.
              </p>
            </div>

            <div className="max-w-4xl">
              {/* Alerts */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      File Upload
                    </CardTitle>
                    <CardDescription>Upload PDF, JPG, or PNG files (max 10MB)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!selectedFile ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium text-foreground mb-2">
                          {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
                        </p>
                        <p className="text-muted-foreground mb-4">or click to browse</p>
                        <Button type="button" variant="outline">
                          Choose File
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{selectedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Document Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Document Details
                    </CardTitle>
                    <CardDescription>Provide document information and categorization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Document Date */}
                    <div className="space-y-2">
                      <Label htmlFor="document-date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Document Date *
                      </Label>
                      <Input
                        id="document-date"
                        type="date"
                        value={documentDate}
                        onChange={(e) => setDocumentDate(e.target.value)}
                        required
                      />
                    </div>

                    {/* Major Head */}
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={majorHead} onValueChange={handleMajorHeadChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal">Personal</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Minor Head */}
                    {majorHead && (
                      <div className="space-y-2">
                        <Label>{majorHead === "Personal" ? "Name" : "Department"} *</Label>
                        <Select value={minorHead} onValueChange={setMinorHead}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${majorHead === "Personal" ? "name" : "department"}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getMinorHeadOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

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
                        placeholder="Select or type tags..."
                      />
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                      <Label htmlFor="remarks" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Remarks
                      </Label>
                      <Textarea
                        id="remarks"
                        placeholder="Add any additional notes or comments..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="min-w-32">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
