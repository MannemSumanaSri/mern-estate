import React, { useState } from "react";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });

  // HANDLE TEXT + CHECKBOX INPUTS
  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // HANDLE IMAGE SELECTION
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // MAX 6 IMAGES
    if (selectedFiles.length + files.length > 6) {
      setImageUploadError("You can upload maximum 6 images");
      return;
    }

    setImageUploadError("");

    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);

    // CREATE PREVIEWS
    const previews = updatedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // DELETE IMAGE BEFORE UPLOAD
  const handleRemoveImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    setFiles(updatedFiles);

    const previews = updatedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // UPLOAD IMAGES
  const handleImageUpload = async () => {
    try {
      if (files.length === 0) {
        setImageUploadError("Please select images");
        return;
      }

      setUploading(true);
      setImageUploadError("");

      const data = new FormData();

      // APPEND ALL IMAGES
      files.forEach((file) => {
        data.append("images", file);
      });

      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setImageUploadError(result.message);
        setUploading(false);
        return;
      }

      setFormData({
        ...formData,
        imageUrls: result.imageUrls,
      });

      setUploading(false);

      alert("Images uploaded successfully!");
    } catch (error) {
      console.log(error);
      setImageUploadError("Image upload failed");
      setUploading(false);
    }
  };

  // CREATE LISTING
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length === 0) {
      alert("Please upload images first");
      return;
    }

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      alert("Listing created successfully!");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-6"
      >

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">

          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            required
            onChange={handleChange}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
          />

          {/* CHECKBOXES */}
          <div className="flex flex-wrap gap-6">

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={() =>
                  setFormData({
                    ...formData,
                    type: "sale",
                  })
                }
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                defaultChecked
                onChange={() =>
                  setFormData({
                    ...formData,
                    type: "rent",
                  })
                }
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>

          </div>

          {/* NUMBER INPUTS */}
          <div className="flex flex-wrap gap-6">

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min="1"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <div>
                <p>Discount Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 gap-4">

          <p className="font-semibold">
            Images:
            <span className="font-normal ml-2 text-gray-600">
              First image will be cover (max 6)
            </span>
          </p>

          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="p-3 border border-gray-300 rounded-lg"
          />

          
          {imageUploadError && (
            <p className="text-red-500 text-sm">
              {imageUploadError}
            </p>
          )}

         
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {imagePreviews.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg p-2 flex flex-col gap-2"
              >

                <img
                  src={image}
                  alt="preview"
                  className="h-32 w-full object-cover rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-600 text-white p-2 rounded-lg text-sm"
                >
                  Delete
                </button>

              </div>
            ))}

          </div>

          
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading}
            className="p-3 bg-green-700 text-white rounded-lg uppercase hover:opacity-95"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>

          
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-3">

              <h2 className="text-lg font-semibold">
                Uploaded Images
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {formData.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="uploaded"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                ))}

              </div>

            </div>
          )}

          
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95">
            Create Listing
          </button>

        </div>

      </form>
    </main>
  );
}
