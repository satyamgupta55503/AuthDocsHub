# Document Management System - Complete Project Guide

## 📋 Project Overview

This is a production-ready, full-stack Document Management System built with modern technologies and best practices. The system provides secure document storage, search capabilities, and user management with OTP-based authentication.

### 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Storage  │    │   Twilio SMS    │    │   GridFS        │
│   (GridFS/Local)│    │   (OTP Service) │    │   (File Store)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- Docker & Docker Compose (optional)
- Twilio Account (for production OTP)

### 1. Clone and Setup

\`\`\`bash
git clone <repository-url>
cd document-management-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
\`\`\`

### 2. Environment Configuration

**Backend (.env):**
\`\`\`bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
\`\`\`

**Frontend (.env):**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

### 3. Database Setup

\`\`\`bash
# Start MongoDB (if not using Docker)
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongo mongo:6.0
\`\`\`

### 4. Start Development Servers

**Option A: Manual Start**
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
\`\`\`

**Option B: Docker Compose**
\`\`\`bash
docker-compose up -d
\`\`\`

### 5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 🔧 Development Workflow

### Branch Strategy
\`\`\`
main (production)
├── develop (integration)
├── feature/auth-system
├── feature/document-upload
├── feature/search-filters
└── hotfix/security-patch
\`\`\`

### Commit Message Convention
\`\`\`
feat: add OTP authentication system
fix: resolve file upload validation issue  
docs: update API documentation
test: add unit tests for document service
refactor: optimize search query performance
style: format code with prettier
chore: update dependencies
\`\`\`

### Development Process

1. **Create Feature Branch**
   \`\`\`bash
   git checkout -b feature/new-feature
   \`\`\`

2. **Development**
   - Write code following project standards
   - Add unit tests for new functionality
   - Update documentation as needed

3. **Testing**
   \`\`\`bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   \`\`\`

4. **Code Review**
   - Create pull request to develop branch
   - Ensure all tests pass
   - Get approval from team lead

5. **Merge & Deploy**
   - Merge to develop for integration testing
   - Merge to main for production deployment

## 🧪 Testing Strategy

### Backend Testing
\`\`\`bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
\`\`\`

### Test Structure
\`\`\`
backend/
├── __tests__/
│   ├── auth.test.js
│   ├── documents.test.js
│   └── users.test.js
└── test-utils/
    └── setup.js

frontend/
├── src/__tests__/
│   ├── components/
│   ├── pages/
│   └── utils/
└── cypress/
    └── integration/
\`\`\`

## 📦 Deployment

### Production Environment Setup

1. **Server Requirements**
   - Ubuntu 20.04+ or CentOS 8+
   - Node.js 18+
   - MongoDB 6.0+
   - Nginx (reverse proxy)
   - SSL Certificate

2. **Environment Variables**
   \`\`\`bash
   # Production backend .env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dms_prod
   JWT_SECRET=<strong-secret-key>
   TWILIO_ACCOUNT_SID=<your-sid>
   TWILIO_AUTH_TOKEN=<your-token>
   TWILIO_FROM_NUMBER=<your-number>
   \`\`\`

3. **Build & Deploy**
   \`\`\`bash
   # Build frontend
   cd frontend
   npm run build
   
   # Deploy backend
   cd backend
   npm install --production
   pm2 start server.js --name dms-backend
   
   # Setup Nginx
   sudo cp nginx.conf /etc/nginx/sites-available/dms
   sudo ln -s /etc/nginx/sites-available/dms /etc/nginx/sites-enabled/
   sudo systemctl reload nginx
   \`\`\`

### Docker Production Deployment
\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Monitor
docker-compose logs -f
\`\`\`

### CI/CD Pipeline

**GitHub Actions Workflow:**
\`\`\`yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          # Deployment script
\`\`\`

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Database: Connection status monitoring
- File Storage: Disk space monitoring

### Logging
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: Nginx access logs

### Backup Strategy
\`\`\`bash
# Database backup
mongodump --db dms_prod --out /backups/$(date +%Y%m%d)

# File backup
tar -czf /backups/files_$(date +%Y%m%d).tar.gz uploads/
\`\`\`

### Performance Monitoring
- Response time monitoring
- Database query optimization
- File upload/download metrics
- User activity analytics

## 🔒 Security Considerations

### Authentication & Authorization
- JWT token-based authentication
- OTP verification via Twilio
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- File type and size restrictions
- SQL injection prevention
- XSS protection

### Infrastructure Security
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Security headers (Helmet.js)

## 📚 API Documentation

### Authentication Endpoints
\`\`\`
POST /api/documentManagement/generateOTP
POST /api/documentManagement/validateOTP
\`\`\`

### Document Management
\`\`\`
POST /api/documentManagement/saveDocumentEntry
POST /api/documentManagement/searchDocumentEntry
GET  /api/documentManagement/downloadDocument/:id
\`\`\`

### User Management
\`\`\`
GET    /api/documentManagement/users
POST   /api/documentManagement/users
PUT    /api/documentManagement/users/:id
DELETE /api/documentManagement/users/:id
\`\`\`

## 🎯 Assignment Submission Checklist

### Code Quality
- [ ] All features implemented and tested
- [ ] Code follows project conventions
- [ ] No console errors or warnings
- [ ] Responsive design works on all devices
- [ ] Cross-browser compatibility verified

### Documentation
- [ ] README.md updated with setup instructions
- [ ] API documentation complete
- [ ] Code comments added where necessary
- [ ] PROJECT_GUIDE.md comprehensive

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests cover main workflows
- [ ] Manual testing completed
- [ ] Performance testing done

### Deployment
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Monitoring setup complete

### Security
- [ ] Authentication working correctly
- [ ] Authorization rules enforced
- [ ] Input validation implemented
- [ ] File upload security verified
- [ ] Security headers configured

## 🆘 Troubleshooting

### Common Issues

**OTP Not Received:**
- Check Twilio configuration
- Verify phone number format
- Check rate limiting settings

**File Upload Fails:**
- Verify file size limits
- Check disk space
- Validate file types

**Database Connection Error:**
- Ensure MongoDB is running
- Check connection string
- Verify network connectivity

**Build Errors:**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

### Support Contacts
- Technical Lead: [email]
- DevOps Team: [email]
- Project Manager: [email]

---

**Last Updated:** $(date)
**Version:** 1.0.0
**Maintainer:** Development Team
