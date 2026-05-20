import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
export default function CreateListing() {

  const navigate = useNavigate();
  const params =useParams();

  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [uploading, setUploading] =
    useState(false);

  const [imageUploadError, setImageUploadError] =
    useState("");

  const [formError, setFormError] =
    useState("");

  const [formData, setFormData] = useState({

    name: "",
    description: "",
    address: "",

    type: "rent",

    propertyCategory: "apartment",

    bedrooms: 1,
    bathrooms: 1,

    regularPrice: "",
    discountPrice: "",

    parking: false,
    furnished: false,
    offer: false,

    imageUrls: [],

    // PLOT FEATURES
    dtcpApproved: false,
    cornerPlot: false,
    gatedCommunity: false,
    blackTopRoads: false,

    // FARM LAND FEATURES
    borewell: false,
    waterFacility: false,
    roadAccess: false,
    fertileSoil: false,
    fencing: false,

    // COMMERCIAL FEATURES
    mainRoadFacing: false,
    liftFacility: false,
    commercialParking: false,

  });

  useEffect(()=>{
    const fetchListing=async()=>{
      const listingId=params.listingId;
      const res=await fetch(`/api/listing/get/${listingId}`);
      const data=await res.json();
      if(data.success===false){
        console.log(data.message);
        return;
      }
      setFormData(data);

    }
    fetchListing();
  },[]);

  // HANDLE CHANGE

  const handleChange = (e) => {

    const {
      id,
      value,
      checked,
      type,
    } = e.target;

    // AUTO DETECT PROPERTY TYPE

    if (id === "name") {

      const lowerValue =
        value.toLowerCase();

      let detectedCategory =
        "apartment";

      if (
        lowerValue.includes("farm") ||
        lowerValue.includes("agriculture")
      ) {

        detectedCategory =
          "farmLand";
      }

      else if (
        lowerValue.includes("plot") ||
        lowerValue.includes("land")
      ) {

        detectedCategory =
          "plot";
      }

      else if (
        lowerValue.includes("villa")
      ) {

        detectedCategory =
          "villa";
      }

      else if (
        lowerValue.includes("commercial") ||
        lowerValue.includes("office") ||
        lowerValue.includes("shop")
      ) {

        detectedCategory =
          "commercial";
      }

      setFormData({
        ...formData,
        name: value,
        propertyCategory:
          detectedCategory,
      });

      return;
    }

    if (type === "checkbox") {

      setFormData({
        ...formData,
        [id]: checked,
      });

    } else {

      setFormData({
        ...formData,
        [id]: value,
      });

    }
  };

  // IMAGE CHANGE

  const handleImageChange = (e) => {

    const selectedFiles =
      Array.from(e.target.files);

    if (
      selectedFiles.length +
        files.length >
      6
    ) {

      setImageUploadError(
        "You can upload maximum 6 images"
      );

      return;
    }

    const validFiles =
      selectedFiles.filter(
        (file) =>
          file.type.startsWith(
            "image/"
          )
      );

    if (
      validFiles.length !==
      selectedFiles.length
    ) {

      setImageUploadError(
        "Only image files are allowed"
      );

      return;
    }

    setImageUploadError("");

    const updatedFiles = [
      ...files,
      ...validFiles,
    ];

    setFiles(updatedFiles);

    const previews =
      updatedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setImagePreviews(previews);
  };

  // REMOVE IMAGE

  const handleRemoveImage = (
    index
  ) => {

    const updatedFiles =
      files.filter(
        (_, i) => i !== index
      );

    setFiles(updatedFiles);

    const previews =
      updatedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setImagePreviews(previews);

    // REMOVE UPLOADED IMAGE ALSO

    const updatedUrls =
      formData.imageUrls.filter(
        (_, i) => i !== index
      );

    setFormData({
      ...formData,
      imageUrls: updatedUrls,
    });
  };

  // CLOUDINARY UPLOAD

  const handleImageUpload =
    async () => {

      try {

        if (files.length === 0) {

          setImageUploadError(
            "Please select images"
          );

          return;
        }

        setUploading(true);

        setImageUploadError("");

        const uploadedUrls = [];

        for (
          let i = 0;
          i < files.length;
          i++
        ) {

          const data =
            new FormData();

          data.append(
            "file",
            files[i]
          );

          data.append(
            "upload_preset",
            "mern_estate"
          );

          data.append(
            "cloud_name",
            "dsqxlhbnv"
          );

          const res =
            await fetch(
              "https://api.cloudinary.com/v1_1/dsqxlhbnv/image/upload",
              {
                method: "POST",
                body: data,
              }
            );

          const uploadedImage =
            await res.json();

          console.log(
            uploadedImage
          );

          if (
            uploadedImage.secure_url
          ) {

            uploadedUrls.push(
              uploadedImage.secure_url
            );

          } else {

            setImageUploadError(
              "Cloudinary upload failed"
            );

            setUploading(false);

            return;
          }
        }

        setFormData((prev) => ({
          ...prev,

          imageUrls: [
            ...prev.imageUrls,
            ...uploadedUrls,
          ],
        }));

        setUploading(false);

        alert(
          "Images uploaded successfully!"
        );

      } catch (error) {

        console.log(error);

        setImageUploadError(
          "Image upload failed"
        );

        setUploading(false);

      }
    };

  // VALIDATION

  const validateForm = () => {

    if (
      formData.name.trim()
        .length < 3
    ) {

      return "Name must be at least 3 characters";
    }

    if (
      formData.description
        .trim().length < 10
    ) {

      return "Description must be at least 10 characters";
    }

    if (
      formData.address.trim()
        .length === 0
    ) {

      return "Address is required";
    }

    if (
      Number(
        formData.regularPrice
      ) <= 0
    ) {

      return "Regular price must be greater than 0";
    }

    if (
      formData.offer &&
      Number(
        formData.discountPrice
      ) >=
        Number(
          formData.regularPrice
        )
    ) {

      return "Discount price must be less than regular price";
    }

    if (
      formData.imageUrls
        .length === 0
    ) {

      return "Please upload images";
    }

    return "";
  };

  // SUBMIT

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

    const text = await res.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.log("Non-JSON response from server:", text);
    }

    console.log("UPDATE RESPONSE:", data);

    if (!res.ok) {
      setFormError(data?.message || "Update failed");
      return;
    }

    alert("Listing updated successfully!");

    navigate(`/listing/${params.listingId}`);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    setFormError("Something went wrong");
  }
};

  return (

    <main className="p-3 max-w-6xl mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-6"
      >

        {/* LEFT */}

        <div className="flex flex-col gap-4 flex-1">

          <input
            type="text"
            placeholder="Property Name"
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
            value={
              formData.description
            }
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

          {/* PROPERTY CATEGORY */}

          <div className="flex flex-col gap-2">

            <p className="font-semibold">
              Property Category
            </p>

            <select
              id="propertyCategory"
              className="border p-3 rounded-lg"
              value={
                formData.propertyCategory
              }
              onChange={handleChange}
            >

              <option value="apartment">
                Apartment
              </option>

              <option value="villa">
                Villa
              </option>

              <option value="house">
                House
              </option>

              <option value="plot">
                Plot
              </option>

              <option value="farmLand">
                Farm Land
              </option>

              <option value="commercial">
                Commercial
              </option>

            </select>

          </div>

          {/* TYPE */}

          <div className="flex flex-wrap gap-6">

            <div className="flex gap-2">

              <input
                type="checkbox"
                className="w-5"
                checked={
                  formData.type ===
                  "sale"
                }
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
                className="w-5"
                checked={
                  formData.type ===
                  "rent"
                }
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
                checked={
                  formData.parking
                }
                onChange={handleChange}
              />

              <span>Parking</span>

            </div>

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={
                  formData.furnished
                }
                onChange={handleChange}
              />

              <span>Furnished</span>

            </div>

            <div className="flex gap-2">

              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={
                  formData.offer
                }
                onChange={handleChange}
              />

              <span>Offer</span>

            </div>

          </div>

          {/* APARTMENT FEATURES */}

          {(formData.propertyCategory ===
            "apartment" ||

            formData.propertyCategory ===
              "villa" ||

            formData.propertyCategory ===
              "house") && (

            <div className="flex flex-wrap gap-6">

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  value={
                    formData.bedrooms
                  }
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
                  value={
                    formData.bathrooms
                  }
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                />

                <p>Baths</p>

              </div>

            </div>
          )}

          {/* PLOT FEATURES */}

          {formData.propertyCategory ===
            "plot" && (

            <div className="border rounded-lg p-4 flex flex-col gap-3">

              <h2 className="font-semibold text-lg">
                Plot Features
              </h2>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="dtcpApproved"
                  checked={
                    formData.dtcpApproved
                  }
                  onChange={
                    handleChange
                  }
                />

                DTCP Approved

              </label>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="cornerPlot"
                  checked={
                    formData.cornerPlot
                  }
                  onChange={
                    handleChange
                  }
                />

                Corner Plot

              </label>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="gatedCommunity"
                  checked={
                    formData.gatedCommunity
                  }
                  onChange={
                    handleChange
                  }
                />

                Gated Community

              </label>

            </div>
          )}

          {/* FARM FEATURES */}

          {formData.propertyCategory ===
            "farmLand" && (

            <div className="border rounded-lg p-4 flex flex-col gap-3">

              <h2 className="font-semibold text-lg">
                Farm Land Features
              </h2>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="borewell"
                  checked={
                    formData.borewell
                  }
                  onChange={
                    handleChange
                  }
                />

                Borewell

              </label>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="waterFacility"
                  checked={
                    formData.waterFacility
                  }
                  onChange={
                    handleChange
                  }
                />

                Water Facility

              </label>

              <label className="flex gap-2">

                <input
                  type="checkbox"
                  id="roadAccess"
                  checked={
                    formData.roadAccess
                  }
                  onChange={
                    handleChange
                  }
                />

                Road Access

              </label>

            </div>
          )}

          {/* PRICE */}

          <div className="flex flex-wrap gap-6">

            <div className="flex items-center gap-2">

              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                value={
                  formData.regularPrice
                }
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />

              <div>

                <p>
                  Regular Price
                </p>

                <span className="text-xs">

                  {formData.type ===
                  "rent"
                    ? "₹/month"
                    : "₹"}

                </span>

              </div>

            </div>

            {formData.offer && (

              <div className="flex items-center gap-2">

                <input
                  type="number"
                  id="discountPrice"
                  min="1"
                  required
                  value={
                    formData.discountPrice
                  }
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                />

                <div>

                  <p>
                    Discount Price
                  </p>

                  <span className="text-xs">

                    {formData.type ===
                    "rent"
                      ? "₹/month"
                      : "₹"}

                  </span>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* RIGHT */}

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
            onChange={
              handleImageChange
            }
            className="p-3 border border-gray-300 rounded-lg"
          />

          {imageUploadError && (

            <p className="text-red-500 text-sm">

              {imageUploadError}

            </p>
          )}

          {/* PREVIEW */}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {imagePreviews.map(
              (
                image,
                index
              ) => (

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
                    onClick={() =>
                      handleRemoveImage(
                        index
                      )
                    }
                    className="bg-red-600 text-white p-2 rounded-lg text-sm"
                  >

                    Delete

                  </button>

                </div>
              )
            )}

          </div>

          {/* UPLOAD */}

          <button
            type="button"
            onClick={
              handleImageUpload
            }
            disabled={
              uploading ||
              files.length === 0
            }
            className={`p-3 text-white rounded-lg uppercase transition ${
              uploading ||
              files.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:opacity-95"
            }`}
          >

            {uploading
              ? "Uploading..."
              : "Upload Images"}

          </button>

          {/* UPLOADED */}

          {formData.imageUrls
            .length > 0 && (

            <div className="flex flex-col gap-3">

              <h2 className="text-lg font-semibold">
                Uploaded Images
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                {formData.imageUrls.map(
                  (
                    url,
                    index
                  ) => (

                    <img
                      key={index}
                      src={url}
                      alt="uploaded"
                      className="h-32 w-full object-cover rounded-lg"
                    />

                  )
                )}

              </div>

            </div>
          )}

          {formError && (

            <p className="text-red-500 text-sm">

              {formError}

            </p>
          )}

          {/* SUBMIT */}

          <button
            disabled={uploading}
            className={`p-3 text-white rounded-lg uppercase transition ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-700 hover:opacity-95"
            }`}
          >

            {uploading
              ? "Please wait..."
              : "Update Listing"}

          </button>

        </div>

      </form>

    </main>
  );
}