// API configuration and utilities for document management system
const API_BASE_URL = "https://apis.allsoft.co/api/documentManagement"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface OTPGenerateRequest {
  mobile_number: string
}

export interface OTPValidateRequest {
  mobile_number: string
  otp: string
}

export interface OTPValidateResponse {
  token: string
  user_id: string
}

export interface DocumentUploadData {
  major_head: string
  minor_head: string
  document_date: string
  document_remarks: string
  tags: { tag_name: string }[]
  user_id: string
}

export interface SearchDocumentRequest {
  major_head?: string
  minor_head?: string
  from_date?: string
  to_date?: string
  tags?: { tag_name: string }[]
  uploaded_by?: string
  start: number
  length: number
  filterId?: string
  search?: { value: string }
}

export interface DocumentTagsRequest {
  term: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { token }),
    }
  }

  private getAuthHeadersForFormData(): HeadersInit {
    const token = localStorage.getItem("auth_token")
    return {
      ...(token && { token }),
    }
  }

  async generateOTP(data: OTPGenerateRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/generateOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (error) {
      return { success: false, error: "Failed to generate OTP" }
    }
  }

  async validateOTP(data: OTPValidateRequest): Promise<ApiResponse<OTPValidateResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/validateOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (error) {
      return { success: false, error: "Failed to validate OTP" }
    }
  }

  async uploadDocument(file: File, data: DocumentUploadData): Promise<ApiResponse> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("data", JSON.stringify(data))

      const response = await fetch(`${API_BASE_URL}/saveDocumentEntry`, {
        method: "POST",
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      })

      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (error) {
      return { success: false, error: "Failed to upload document" }
    }
  }

  async searchDocuments(data: SearchDocumentRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/searchDocumentEntry`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (error) {
      return { success: false, error: "Failed to search documents" }
    }
  }

  async getDocumentTags(data: DocumentTagsRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/documentTags`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      return { success: response.ok, data: result }
    } catch (error) {
      return { success: false, error: "Failed to get document tags" }
    }
  }
}

export const apiClient = new ApiClient()
