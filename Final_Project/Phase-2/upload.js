const bucketName = "your-bucket-name";
const region = "us-east-1";
const folder = "wp-uploads/";

// Static Website Hosting endpoint:
const baseURL = `http://${bucketName}.s3-website-${region}.amazonaws.com/${folder}`;

// Direct S3 PUT URL (must allow public PUT in bucket policy)
const uploadBaseURL = `https://${bucketName}.s3.${region}.amazonaws.com/${folder}`;

function uploadImages() {
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("uploadStatus");
  status.innerHTML = "";

  if (!files.length) {
    status.innerHTML = "<p>No files selected.</p>";
    return;
  }

  [...files].forEach(file => {
    const uploadURL = `${uploadBaseURL}${file.name}`;
    fetch(uploadURL, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file
    }).then(res => {
      if (res.ok) {
        status.innerHTML += `<p>✅ Uploaded: ${file.name}</p>`;
      } else {
        status.innerHTML += `<p>❌ Failed: ${file.name}</p>`;
      }
    }).catch(err => {
      status.innerHTML += `<p>⚠️ Error uploading ${file.name}: ${err}</p>`;
    });
  });

  // Refresh gallery after a short delay
  setTimeout(loadGallery, 2000);
}

function loadGallery() {
  const galleryDiv = document.getElementById("gallery");
  galleryDiv.innerHTML = "";

  // You must manually maintain a file like image-list.json with image names
  fetch(`${baseURL}image-list.json`)
    .then(res => res.json())
    .then(data => {
      data.images.forEach(imgName => {
        const img = document.createElement("img");
        img.src = `${baseURL}${imgName}`;
        img.alt = imgName;
        galleryDiv.appendChild(img);
      });
    })
    .catch(err => {
      galleryDiv.innerHTML = `<p>Could not load images. Please make sure image-list.json exists and is public.</p>`;
      console.error("Image list fetch error:", err);
    });
}

loadGallery();
