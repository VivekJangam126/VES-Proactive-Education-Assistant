#!/usr/bin/env python3
"""
Proactive Education Assistant Chatbot Training Script
This script provides a foundation for training an AI chatbot model
that can answer questions about the Proactive Education Assistant platform.
"""

import json
import pickle
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

class ChatbotTrainer:
    def __init__(self):
        self.training_data = []
        self.vectorizer = None
        self.classifier = None

    def load_training_data(self):
        """Load training data for the chatbot"""
        training_data = [
            # Greetings
            {"text": "hello", "intent": "greeting"},
            {"text": "hi there", "intent": "greeting"},
            {"text": "good morning", "intent": "greeting"},
            {"text": "hey", "intent": "greeting"},
            {"text": "howdy", "intent": "greeting"},

            # About queries
            {"text": "what is proactive education assistant", "intent": "about"},
            {"text": "what does this app do", "intent": "about"},
            {"text": "tell me about the platform", "intent": "about"},
            {"text": "what is this application", "intent": "about"},
            {"text": "purpose of this app", "intent": "about"},

            # Features
            {"text": "what features do you have", "intent": "features"},
            {"text": "what can you do", "intent": "features"},
            {"text": "capabilities", "intent": "features"},
            {"text": "functionality", "intent": "features"},
            {"text": "what services do you provide", "intent": "features"},

            # Pricing
            {"text": "how much does it cost", "intent": "pricing"},
            {"text": "what are your prices", "intent": "pricing"},
            {"text": "subscription cost", "intent": "pricing"},
            {"text": "pricing plans", "intent": "pricing"},
            {"text": "how much is the premium plan", "intent": "pricing"},

            # Payment
            {"text": "how do I pay", "intent": "payment"},
            {"text": "payment methods", "intent": "payment"},
            {"text": "checkout process", "intent": "payment"},
            {"text": "billing", "intent": "payment"},
            {"text": "payment options", "intent": "payment"},

            # Support
            {"text": "I need help", "intent": "support"},
            {"text": "customer support", "intent": "support"},
            {"text": "contact support", "intent": "support"},
            {"text": "how to get help", "intent": "support"},
            {"text": "technical support", "intent": "support"},
        ]

        self.training_data = training_data
        print(f"Loaded {len(training_data)} training examples")

    def prepare_data(self):
        """Prepare training data for the model"""
        texts = [item["text"] for item in self.training_data]
        labels = [item["intent"] for item in self.training_data]

        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),
            stop_words='english'
        )

        # Transform texts to feature vectors
        X = self.vectorizer.fit_transform(texts)
        y = np.array(labels)

        return X, y

    def train_model(self):
        """Train the chatbot model"""
        print("Preparing training data...")
        X, y = self.prepare_data()

        # Split data for training and testing
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        print("Training model...")
        # Train logistic regression classifier
        self.classifier = LogisticRegression(
            random_state=42,
            max_iter=1000,
            multi_class='ovr'
        )

        self.classifier.fit(X_train, y_train)

        # Evaluate model
        y_pred = self.classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        print(".2f")
        print(f"Training completed with {len(np.unique(y))} intent classes")

        return accuracy

    def save_model(self, model_path="chatbot_model.pkl", vectorizer_path="vectorizer.pkl"):
        """Save the trained model and vectorizer"""
        if self.classifier and self.vectorizer:
            # Save classifier
            with open(model_path, 'wb') as f:
                pickle.dump(self.classifier, f)

            # Save vectorizer
            with open(vectorizer_path, 'wb') as f:
                pickle.dump(self.vectorizer, f)

            print(f"Model saved to {model_path}")
            print(f"Vectorizer saved to {vectorizer_path}")
        else:
            print("No trained model to save")

    def load_model(self, model_path="chatbot_model.pkl", vectorizer_path="vectorizer.pkl"):
        """Load a trained model and vectorizer"""
        try:
            with open(model_path, 'rb') as f:
                self.classifier = pickle.load(f)

            with open(vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)

            print("Model loaded successfully")
            return True
        except FileNotFoundError:
            print("Model files not found")
            return False

    def predict_intent(self, text):
        """Predict the intent of a given text"""
        if not self.classifier or not self.vectorizer:
            return "unknown"

        # Transform input text
        text_vector = self.vectorizer.transform([text])

        # Predict intent
        intent = self.classifier.predict(text_vector)[0]

        return intent

    def get_response(self, intent):
        """Get a response based on predicted intent"""
        responses = {
            "greeting": [
                "Hello! Welcome to Proactive Education Assistant. How can I help you today?",
                "Hi there! I'm here to assist you with anything related to our education platform.",
                "Hey! Great to see you. What would you like to know about our application?"
            ],
            "about": [
                "Proactive Education Assistant is a comprehensive platform designed to help educational institutions manage students, teachers, and administrative tasks efficiently. We provide tools for student management, teacher coordination, analytics, and much more.",
                "We're an innovative education management system that streamlines school operations, enhances learning experiences, and provides valuable insights through advanced analytics."
            ],
            "features": [
                "Our platform includes: Student Management, Teacher Dashboard, Analytics & Reporting, Class Management, Data Import/Export, Payment Processing, and much more. You can explore all features in the respective sections of our application.",
                "Key features include: Comprehensive student profiles, Teacher assignment tools, Real-time analytics, Secure payment gateway, Multi-language support, and Responsive design for all devices."
            ],
            "pricing": [
                "We offer a premium plan at ₹499/month with a 50% discount from the regular ₹999. This includes all features, unlimited users, and priority support.",
                "Our pricing is ₹499 per month (currently 50% off from ₹999). This gives you access to all premium features including analytics, unlimited students/teachers, and 24/7 support."
            ],
            "payment": [
                "You can make payments through our secure gateway supporting UPI, Credit/Debit Cards, Net Banking, and Pay Later options. We also support auto-pay for monthly subscriptions.",
                "Payment is processed securely through Razorpay. We accept UPI (Google Pay, PhonePe, BHIM), all major credit/debit cards, net banking, and Pay Later options."
            ],
            "support": [
                "You can reach our support team through the contact section or email us at support@proactiveeducation.com. We're here to help 24/7!",
                "For assistance, please check our FAQ section or contact our support team. You can also explore the different sections of our application for self-help resources."
            ],
            "unknown": [
                "I'm not sure about that specific question. Could you please rephrase it or ask about our features, pricing, payment options, or general support?",
                "I'd be happy to help! Please ask me about our features, pricing, payment methods, or any other aspect of the Proactive Education Assistant platform."
            ]
        }

        intent_responses = responses.get(intent, responses["unknown"])
        return np.random.choice(intent_responses)

def main():
    """Main function to train and test the chatbot"""
    print("🤖 Proactive Education Assistant Chatbot Trainer")
    print("=" * 50)

    trainer = ChatbotTrainer()

    # Load training data
    trainer.load_training_data()

    # Train the model
    accuracy = trainer.train_model()

    # Save the model
    trainer.save_model()

    # Test the model
    print("\n🧪 Testing the chatbot:")
    test_questions = [
        "Hello, how are you?",
        "What is this app about?",
        "What features do you have?",
        "How much does it cost?",
        "How do I make payment?",
        "I need help with something"
    ]

    for question in test_questions:
        intent = trainer.predict_intent(question)
        response = trainer.get_response(intent)
        print(f"\nQ: {question}")
        print(f"Intent: {intent}")
        print(f"A: {response}")

    print("\n✅ Chatbot training completed successfully!")

if __name__ == "__main__":
    main()