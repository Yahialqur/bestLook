import base64
import io
from flask_cors import CORS
from flask import Flask, request, jsonify
from PIL import Image
import torch
import torchvision.models as models

from inference_utils import load_model, predict_face_shape, FACE_SHAPE_MAP

app = Flask(__name__)
CORS(app)

model_arch = models.vgg16(pretrained=False)
model_arch.classifier[6].out_features = len(FACE_SHAPE_MAP)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = load_model(
    model_arch,
    "/Users/jalqur/Desktop/projects/bestLook/best_model.pth",
    device
)

hairstyle_recommendations = {
    "heart": {
        "male": [
            { "id": 1, "name": "Side-Parted Style", "image": "/hairstyle_images/male/side-parted.jpg" },
            { "id": 2, "name": "Textured Fringe", "image": "/hairstyle_images/male/textured-fringe.jpg" },
            { "id": 3, "name": "Crew Cut", "image": "/hairstyle_images/male/crew-cut.jpg" },
            { "id": 4, "name": "Quiff", "image": "/hairstyle_images/male/quiff.jpg" },
            { "id": 5, "name": "Angular Fringe", "image": "/hairstyle_images/male/angular-fringe.jpg" }
        ],
        "female": [
            { "id": 6, "name": "Long Layers with Side-Swept Bangs", "image": "/hairstyle_images/female/long-layers.jpg" },
            { "id": 7, "name": "Chin-Length Bob", "image": "/hairstyle_images/female/chin-length-bob.jpg" },
            { "id": 8, "name": "Deep Side Part with Loose Waves", "image": "/hairstyle_images/female/deep-side-part.jpg" },
            { "id": 9, "name": "Shoulder-Length Lob", "image": "/hairstyle_images/female/shoulder-length-lob.jpg" },
            { "id": 10, "name": "Side-Swept Pixie Cut", "image": "/hairstyle_images/female/side-swept-pixie.jpg" }
        ]
    },
    "oblong": {
        "male": [
            { "id": 11, "name": "Medium-Length Layered Cut", "image": "/hairstyle_images/male/medium-layered.jpg" },
            { "id": 12, "name": "Side-Swept Bangs", "image": "/hairstyle_images/male/side-swept-bangs.jpg" },
            { "id": 13, "name": "Classic Side Part", "image": "/hairstyle_images/male/classic-side-part.jpg" },
            { "id": 14, "name": "Textured Crop", "image": "/hairstyle_images/male/textured-crop.jpg" },
            { "id": 15, "name": "Fringe Cut", "image": "/hairstyle_images/male/fringe-cut.jpg" }
        ],
        "female": [
            { "id": 16, "name": "Shoulder-Length Waves", "image": "/hairstyle_images/female/shoulder-waves.jpg" },
            { "id": 17, "name": "Soft Curls with Bangs", "image": "/hairstyle_images/female/soft-curls-bangs.jpg" },
            { "id": 18, "name": "Blunt Bob with Bangs", "image": "/hairstyle_images/female/blunt-bob-bangs.jpg" },
            { "id": 19, "name": "Layered Lob", "image": "/hairstyle_images/female/layered-lob.jpg" },
            { "id": 20, "name": "Curtain Bangs with Layers", "image": "/hairstyle_images/female/curtain-bangs-layers.jpg" }
        ]
    },
    "oval": {
        "male": [
            { "id": 21, "name": "Buzz Cut", "image": "/hairstyle_images/male/buzz-cut.jpg" },
            { "id": 22, "name": "Quiff", "image": "/hairstyle_images/male/quiff.jpg" },
            { "id": 23, "name": "Pompadour", "image": "/hairstyle_images/male/pompadour.jpg" },
            { "id": 24, "name": "Slicked-Back Undercut", "image": "/hairstyle_images/male/slicked-back-undercut.jpg" },
            { "id": 25, "name": "Faux Hawk", "image": "/hairstyle_images/male/faux-hawk.jpg" }
        ],
        "female": [
            { "id": 26, "name": "Pixie Cut", "image": "/hairstyle_images/female/pixie-cut.jpg" },
            { "id": 27, "name": "Long Waves", "image": "/hairstyle_images/female/long-waves.jpg" },
            { "id": 28, "name": "Blunt Bob", "image": "/hairstyle_images/female/blunt-bob.jpg" },
            { "id": 29, "name": "Shag Cut", "image": "/hairstyle_images/female/shag-cut.jpg" },
            { "id": 30, "name": "Curtain Bangs with Layers", "image": "/hairstyle_images/female/curtain-bangs-layers.jpg" }
        ]
    },
    "round": {
        "male": [
            { "id": 31, "name": "Pompadour", "image": "/hairstyle_images/male/pompadour.jpg" },
            { "id": 32, "name": "Faux Hawk", "image": "/hairstyle_images/male/faux-hawk.jpg" },
            { "id": 33, "name": "Flat Top", "image": "/hairstyle_images/male/flat-top.jpg" },
            { "id": 34, "name": "Side Part with Volume", "image": "/hairstyle_images/male/side-part-volume.jpg" },
            { "id": 35, "name": "Spiky Hair", "image": "/hairstyle_images/male/spiky-hair.jpg" }
        ],
        "female": [
            { "id": 36, "name": "Long, Face-Framing Layers", "image": "/hairstyle_images/female/long-layers.jpg" },
            { "id": 37, "name": "Side-Swept Bangs", "image": "/hairstyle_images/female/side-swept-bangs.jpg" },
            { "id": 38, "name": "Asymmetrical Bob", "image": "/hairstyle_images/female/asymmetrical-bob.jpg" },
            { "id": 39, "name": "High Bun or Ponytail", "image": "/hairstyle_images/female/high-bun.jpg" },
            { "id": 40, "name": "Shag Cut", "image": "/hairstyle_images/female/layered-shag.jpg" }
        ]
    },
    "square": {
        "male": [
            { "id": 41, "name": "Crew Cut", "image": "/hairstyle_images/male/crew-cut.jpg" },
            { "id": 42, "name": "Textured Crop", "image": "/hairstyle_images/male/textured-crop.jpg" },
            { "id": 43, "name": "Side-Parted Style", "image": "/hairstyle_images/male/side-parted.jpg" },
            { "id": 44, "name": "Quiff", "image": "/hairstyle_images/male/quiff.jpg" },
            { "id": 45, "name": "Ivy League Cut", "image": "/hairstyle_images/male/ivy-league.jpg" }
        ],
        "female": [
            { "id": 46, "name": "Curtain Bangs", "image": "/hairstyle_images/female/curtain-bangs.jpg" },
            { "id": 47, "name": "Italian Bob", "image": "/hairstyle_images/female/italian-bob.jpg" },
            { "id": 48, "name": "Feathered Shoulder-Length Cut", "image": "/hairstyle_images/female/feathered-shoulder.jpg" },
            { "id": 49, "name": "Side-Swept Bangs with Layers", "image": "/hairstyle_images/female/side-swept-bangs-layers.jpg" },
            { "id": 50, "name": "Textured Waves", "image": "/hairstyle_images/female/textured-waves.jpg" }
        ]
    }
}

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    print("Received POST to /api/analyze", flush=True)
    data = request.get_json()
    image_data = data.get("image", "")
    gender = data.get("gender", "")

    if not image_data or not gender:
        return jsonify({"error": "Invalid data received"}), 400

    try:
        base64_str = image_data.split(",")[1]
        decoded_bytes = base64.b64decode(base64_str)
        pil_image = Image.open(io.BytesIO(decoded_bytes)).convert("RGB")

        face_shape = predict_face_shape(pil_image, model, device)
        recommended = hairstyle_recommendations.get(face_shape, {}).get(gender, [])
        print("Predicted face shape:", face_shape, flush=True)
        print("Recommended hairstyles:", recommended, flush=True)

        return jsonify({
            "result": face_shape,
            "hairstyles": recommended
        }), 200

    except Exception as e:
        print("Error analyzing image:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)