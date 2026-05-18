import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
const params=useParams();
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "",
    discountedPrice: "",
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  });


useEffect(()=>{
    const fetchListing=async()=>{
        const listingId=params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data=await res.json();
        if(data.success===false){
            console.log(data.message);
            return;
        }
        setFormData(data);
    }
    fetchListing();
},[])
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

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 6) {
      setImageUploadError("You can upload maximum 6 images");
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      setImageUploadError("Only image files are allowed");
      return;
    }

    setImageUploadError("");

    const updatedFiles = [...files, ...validFiles];

    setFiles(updatedFiles);

    const previews = updatedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);

    setFiles(updatedFiles);

    const previews = updatedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  const handleImageUpload = async () => {
    try {
      if (files.length === 0) {
        setImageUploadError("Please select images");
        return;
      }

      setUploading(true);
      setImageUploadError("");

      const data = new FormData();

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

      setFormData((prev) => ({
        ...prev,
        imageUrls: result.imageUrls,
      }));

      setUploading(false);

      alert("Images uploaded successfully!");
    } catch (error) {
      console.log(error);
      setImageUploadError("Image upload failed");
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (formData.name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    if (formData.description.trim().length < 10) {
      return "Description must be at least 10 characters";
    }

    if (formData.address.trim().length === 0) {
      return "Address is required";
    }

    if (Number(formData.bedrooms) < 1) {
      return "Bedrooms must be at least 1";
    }

    if (Number(formData.bathrooms) < 1) {
      return "Bathrooms must be at least 1";
    }

    if (
      formData.regularPrice === "" ||
      Number(formData.regularPrice) <= 0
    ) {
      return "Regular price must be greater than 0";
    }

    if (
      formData.offer &&
      (formData.discountedPrice === "" ||
        Number(formData.discountedPrice) <= 0)
    ) {
      return "Discount price must be greater than 0";
    }

    if (
      formData.offer &&
      Number(formData.discountedPrice) >=
        Number(formData.regularPrice)
    ) {
      return "Discount price must be less than regular price";
    }

    if (formData.imageUrls.length === 0) {
      return "Please upload images";
    }

    return "";
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setFormError("");

  const validationError = validateForm();
  if (validationError) {
    setFormError(validationError);
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/listing/update/${params.listingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }
    );

    const text = await res.text(); // 👈 IMPORTANT FIX

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error("Backend did not return valid JSON");
    }

    if (!res.ok) {
      setFormError(data.message || "Update failed");
      return;
    }

    

    navigate(`/listing/${data.listing?._id || params.listingId}`);
  } catch (error) {
    console.log(error);
    setFormError("Something went wrong");
  }
};

  return (
    <main className="p-3 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-6"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={formData.type === "sale"}
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
                checked={formData.type === "rent"}
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
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                value={formData.bedrooms}
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
                value={formData.bathrooms}
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
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="1"
                  max="100000"
                  required
                  value={formData.discountedPrice}
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                />
                <div>
                  <p>Discount Price</p>
                  <span className="text-xs">$ / month</span>
                </div>
              </div>
            )}
          </div>
        </div>

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
            disabled={uploading || files.length === 0}
            className={`p-3 text-white rounded-lg uppercase transition ${
              uploading || files.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:opacity-95"
            }`}
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

          {formError && (
            <p className="text-red-500 text-sm">
              {formError}
            </p>
          )}

          <button
            disabled={uploading}
            className={`p-3 text-white rounded-lg uppercase transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-700 hover:opacity-95"
            }`}
          >
            {uploading ? "Please wait..." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}