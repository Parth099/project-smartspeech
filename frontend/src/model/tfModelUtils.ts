import * as tf from "@tensorflow/tfjs";

// Define types
type Coordinate = { x: number; y: number };
type BoundingBox = {
    min: Coordinate;
    max: Coordinate;
  };
type InferenceData = { name: string; prob: number };

// Define variables
let model: tf.LayersModel | null = null;
let classNames: string[] = [];
let isLoaded: boolean = false;

/**
 * Parse the dictionary file into a list of class names
 */
function success(data: string): void {
    const lst = data.split(/\n/);
    for (let i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i];
        classNames[i] = symbol;
    }
    isLoaded = true;
    console.log('dictionary loaded and parsed.');
}

/**
 * Load the dictionary file.
 */
async function loadDict(): Promise<void> {
    const loc: string = '/model_assets/class_names.txt';
    
    try {
      const response = await fetch(loc);
      const data = await response.text();
      success(data);
    } catch (error) {
      console.error('Failed to load dictionary:', error);
    }
}

/**
 * Load the model if it is not already loaded.
 */
export async function loadModel(): Promise<void> {
    if (isLoaded == false) {
        model = await tf.loadLayersModel('/model_assets/model.json');
        console.log('model loaded');
        model.predict(tf.zeros([1, 28, 28, 1])); // Dummy prediction to warm up the model
        await loadDict();
    }
}

/**
 * Input the array of drawing coordinates.
 */
function getBoundingBox(coords: Coordinate[]): BoundingBox {
    // Get coordinate arrays
    const coorX = coords.map(p => p.x);
    const coorY = coords.map(p => p.y);
  
    // Find top left and bottom right corners
    const min_coords: Coordinate = {
      x: Math.min(...coorX),
      y: Math.min(...coorY)
    };
    const max_coords: Coordinate = {
      x: Math.max(...coorX),
      y: Math.max(...coorY)
    };
  
    // Return as struct
    return {
      min: min_coords,
      max: max_coords
    };
}

function getImageData(bb: BoundingBox, canvas: HTMLCanvasElement): ImageData {
    const dpi = window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('CanvasRenderingContext2D is not available');
    }

    // Calculate the coordinates and size respecting the DPI
    const x = bb.min.x * dpi;
    const y = bb.min.y * dpi;
    const width = (bb.max.x - bb.min.x) * dpi;
    const height = (bb.max.y - bb.min.y) * dpi;

    // Get the image data from the context
    const imgData = ctx.getImageData(x, y, width, height);
    return imgData;
}

function preprocess(imgData: ImageData) {
    return tf.tidy(() => {
        // Convert to a tensor
        let tensor = tf.browser.fromPixels(imgData, 1);
        
        // Resize
        const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
        
        // Normalize
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));
    
        // We add a dimension to get a batch shape
        const batched = normalized.expandDims(0);
        return batched;
      });
}

function performInference(processedData: tf.Tensor): tf.Tensor {
    const pred = model.predict(preprocess(processedData)).dataSync();
    return pred;
}

function getInferenceData(inferenceResult: tf.Tensor): InferenceData {
    
}

/**
 * Process a drawing from coordinates and canvas object.
 * Return predictions as an array of classes and probabilities.
 */
export function processDrawing(coords: Coordinate[], canvas: HTMLCanvasElement): InferenceData {
    // Get minimum bounding box from coordinate array.
    const bb = getBoundingBox(coords);
    // Get image data from minimum bounding box and canvas element.
    const imgData = getImageData(bb, canvas);
    // Preprocess data for model inference.
    const processedData = preprocess(imgData);

    // Perform inference with processed data.
    const inferenceResult = performInference(processedData);

    // Return inference data 
    const infData = getInferenceData(inferenceResult);
    return infData
}