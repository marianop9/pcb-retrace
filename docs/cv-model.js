let session;

async function cvLoadModel() {
  try {
    // Path to your .onnx file hosted on your server
    session = await ort.InferenceSession.create("./cv-model.onnx", {
      executionProviders: ["wasm"],
    });
    console.log("Model loaded successfully.");
  } catch (e) {
    console.error("Failed to load the model:", e);
  }
}

cvLoadModel();

async function cvDetectComponents(imageElement) {
  if (!session) {
    console.error("Model is not loaded yet.");
    return;
  }

  const inputTensor = cvPreprocessImage(imageElement);

  // The key 'images' must match your model's input node name from Netron
  const feeds = { images: inputTensor };

  try {
    const results = await session.run(feeds);
    // The key 'output0' must match your model's output node name
    const outputTensor = results[Object.keys(results)[0]];

    return cvProcessOutputs(outputTensor.data, imageElement);
  } catch (error) {
    console.error("Error running inference:", error);
  }
  return {};
}

function cvPreprocessImage(imageElement, modelWidth = 480, modelHeight = 480) {
  const canvas = document.createElement("canvas");
  canvas.width = modelWidth;
  canvas.height = modelHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(imageElement, 0, 0, modelWidth, modelHeight);
  const imgData = ctx.getImageData(0, 0, modelWidth, modelHeight);
  const data = imgData.data;

  const float32Buffer = new Float32Array(3 * modelWidth * modelHeight);

  let rIndex = 0;
  let gIndex = modelWidth * modelHeight;
  let bIndex = 2 * modelWidth * modelHeight;

  for (let i = 0; i < data.length; i += 4) {
    float32Buffer[rIndex++] = data[i] / 255.0; // R
    float32Buffer[gIndex++] = data[i + 1] / 255.0; // G
    float32Buffer[bIndex++] = data[i + 2] / 255.0; // B
  }

  return new ort.Tensor("float32", float32Buffer, [
    1,
    3,
    modelHeight,
    modelWidth,
  ]);
}

function cvProcessOutputs(outputData, originalImage) {
  const confidenceThreshold = 0.3; // Adjust as needed
  const numDetections = 300;
  const numElements = 6; // xmin, ymin, xmax, ymax, score, classId

  // Scale factors to map 480x480 coordinates back to the original image size
  const scaleX = originalImage.naturalWidth / 480;
  const scaleY = originalImage.naturalHeight / 480;

  const detections = [];

  for (let i = 0; i < numDetections; i++) {
    const offset = i * numElements;
    const score = outputData[offset + 4];

    if (score > confidenceThreshold) {
      let xmin = outputData[offset + 0];
      let ymin = outputData[offset + 1];
      let xmax = outputData[offset + 2];
      let ymax = outputData[offset + 3];
      const classId = Math.round(outputData[offset + 5]);

      // Note: Check if your model outputs normalized coordinates (0 to 1)
      // or absolute coordinates (0 to 480).
      // If the values of xmin/xmax are between 0 and 1, uncomment the lines below:
      // xmin *= 480;
      // ymin *= 480;
      // xmax *= 480;
      // ymax *= 480;

      // Scale to original image dimensions
      const realXmin = xmin * scaleX;
      const realYmin = ymin * scaleY;
      const realWidth = (xmax - xmin) * scaleX;
      const realHeight = (ymax - ymin) * scaleY;

      detections.push({
        x: realXmin,
        y: realYmin,
        width: realWidth,
        height: realHeight,
        score: score,
        classId: classId,
      });
    }
  }

  // Filter out overlapping duplicates (IoU threshold of 0.45 is a standard starting point)
  return filterDuplicates(detections, 0.3);
}

// Helper to calculate how much two boxes overlap (Intersection over Union)
function calculateIoU(box1, box2) {
  const x1 = Math.max(box1.x, box2.x);
  const y1 = Math.max(box1.y, box2.y);
  const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
  const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

  const intersectionArea = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const box1Area = box1.width * box1.height;
  const box2Area = box2.width * box2.height;
  const unionArea = box1Area + box2Area - intersectionArea;

  if (unionArea === 0) return 0;
  return intersectionArea / unionArea;
}

// Function to filter out overlapping duplicates
function filterDuplicates(detections, iouThreshold = 0.45) {
  // 1. Sort detections by confidence score in descending order
  detections.sort((a, b) => b.score - a.score);

  const keptDetections = [];

  for (const candidate of detections) {
    let keep = true;

    for (const approved of keptDetections) {
      // Only filter if the boxes belong to the SAME class.
      // (If different components are allowed to overlap, keep this condition.
      // If you want to prevent ANY overlap regardless of class, remove this check.)
      if (candidate.classId === approved.classId) {
        const overlap = calculateIoU(candidate, approved);

        // If the overlap is higher than the threshold, discard the candidate
        if (overlap > iouThreshold) {
          keep = false;
          break;
        }
      }
    }

    if (keep) {
      keptDetections.push(candidate);
    }
  }

  return keptDetections;
}
