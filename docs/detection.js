let currentPredictions = {
  image: {
    width: 0,
    height: 0,
  },
  predictions: [
    // {
    //   "x": 0,
    //   "y": 0,
    //   "width": 0,
    //   "height": 0,
    //   "confidence": 0,
    //   "class": "",
    //   "class_id": 0,
    //   "id": ""
    // },
  ],
};

// supported classes
// names: ['IC', 'LED', 'battery', 'buzzer', 'capacitor', 'clock', 'connector', 'diode', 'display', 'fuse', 'inductor', 'potentiometer', 'relay', 'resistor', 'switch', 'transistor']
const refDesMap = new Map([
  ["resistor", "R"],
  ["capacitor", "C"],
  ["inductor", "L"],
  ["diode", "D"],
  ["LED", "D"],
]);

function mapApiPredictions(response) {
  return {
    image: response.image,
    predictions: response.predictions.map((p) => ({
      x: p.x,
      y: p.y,
      width: p.width,
      height: p.height,
      confidence: p.confidence,
      class: p.class,
      id: p.detection_id,
    })),
  };
}

async function runAutoDetect() {
  // const imgObj = bomImages.find(i => i.id === currentImgId);
  // const base64Img = (await blobToBase64(imgObj.blob)).split(',')[1];
  // console.log(base64Img);
  // fetch("https://serverless.roboflow.com/compdetect/7?api_key=7G4bZNDXmwZeCHh3zSwP", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  //   body: base64Img
  // }).then(function(response) {
  //   console.log(response.data);
  // })
  // .catch(function(error) {
  //   console.log(error.message);
  // });
  //
  try {
    const imgObj = bomImages.find(i => i.id === currentImgId);
    const base64Img = (await blobToBase64(imgObj.blob)).split(',')[1];

    const data = await fetch("https://serverless.roboflow.com/compdetect/7?api_key=7G4bZNDXmwZeCHh3zSwP", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: base64Img
    }).then((response) => response.json());

    // const data = await fetchStaticData();

    console.log(data);
    currentPredictions = mapApiPredictions(data);

    for (let pred of currentPredictions.predictions) {
      const containerEl = document.getElementById("map-content");
      const imgEl = containerEl.querySelector(".pcb-image");
      drawBoundingBox(pred, currentPredictions.image, imgEl, containerEl);
    }

    // hide button
    const btnRunAutoDetect = document.getElementById("btn-auto-detect");
    btnRunAutoDetect.classList.add("hidden");
    renderDetectionList(currentPredictions.predictions);
  } catch (err) {
    console.log(err);
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // FileReader finishes reading the blob
    reader.onloadend = () => resolve(reader.result);

    // Handle potential errors
    reader.onerror = reject;

    // Read the blob as a Data URL (which is base64 encoded)
    reader.readAsDataURL(blob);
  });
}

// Simulates an HTTP request fetching static JSON after a short delay
async function fetchStaticData() {
  return new Promise((resolve, reject) => {
    // Simulate a 1-second network latency
    setTimeout(() => {
      // Your static JSON payload
      const mockResponse = {
        inference_id: "74f21645-702d-4c84-b617-d66b70f5c822",
        time: 0.14384465804323554,
        image: { width: 3024, height: 4032 },
        predictions: [
          {
            x: 1598.0,
            y: 2554.5,
            width: 184.0,
            height: 291.0,
            confidence: 0.8722081184387207,
            class: "IC",
            class_id: 0,
            detection_id: "0fb18048-b34e-4f5c-91c0-4d455f735570",
          },
          {
            x: 1261.5,
            y: 1598.0,
            width: 181.0,
            height: 292.0,
            confidence: 0.8533809781074524,
            class: "IC",
            class_id: 0,
            detection_id: "cf4049a9-2563-4abb-912c-5928c57a5cf4",
          },
          {
            x: 892.5,
            y: 1590.5,
            width: 189.0,
            height: 287.0,
            confidence: 0.8415342569351196,
            class: "IC",
            class_id: 0,
            detection_id: "bdfee097-e1b1-4b08-8e8a-c4b542eb4023",
          },
          {
            x: 1640.0,
            y: 1600.5,
            width: 174.0,
            height: 279.0,
            confidence: 0.824837327003479,
            class: "IC",
            class_id: 0,
            detection_id: "bd45d6c1-0640-4880-91e9-28cb3af8dddb",
          },
          {
            x: 1789.0,
            y: 2352.0,
            width: 76.0,
            height: 62.0,
            confidence: 0.813991904258728,
            class: "resistor",
            class_id: 13,
            detection_id: "32743e3a-f700-4f5f-8201-3ddd5bffde30",
          },
          {
            x: 2019.0,
            y: 1612.0,
            width: 176.0,
            height: 284.0,
            confidence: 0.8079925179481506,
            class: "IC",
            class_id: 0,
            detection_id: "53682b7d-1108-4997-82d4-f526a8f23726",
          },
          {
            x: 690.5,
            y: 1382.0,
            width: 77.0,
            height: 60.0,
            confidence: 0.7539728283882141,
            class: "resistor",
            class_id: 13,
            detection_id: "a86d6331-dee9-45cf-8a60-7b2b94b1a4ec",
          },
          {
            x: 2171.5,
            y: 2553.5,
            width: 213.0,
            height: 199.0,
            confidence: 0.7316686511039734,
            class: "IC",
            class_id: 0,
            detection_id: "b367aa1e-2f67-4f54-8f4c-6c9b3722e4b3",
          },
          {
            x: 1785.0,
            y: 2636.5,
            width: 66.0,
            height: 55.0,
            confidence: 0.7088467478752136,
            class: "resistor",
            class_id: 13,
            detection_id: "16b396ab-f5f7-45a1-96cd-05f460fc10f2",
          },
          {
            x: 1790.0,
            y: 2450.0,
            width: 74.0,
            height: 62.0,
            confidence: 0.5513125658035278,
            class: "resistor",
            class_id: 13,
            detection_id: "376351a7-f5e0-462c-b320-a0c4e13fd8ef",
          },
          {
            x: 1778.0,
            y: 2744.0,
            width: 90.0,
            height: 66.0,
            confidence: 0.49486178159713745,
            class: "resistor",
            class_id: 13,
            detection_id: "9dd71b89-0dd9-46c2-8e6f-0171a1ed1201",
          },
          {
            x: 1965.0,
            y: 1816.5,
            width: 70.0,
            height: 61.0,
            confidence: 0.4679402709007263,
            class: "resistor",
            class_id: 13,
            detection_id: "eda085a1-dc3a-4f64-b483-4e6dda45ce3f",
          },
          {
            x: 1414.0,
            y: 2420.5,
            width: 70.0,
            height: 57.0,
            confidence: 0.4451841711997986,
            class: "resistor",
            class_id: 13,
            detection_id: "322100a5-e318-4b86-b79b-d0f37ef0f540",
          },
          {
            x: 1580.5,
            y: 1809.0,
            width: 73.0,
            height: 62.0,
            confidence: 0.42910438776016235,
            class: "resistor",
            class_id: 13,
            detection_id: "a21cf5d1-418e-40d3-9370-873be269a858",
          },
          {
            x: 681.5,
            y: 1500.5,
            width: 89.0,
            height: 85.0,
            confidence: 0.41646522283554077,
            class: "transistor",
            class_id: 15,
            detection_id: "223f7c09-e447-45eb-adc0-28b43b8c11bf",
          },
          {
            x: 924.0,
            y: 2465.0,
            width: 60.0,
            height: 56.0,
            confidence: 0.406192421913147,
            class: "resistor",
            class_id: 13,
            detection_id: "c7acfb03-c1fe-455c-a20b-1840a30c96e5",
          },
        ],
      };
      resolve(mockResponse);

      // Optionally simulate a network error instead:
      // reject(new Error("Internal Server Error"));
    }, 1000);
  });
}

function drawBoundingBox(
  detection,
  imageDimensions,
  imageElement,
  containerElement,
) {
  // 1. Calculate the scale factor if the displayed image is resized
  const apiWidth = imageDimensions.width; // 2378
  const apiHeight = imageDimensions.height; // 2134

  const scaleX = imageElement.clientWidth / apiWidth;
  const scaleY = imageElement.clientHeight / apiHeight;

  // 2. Adjust for Center vs Top-Left origin (Toggle isCenter based on your AI model)
  const isCenter = true;
  const rawX = isCenter ? detection.x - detection.width / 2 : detection.x;
  const rawY = isCenter ? detection.y - detection.height / 2 : detection.y;

  // 3. Create the box element
  const box = document.createElement("div");
  box.className = "detected-box";
  box.setAttribute("data-id", detection.id);

  // 4. Scale coordinates to match the currently displayed image size
  box.style.position = "absolute";
  box.style.left = rawX * scaleX + "px";
  box.style.top = rawY * scaleY + "px";
  box.style.width = detection.width * scaleX + "px";
  box.style.height = detection.height * scaleY + "px";

  // Optional: Add a small floating label for the class name (e.g., "IC - 92%")
  box.innerHTML = `
    <span class="box-label">
      ${detection.class} (${(detection.confidence * 100).toFixed(0)}%)
    </span>
  `;

  // Click event handler for the bounding box
  box.addEventListener("click", (event) => {
    // 1. Crucial: Stop the event from bubbling up to the viewport/map-content click handler
    event.stopPropagation();

    // 2. Focus and highlight the corresponding sidebar card
    focusSidebarCard(detection.id);
  });

  containerElement.appendChild(box);
}

async function persistPredictions() {
  const refCountStart = new Map([
    ["R", -1],
    ["C", -1],
    ["L", -1],
    ["D", -1],
    ["Q", -1],
  ]);

  const componentList = [];

  for (let pred of currentPredictions.predictions) {
    if (pred.state === "ignore") {
      continue;
    }

    // use "Q" as a catch-all reference designator
    const refDes = refDesMap.get(pred.class) ?? "Q";
    if (refCountStart.get(refDes) < 0) {
      const refCount = Math.max(
        bomData
          .filter((comp) => comp.label.startsWith(refDes))
          .map((comp) => parseInt(comp.label.slice(1)) || 0),
      );
      refCountStart.set(refDes, refCount + 1);
    }

    const refDesCount = refCountStart.get(refDes);
    const newComp = {
      id: uuid(),
      boardId: currentBomId,
      label: `${refDes}${refDesCount}`,
      value: "",
      desc: "",
      x: pred.x,
      y: pred.y,
      imgId: currentImgId,
    };
    // increment reference designator count
    refCountStart.set(refDes, refDesCount + 1);

    componentList.push(newComp);
  }
  await db.addComponents(componentList);
  await loadProjectData();
  switchView("list");

  toggleDetectionSidebar()
  document.getElementById("btn-add-to-bom").disabled = true;
}

// === UI FUNCTIONS ===

function toggleDetectionSidebar() {
  document.getElementById("cv-sidebar").classList.toggle("hidden");
}

// Function to render the list to the sidebar
function renderDetectionList(list) {
  const listContainer = document.getElementById("detection-list");
  listContainer.innerHTML = ""; // Clear previous items

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = `detection-card ${item.state ? "state-" + item.state : ""}`;
    card.setAttribute("data-id", item.id);

    // Let the user click the card to highlight/focus the component bounding box on the image canvas
    card.addEventListener("click", (e) => {
      // Only trigger card click if they didn't click one of the state buttons
      if (!e.target.classList.contains("state-btn")) {
        focusComponentOnCanvas(item.id);
      }
    });

    card.innerHTML = `
            <div class="detection-body">
                <div class="detection-header-row">
                    <span class="detection-class">${item.class}</span>
                    <span class="detection-confidence">${Math.round(item.confidence * 100)}%</span>
                </div>
                <!-- <p class="detection-meta">Package: ${item.package} | Pos: X:${item.x}, Y:${item.y}</p> -->
                <p class="detection-meta">Pos: X:${item.x}, Y:${item.y}</p>
            </div>
            <div class="state-selector">
                <button class="state-btn btn-ok">OK</button>
                <button class="state-btn btn-ignore">Ignore</button>
                <!-- <button class="state-btn btn-remove">Remove</button> -->
            </div>
        `;

    // Attach event listeners to the buttons programmatically
    card
      .querySelector(".btn-ok")
      .addEventListener("click", () => updateState(item.id, "ok"));
    card
      .querySelector(".btn-ignore")
      .addEventListener("click", () => updateState(item.id, "ignore"));
    // card
    //   .querySelector(".btn-remove")
    //   .addEventListener("click", () => updateState(item.id, "remove"));

    listContainer.appendChild(card);
  });
}

function focusSidebarCard(id) {
  // Find the corresponding card in the sidebar
  const targetCard = document.querySelector(`.detection-card[data-id="${id}"]`);
  const sidebarContent = document.querySelector(".cv-sidebar-content");

  if (targetCard && sidebarContent) {
    // 1. Find ONLY the currently highlighted card (if one exists) and remove the class
    const currentCard = document.querySelector(
      ".detection-card.selected-highlight",
    );
    if (currentCard) {
      currentCard.classList.remove("selected-highlight");
    }

    // Add highlight class to our target card
    targetCard.classList.add("selected-highlight");

    // Smoothly scroll the sidebar to bring the card into view
    targetCard.scrollIntoView({
      behavior: "smooth",
      block: "nearest", // Ensures it scrolls just enough to be visible
    });
  }
}

// Function to handle state switching
function updateState(id, newState) {
  const item = currentPredictions.predictions.find((d) => d.id === id);
  if (!item) return;

  // Toggle logic: If clicking the active state again, reset to neutral (null)
  if (item.state === newState) {
    item.state = null;
  } else {
    item.state = newState;
  }

  // Refresh only the visual element to avoid losing DOM focus
  const cardElement = document.querySelector(
    `.detection-card[data-id="${id}"]`,
  );
  if (cardElement) {
    cardElement.className = "detection-card"; // Reset classes
    if (item.state) {
      cardElement.classList.add(`state-${item.state}`);
    }
  }

  // Optional: Synchronize this state with the canvas overlay.
  // E.g., change the color of the bounding box on the image to match the sidebar state.
  updateCanvasBoundingBoxColor(id, item.state);

  // check if all components have a set state
  const btn = document.getElementById("btn-add-to-bom");

  disableBtn = false;
  for (let i in currentPredictions.predictions) {
    if (currentPredictions.predictions[i] === id) {
      currentPredictions.predictions[i].state = newState;
      continue;
    }

    // disable btn if some prediction is still pending assignment
    const predState = currentPredictions.predictions[i].state ?? "";
    if (predState === "") {
      disableBtn = true;
    }
  }
  btn.disabled = disableBtn;
}

// Placeholder helper functions for your Canvas interactions
function focusComponentOnCanvas(id) {
  console.log(`Centering/Zooming on bounding box: ${id}`);

  const prediction = currentPredictions.predictions.find((d) => d.id === id);

  centerOnComponent(prediction);
}

function centerOnComponent(bbox) {
  const viewport = document.getElementById("map-viewport");
  if (!viewport) return;

  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;

  // 1. Calculate the center point of the component on the original image
  // const compCenterX = bbox.x + bbox.width / 2;
  // const compCenterY = bbox.y + bbox.height / 2;
  const compCenterX = bbox.x;
  const compCenterY = bbox.y;

  // 2. Define target zoom level
  // You can keep the current scale, or define a comfortable inspection scale (e.g., 1.5)
  const targetScale = Math.max(mapState.scale, 1.2);

  // 3. Apply the centering formula
  mapState.scale = targetScale;
  mapState.x = vw / 2 - compCenterX * targetScale;
  mapState.y = vh / 2 - compCenterY * targetScale;
  mapState.isDragging = false;

  // 4. Update the visual transform
  updateTransform();
}

function updateCanvasBoundingBoxColor(id, state) {
  console.log(
    `Changing bounding box color for ${id} to represent state: ${state}`,
  );
  const box = document.querySelector(`.detected-box[data-id="${id}"`);
  box.classList.remove("state-ok", "state-ignore");
  box.classList.add("state-" + state);
}
