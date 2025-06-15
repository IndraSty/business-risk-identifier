# 🚀 Business Risk Identifier API - Setup Instructions

## 📋 Prerequisites

- Python 3.8+ installed
- OpenAI API account and API key
- OpenRouter AI account and API key
- Terminal/Command prompt access

## 🔧 Step-by-Step Setup

### 1. Clone and Navigate to Project
```bash
cd business-risk-identifier
cd backend
```

### 2. Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Generate Secure API Key
```bash
# Run the API key generator
python generate_api_key.py

# Or generate manually in Python:
python -c "import secrets; print('Your API Key:', secrets.token_urlsafe(32))"
```

### 5. Create Environment File
```bash
# Copy the template
cp .env.example .env

# Edit the .env file with your actual values
```

### 6. Configure Your .env File

**🔑 Required Settings:**
```bash
# Replace with your secure API key
API_KEY=your-generated-secure-api-key-here

# Add your OpenAI API key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**🌐 Optional Settings:**
```bash
# Add your domain if deploying
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
ALLOWED_HOSTS=localhost,yourdomain.com
```

### 7. Test Configuration
```bash
# Test if configuration is loaded correctly
python -c "from app.config.settings import settings; print('✅ Config loaded:', settings.APP_NAME)"
```

### 8. Run the Application
```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m app.main
```

### 9. Test API Access
```bash
# Test health endpoint (no API key required)
curl http://localhost:8000/health

# Test protected endpoint (API key required)
curl -H "Authorization: Bearer your-api-key-here" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/v1/stats
```

## 🔐 Security Best Practices

### API Key Management
- ❌ **Never** commit your `.env` file to version control
- ✅ Use different API keys for different environments
- ✅ Rotate API keys regularly
- ✅ Use environment-specific configurations

### OpenAI API Key
- ❌ **Never** share your OpenAI API key
- ✅ Set usage limits in OpenAI dashboard
- ✅ Monitor API usage regularly
- ✅ Use separate keys for development and production
### OpenRouter API Key
- ❌ **Never** share your OpenRouter DeepSeek API key
- ✅ Set usage limits in OpenRouter DeepSeek dashboard
- ✅ Monitor API usage regularly
- ✅ Use separate keys for development and production

## 🌍 Environment Configurations

### Development (.env)
```bash
ENVIRONMENT=development
DEBUG=true
API_KEY_REQUIRED=false  # For easier testing
LOG_LEVEL=DEBUG
```

### Production (.env.production)
```bash
ENVIRONMENT=production
DEBUG=false
API_KEY_REQUIRED=true
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://yourdomain.com
ALLOWED_HOSTS=yourdomain.com
```

## 🚀 Deployment (Railway)

### Railway Environment Variables
Set these in Railway dashboard:
```bash
ENVIRONMENT=production
API_KEY=your-secure-production-api-key
OPENAI_API_KEY=sk-your-openai-api-key
ALLOWED_ORIGINS=https://your-railway-domain.railway.app
ALLOWED_HOSTS=*.railway.app
```

### Railway Deployment Commands
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

## 🧪 Testing Your Setup

### 1. Basic Health Check
```bash
curl http://localhost:8000/health
```

### 2. API Key Authentication
```bash
curl -H "Authorization: Bearer your-api-key" \
     http://localhost:8000/api/v1/stats
```

### 3. Risk Analysis Test
```bash
curl -X POST \
     -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/json" \
     -d '{
       "document_content": "We are planning to expand to international markets without sufficient market research. Our cash flow is tight and we may face regulatory challenges.",
       "document_type": "business_plan",
       "company_scale": "startup",
       "industry": "technology"
     }' \
     http://localhost:8000/api/v1/analyze
```

## 📚 API Documentation

Once running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🛠️ Troubleshooting

### Common Issues

1. **ModuleNotFoundError**
   ```bash
   # Make sure virtual environment is activated
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```

2. **OpenAI API Key Invalid**
   ```bash
   # Check your API key in OpenAI dashboard
   # Ensure it starts with 'sk-'
   ```

3. **Port Already in Use**
   ```bash
   # Use different port
   uvicorn app.main:app --port 8001
   ```

4. **CORS Issues**
   ```bash
   # Add your frontend URL to ALLOWED_ORIGINS in .env
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

## 🎯 Next Steps

1. ✅ Complete environment setup
2. ✅ Test all endpoints
3. 🔄 Implement remaining services (OpenAI, Risk Analysis)
4. 🚀 Deploy to Railway
5. 🧪 Add comprehensive tests
6. 📱 Build frontend client

---

**🎉 Congratulations! Your Business Risk Identifier API is ready for development!**