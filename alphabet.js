const URL = "model/alphabet-model/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "alphabetModel.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(300, 225, true);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam").appendChild(webcam.canvas);
  webcam.canvas.classList.add("camera-canvas");
  labelContainer = document.getElementById("prediction");
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  // Get the best prediction
  const best = prediction.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  // Confidence threshold (e.g., 85%)
  const threshold = 0.75;

  if (best.probability >= threshold) {
    labelContainer.innerText =
      `Detected: ${best.className} (${(best.probability * 100).toFixed(1)}%)`;
  } else {
    labelContainer.innerText = "No sign detected";
  }
}

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

init();

document.querySelector(".tips-toggle").addEventListener("click", function () {
  const tips = document.querySelector(".tips-content");
  tips.style.display = tips.style.display === "block" ? "none" : "block";
});