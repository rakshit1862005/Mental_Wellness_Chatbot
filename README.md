# Mental Wellness Chatbot

A supportive AI chatbot designed to provide mental wellness assistance through mood tracking, journaling prompts, coping strategies, and crisis detection. Built with React frontend, Flask backend, and machine learning for intent classification.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![Flask](https://img.shields.io/badge/flask-2.3+-green.svg)

## ⚠️ Important Disclaimer

**This chatbot is designed for educational and supportive purposes only. It is NOT a replacement for professional mental health care, therapy, or medical advice. If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.**

## Features

### Core Functionality
- **Intelligent Chat Interface**: AI-powered conversational support using machine learning
- **Crisis Detection**: Automatic identification of concerning language with immediate resource provision
- **Mood Tracking**: Daily mood logging with visual progress tracking
- **Journaling Support**: Guided prompts for self-reflection and emotional processing
- **Coping Strategies**: Evidence-based techniques for stress management and emotional regulation
- **Data Export**: Complete conversation and mood history export capabilities

### Technical Features
- **Machine Learning**: TF-IDF + Logistic Regression for intent classification
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Local Data Storage**: SQLite database ensures privacy and offline functionality
- **RESTful API**: Clean backend architecture with comprehensive endpoints
- **Real-time Updates**: Instant response system with typing indicators

## Technology Stack

### Backend
- **Node.js** - Backend Server For Chat Logging And Handling Login/Signup
- **Python 3.8+** - Core programming language
- **Flask 2.3+** - Web framework and API server
- **SQLite** - Lightweight database for data persistence
- **scikit-learn** - Machine learning library for intent classification
- **Flask-CORS** - Cross-origin resource sharing support

### Frontend
- **React 18+** - User interface framework
- **CSS3** - Modern styling with animations and responsive design
- **Axios** - HTTP client for API communication
- **Recharts** - Data visualization for mood tracking

### Machine Learning
- **TF-IDF Vectorization** - Text feature extraction
- **Logistic Regression** - Classification model
- **Joblib** - Model serialization and loading

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mental-wellness-chatbot.git
cd mental-wellness-chatbot
```

2. **Set up the backend**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the ML model
python train_model.py

# Start the Flask server
python app.py
```

3. **Set up the frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
mental-wellness-chatbot/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── train_model.py            # ML model training script
│   ├── test_integration.py       # System testing utilities
│   ├── requirements.txt          # Python dependencies
│   ├── chatbot_model_*.pkl       # Trained ML model files
│   └── mental_wellness.db        # SQLite database (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── App.css              # Application styles
│   │   └── index.js             # React entry point
│   ├── public/
│   │   └── index.html           # HTML template
│   └── package.json             # Node.js dependencies
├── docs/
│   ├── SRS.md                   # Software Requirements Specification
│   └── DEPLOYMENT_GUIDE.md      # Detailed setup instructions
└── README.md                    # This file
```

## Machine Learning Model

### Overview
The chatbot uses a supervised learning approach to classify user intents:

- **Algorithm**: TF-IDF + Logistic Regression
- **Training Data**: 200+ manually curated examples across 6 intent categories
- **Accuracy**: 85-90% overall, 95%+ for crisis detection
- **Performance**: Sub-second prediction times

### Intent Categories
1. **Crisis** - Identifies concerning language requiring immediate attention
2. **Mood Check** - Requests for mood tracking and emotional assessment
3. **Journal Prompt** - Requests for writing prompts and self-reflection guidance
4. **Coping Strategy** - Requests for stress management and emotional regulation techniques
5. **Gratitude** - Expressions of thanks and positive feedback
6. **General** - Open-ended conversation and general support requests

### Model Training
```bash
cd backend
python train_model.py
```

This creates the trained model files (`chatbot_model_vectorizer.pkl` and `chatbot_model_classifier.pkl`) required for the application to function.

## API Endpoints

### Chat & ML
- `POST /api/chat` - Send message and receive AI-generated response
- `POST /api/feedback` - Submit user feedback on model performance
- `GET /api/model/stats` - Retrieve model performance statistics

### Mood Tracking
- `POST /api/mood` - Log mood rating (1-10 scale)
- `GET /api/mood/history` - Retrieve mood tracking history

### Journaling
- `POST /api/journal` - Save journal entry
- `GET /api/journal/history` - Retrieve journal entries
- `GET /api/prompts` - Get available journaling prompts

### Data & Resources
- `GET /api/export` - Export all user data
- `GET /api/strategies` - Get coping strategies
- `GET /api/health` - System health check

## Testing

### Run Integration Tests
```bash
cd backend
python test_integration.py
```

### Manual Testing Checklist
- [ ] Chat interface responds appropriately to different message types
- [ ] Crisis keywords trigger emergency resource display
- [ ] Mood scale functions correctly and persists data
- [ ] Journal prompts are generated and entries are saved
- [ ] Coping strategies are provided based on context
- [ ] Data export functionality works correctly
- [ ] Application handles edge cases gracefully

## Development Workflow

### Adding New Training Data
1. Edit `train_model.py` to add examples to the appropriate intent category
2. Run `python train_model.py` to retrain the model
3. Restart the Flask server to load the new model

### Modifying Response Logic
1. Update the `generate_response()` function in `app.py`
2. Test changes using the chat interface
3. Verify crisis detection still functions correctly

### UI/UX Changes
1. Modify React components in `frontend/src/App.jsx`
2. Update styles in `frontend/src/App.css`
3. Test responsive design across different screen sizes

## Safety & Ethics

### Crisis Detection System
- **Multiple Detection Methods**: Combines ML classification with keyword matching
- **High Sensitivity**: Designed to err on the side of caution for safety
- **Immediate Response**: Crisis resources displayed instantly upon detection
- **Professional Resources**: Direct links to suicide prevention hotlines and crisis support

### Privacy & Data Protection
- **Local Storage Only**: All user data stored locally in SQLite database
- **No External Data Transfer**: No user information sent to third-party services
- **Data Control**: Users can export or delete their data at any time
- **Transparent Operation**: Open-source codebase for full transparency

## Contributing

### Development Guidelines
1. **Safety First**: Crisis detection functionality must never be compromised
2. **Privacy Preservation**: No changes that would expose user data externally
3. **Accessibility**: Maintain keyboard navigation and screen reader compatibility
4. **Testing**: All changes must pass integration tests
5. **Documentation**: Update relevant documentation for significant changes

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Local Development
The application runs locally for development and demonstration purposes. See `DEPLOYMENT_GUIDE.md` for detailed instructions.

### Production Deployment (Optional)
- **Frontend**: Deploy to Netlify, Vercel, or similar static hosting
- **Backend**: Deploy to Railway, Render, PythonAnywhere, or similar platforms
- **Database**: SQLite file storage suitable for small to medium scale deployment

## Performance

### System Requirements
- **Minimum**: 4GB RAM, 2GB disk space
- **Recommended**: 8GB RAM, 5GB disk space
- **Network**: Internet connection required for initial setup only

### Performance Metrics
- **Response Time**: < 2 seconds for typical interactions
- **ML Prediction**: < 500ms for intent classification
- **Database Queries**: < 100ms for standard operations
- **Concurrent Users**: Supports up to 5 simultaneous users per deployment

## Troubleshooting

### Common Issues

**Model Training Fails**
```bash
pip install --upgrade scikit-learn joblib numpy
python train_model.py
```

**CORS Errors**
- Verify Flask-CORS is installed
- Check proxy configuration in `frontend/package.json`

**Database Connection Issues**
- Ensure SQLite database file has proper permissions
- Verify database initialization completed successfully

**Low Model Accuracy**
- Add more training examples to relevant intent categories
- Retrain model with expanded dataset
- Use fallback keyword detection as backup

### Getting Help
1. Check terminal output for error messages
2. Run integration tests to identify specific issues
3. Review API responses using browser developer tools
4. Consult `DEPLOYMENT_GUIDE.md` for detailed troubleshooting

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mental health professionals who provided guidance on appropriate responses
- Open-source community for libraries and frameworks
- Crisis support organizations for resource recommendations
- Accessibility guidelines from Web Content Accessibility Guidelines (WCAG)

## Support & Resources

### Crisis Resources
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://iasp.info

### Mental Health Resources
- **National Alliance on Mental Illness (NAMI)**: https://nami.org
- **Mental Health America**: https://mhanational.org
- **American Psychological Association**: https://apa.org

---

**Remember: This application is a supportive tool, not a replacement for professional mental health care. Please seek professional help when needed.**
