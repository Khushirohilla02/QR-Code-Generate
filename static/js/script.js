const urlInput = document.getElementById("urlInput");
const generateBtn = document.getElementById("generateBtn");
const qrContainer = document.getElementById("qrContainer");
const errorMessage = document.getElementById("errorMessage");
    generateBtn.addEventListener("click", async function () {
    const url = urlInput.value.trim();
      qrContainer.innerHTML = "";
      errorMessage.textContent = "";
      if (!url) {
         errorMessage.textContent =
          Swal.fire({
         title: "Alert",
        text: "Enter URL to generate QR Code",
         icon: "warning"
});
         return;
      }
       generateBtn.disabled = true;
        generateBtn.textContent = "Generating...";
 try {
    const response = await fetch("/qr", {
    method: "POST",headers: {
        "Content-Type": "application/json"
    },
     body: JSON.stringify({
        url: url
    })
});
   if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
} 
const imageBlob = await response.blob();
const imageURL = URL.createObjectURL(imageBlob);
const img = document.createElement("img");

img.src = imageURL;
img.className = "w-64 h-64 mt-4";

qrContainer.appendChild(img);
const message = document.createElement("p");
message.textContent = "QR Code Generated Successfully!";
message.className ="text-green-600 font-semibold mt-4";
    qrContainer.appendChild(message);
}

catch (error) {
    errorMessage.textContent = error.message;
}

finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate QR Code";
 }
});
