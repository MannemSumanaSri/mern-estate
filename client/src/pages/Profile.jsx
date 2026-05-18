import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const [userListings, setUserListings] = useState([]);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // UPDATE USER
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // DELETE USER
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      window.location.href = "/signin";
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // GET LISTINGS
  const handleShowListings = async () => {
  try {
    console.log("clicked");

    setShowListingsError(false);

    const res = await fetch(
      `/api/user/listings/${currentUser._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentUser.token || ""}`,
        },
      }
    );

    const data = await res.json();
    console.log(data);

    if (!res.ok || data.success === false) {
      setShowListingsError(true);
      return;
    }

    setUserListings(data);
  } catch (error) {
    console.log(error);
    setShowListingsError(true);
  }
};
  // SIGN OUT
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      await fetch("/api/auth/signout");

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleListingDelete=async(listingId)=>{
    try{
      const res=await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev)=>
        prev.filter((listing)=>listing._id !== listingId)
    );
    }catch(error){
      console.log(error.message);
      
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          className="h-24 w-24 rounded-full self-center"
        />

        <input
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="border p-3"
        />

        <input
          id="password"
          type="password"
          onChange={handleChange}
          className="border p-3"
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3"
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <Link
          to="/create-listing"
          className="bg-green-700 text-white p-3 text-center"
        >
          Create Listing
        </Link>
      </form>

      {/* ACTIONS */}
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">
          Delete
        </span>

        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>

      {/* ERROR */}
      <p className="text-red-700">{error}</p>

      <button onClick={handleShowListings} className="text-green-700 w-full mt-5">
        Show Listings
      </button>

      <p className="text-red-700">
        {showListingsError && "Error loading listings"}
      </p>

      {/* LISTINGS */}
      {userListings?.length > 0 && (
        <div className="flex flex-col gap-4 mt-5">
          <h2 className="text-xl font-semibold">Your Listings</h2>

          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border p-3 flex justify-between items-center"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls?.[0]}
                  className="h-16 w-16 object-cover"
                />
              </Link>

              <Link to={`/listing/${listing._id}`} className="flex-1 ml-3">
                {listing.name}
              </Link>

              <div className="flex flex-col">
                <button onClick={()=>handleListingDelete(listing._id)} 
                className="text-red-700">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
