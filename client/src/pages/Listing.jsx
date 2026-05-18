import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact,setContact]=useState(false);
  const currentUser=useSelector((state)=>state.user.currentUser);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white">

      {loading && (
        <p className="text-center text-xl mt-10">Loading...</p>
      )}

      {error && (
        <p className="text-center text-xl mt-10">Something went wrong</p>
      )}

      {listing && (
        <>

          {/* ================= HEADER IMAGE ================= */}
          <div className="relative w-full">

            <Swiper navigation modules={[Navigation]}>
              {listing.imageUrls?.map((url) => (
                <SwiperSlide key={url}>
                  <div className="w-full h-[45vh] sm:h-[50vh] md:h-[55vh]">
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* COPY LINK BUTTON */}
            <button
              onClick={handleCopyLink}
              className="absolute top-4 right-4 z-50 bg-white shadow-lg hover:bg-gray-100 p-3 rounded-full text-xl"
              title="Copy Link"
            >
              ⤴
            </button>

            {/* COPIED MESSAGE */}
            {copied && (
              <div className="absolute top-4 right-16 z-50 bg-black text-white px-3 py-1 rounded-md text-sm">
                Link copied!
              </div>
            )}
          </div>

          {/* ================= CONTENT ================= */}
          <div className="max-w-6xl mx-auto p-4 sm:p-6">

            {/* TITLE */}
            <h1 className="text-xl sm:text-2xl font-semibold">
              {listing.name} - $ {listing.regularPrice} / month
            </h1>

            {/* LOCATION */}
            <p className="text-gray-500 mt-1">
              📍 {listing.address}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                For {listing.type === "rent" ? "Rent" : "Sale"}
              </span>

              {listing.offer && (
                <span className="bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                  Discount Available
                </span>
              )}
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-700 leading-relaxed">
              <span className="font-semibold">Description - </span>
              {listing.description}
            </p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-700">

              <span>🛏 {listing.bedrooms} Beds</span>
              <span>🛁 {listing.bathrooms} Baths</span>
              <span>🚗 {listing.parking ? "Parking" : "No parking"}</span>
              <span>🪑 {listing.furnished ? "Furnished" : "Not furnished"}</span>

            </div>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
  <button
    onClick={() => setContact(true)}
    className="w-full mt-6 bg-slate-800 text-white py-3 rounded-md hover:opacity-90"
  >
    CONTACT LANDLORD
  </button>
)}

{contact && <Contact listing={listing} />}

          </div>
        </>
      )}
    </div>
  );
}