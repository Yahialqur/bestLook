import torch
import torchvision.transforms as T
from PIL import Image

# Map model output indices to face-shape labels
FACE_SHAPE_MAP = {
    0: "heart",
    1: "oblong",
    2: "oval",
    3: "round",
    4: "square"
}

def load_model(model, checkpoint_path, device):
    """
    Loads the saved state dict into the given model, 
    sends it to the correct device, sets it to eval mode,
    and returns the model.
    """
    model.classifier[6] = torch.nn.Linear(4096, len(FACE_SHAPE_MAP))
    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model

def predict_face_shape(pil_image, model, device):
    """
    Transforms a PIL image, runs inference on the model,
    and returns the face shape label (e.g., 'oval', 'round', etc.).
    """

    # Define the same transforms used in training
    transform = T.Compose([
        T.Resize((224, 224)),  
        T.ToTensor(),
        T.Normalize(
            mean=[0.485, 0.456, 0.406],  
            std=[0.229, 0.224, 0.225]
        )
    ])

    # Convert the PIL image to a tensor and add a batch dimension
    input_tensor = transform(pil_image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor) 
        _, predicted = outputs.max(dim=1)
        pred_idx = predicted.item()

    # Map the predicted index to corresponding face shape
    face_shape = FACE_SHAPE_MAP[pred_idx]
    return face_shape
