from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow Next.js origin

# Load your ATIS model
MODEL_PATH = r"C:\Users\Sree Charan\Downloads\intent_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)

# Use the model's id2label mapping
id2label = model.config.id2label
print(id2label)

@app.route("/")  # root URL
def home():
    return "ATIS Intent Classification API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        user_text = data.get('message', '') or data.get('text','')
        if not user_text:
            return jsonify({"error": "No message provided"}), 400
        
        # Tokenize and predict
        inputs = tokenizer(user_text, return_tensors="pt", padding=True, truncation=True, max_length=128)
        model.eval()
        with torch.no_grad():
            outputs = model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            confidence, pred_id = torch.max(probs, dim=-1)
            confidence = confidence.item()
            pred_id = pred_id.item()
        
        # Get actual label name
        predicted_intent = id2label.get(pred_id, "unknown")
        
        result = {
            "intent": predicted_intent,
            "confidence": confidence
        }
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ATIS model is running!"})

if __name__ == '__main__':
    print("Starting ATIS Intent Classification API...")
    app.run(debug=True, host='0.0.0.0', port=5000)
