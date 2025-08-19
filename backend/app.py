from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
import gc

app = Flask(__name__)

# Fixed CORS - separate URLs properly and remove trailing slash
CORS(app, origins=[
    "http://localhost:3000", 
    "https://chat-bot-intent-classifier-efrs-j1quwzj2p.vercel.app"
])

# Global variables for lazy loading to save memory
model = None
tokenizer = None
id2label = None

def load_model():
    """Load model only when needed to save memory"""
    global model, tokenizer, id2label
    
    if model is None:
        print("Loading model...")
        try:
            MODEL_NAME = "Sreecharan1289/intent-model"
            
            # Load tokenizer and model
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
            
            model.to('cpu')
            model.eval()
            
            torch.set_num_threads(1)
            
            # Use the model's id2label mapping
            id2label = model.config.id2label
            print("Model loaded successfully!")
            print(f"Labels: {id2label}")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            # Fallback response
            model = "fallback"
            tokenizer = "fallback"
            id2label = {0: "flight", 1: "airfare", 2: "ground_service"}

def cleanup_memory():
    """Clean up memory after inference"""
    gc.collect()

@app.route("/")
def home():
    return jsonify({
        "message": "ATIS Intent Classification API is running!",
        "status": "active"
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Load model on first request
        load_model()
        
        data = request.json
        user_text = data.get('message', '') or data.get('text', '')
        
        if not user_text:
            return jsonify({"error": "No message provided"}), 400
        
        # If model loading failed, return fallback response
        if model == "fallback":
            return jsonify({
                "intent": "flight",
                "confidence": 0.85,
                "message": "Using fallback classification"
            })
        
        # Tokenize input
        inputs = tokenizer(
            user_text, 
            return_tensors="pt", 
            padding=True, 
            truncation=True, 
            max_length=128
        )
        
        # Ensure everything is on CPU
        inputs = {k: v.to('cpu') for k, v in inputs.items()}
        
        # Inference
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            confidence, pred_id = torch.max(probs, dim=-1)
            confidence = confidence.item()
            pred_id = pred_id.item()
        
        # Get predicted label
        predicted_intent = id2label.get(pred_id, "unknown")
        
        # Clean up memory
        cleanup_memory()
        
        result = {
            "intent": predicted_intent,
            "confidence": round(confidence, 4),
            "text": user_text
        }
        
        return jsonify(result)
        
    except Exception as e:
        cleanup_memory()
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None and model != "fallback"
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print("Starting ATIS Intent Classification API...")
    print(f"Running on port: {port}")
    
    # Don't load model at startup to save memory
    app.run(host="0.0.0.0", port=port, debug=False)
