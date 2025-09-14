# Document Management System

A professional, secure document management web application built with React, Next.js, and modern UI components. Features OTP-based authentication, document upload with metadata, powerful search and filtering, file preview capabilities, and comprehensive admin user management.

## 🚀 Features

### Core Functionality
- **OTP Authentication**: Secure mobile number-based login with OTP verification
- **Document Upload**: Drag-and-drop file upload with metadata (categories, tags, remarks)
- **Advanced Search**: Filter documents by category, date range, tags, and text search
- **File Preview**: In-browser preview for PDFs and images
- **Bulk Operations**: Download multiple documents as ZIP files
- **Admin Panel**: User management and system administration

### Technical Features
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional UI**: Clean, modern interface using shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **API Integration**: Ready for backend integration with provided API endpoints
- **State Management**: React Context for authentication and app state
- **File Handling**: Support for PDF, JPG, PNG files with size validation

## 🛠 Tech Stack

- **Frontend**: React 19, Next.js 14, TypeScript
- **UI Components**: shadcn/ui, Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **Authentication**: Custom OTP-based auth system
- **API Client**: Custom fetch-based API client

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

## 🚀 Getting Started

### 1. Installation

\`\`\`bash
# Clone or download the project
# Navigate to project directory
cd document-management-system

# Install dependencies
npm install
# or
yarn install
\`\`\`

### 2. Environment Setup

The application is configured to work with the provided API endpoints:
- Base URL: `https://apis.allsoft.co/api/documentManagement`
- No additional environment variables required for basic functionality

### 3. Development

\`\`\`bash
# Start development server
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

\`\`\`bash
# Build the application
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
\`\`\`

## 📱 Usage Guide

### Authentication
1. Enter your mobile number on the login page
2. Click "Send OTP" to receive verification code
3. Enter the OTP to authenticate and access the system

### Document Upload
1. Navigate to "Upload Document" from the sidebar
2. Drag and drop files or click to browse (PDF, JPG, PNG only)
3. Fill in document metadata:
   - Document date
   - Category (Personal/Professional)
   - Subcategory (Names for Personal, Departments for Professional)
   - Tags (searchable keywords)
   - Remarks (optional notes)
4. Click "Upload Document" to save

### Document Search
1. Go to "Search Documents" from the sidebar
2. Use filters to narrow down results:
   - Text search in document names and remarks
   - Category and subcategory filters
   - Date range selection
   - Tag-based filtering
3. View results with preview and download options
4. Select multiple documents for bulk download

### Admin Functions
1. Access "Admin Panel" from the sidebar
2. **Create User**: Add new users with username and password
3. **Manage Users**: View all users, toggle status, reset passwords

## 🏗 Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Authentication pages
│   ├── search/            # Document search pages
│   ├── upload/            # Document upload pages
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── document/          # Document-related components
│   ├── layout/            # Layout components (sidebar, etc.)
│   └── ui/                # UI component library
├── contexts/              # React contexts
│   └── auth-context.tsx   # Authentication state management
├── lib/                   # Utility libraries
│   ├── api.ts             # API client and types
│   ├── download-utils.ts  # File download utilities
│   └── utils.ts           # General utilities
└── README.md              # This file
\`\`\`

## 🎨 Design System

The application uses a professional design system with:
- **Primary Color**: Gray-700 (#374151) for professional appearance
- **Secondary Color**: Indigo-500 (#6366f1) for accents and highlights
- **Neutral Colors**: White, light grays, and dark grays for backgrounds and text
- **Typography**: Geist Sans for clean, modern text rendering
- **Responsive Grid**: Mobile-first design with breakpoints for tablet and desktop

## 🔧 API Integration

The application is designed to work with the provided backend API:

### Authentication Endpoints
- `POST /generateOTP` - Generate OTP for mobile number
- `POST /validateOTP` - Validate OTP and get authentication token

### Document Endpoints
- `POST /saveDocumentEntry` - Upload document with metadata
- `POST /searchDocumentEntry` - Search documents with filters
- `POST /documentTags` - Get available tags for autocomplete

### Headers
- `token`: Authentication token (required for protected endpoints)
- `Content-Type`: `application/json` for JSON requests

## 🔒 Security Features

- **OTP Authentication**: Secure mobile-based login
- **Token-based Authorization**: JWT tokens for API access
- **File Type Validation**: Only allow PDF, JPG, PNG files
- **File Size Limits**: 10MB maximum file size
- **Input Sanitization**: Proper validation of all user inputs

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: Touch-friendly interface with collapsible sidebar
- **Tablet**: Optimized layouts for medium screens
- **Desktop**: Full-featured interface with sidebar navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy with default settings

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational and professional purposes. Please ensure compliance with your organization's policies when using in production environments.

## 🆘 Support

For technical support or questions:
- Check the documentation above
- Review the code comments for implementation details
- Contact: nk@allsoft.co (as mentioned in the original requirements)

---

**Built with ❤️ using React, Next.js, and modern web technologies**
