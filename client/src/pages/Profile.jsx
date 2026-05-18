import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

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
import {Link} from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector(
    (state) => state.user
  );
const [userListings,setUserListings]=useState([]);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError,setShowListingsError]
 = useState(false);
  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // update user
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
            Authorization: `Bearer ${currentUser.token}`, // 🔥 FIX
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

  // delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // 🔥 FIX
          },
        }
      );

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());

      window.location.href = "/SignIn";
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

const handleShowListings=async()=>{
  try{
    setShowListingsError(false);
const res = await fetch(`/api/user/listings/${currentUser._id}`);
const data = await res.json();
if(data.success === false){
  setShowListingsError(true);
  return;
}
setUserListings(data);
  }catch(error){
    setShowListingsError(true);
  }
};

  // sign out user
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <img 
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
        Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>

        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>

      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully!" : ""}
      </p>

      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
    <p className="text-red-700">{showListingsError?'Error showing listings':''}</p>
    
    {userListings && userListings.length > 0 && (
  <div className="flex flex-col gap-4">
    <h1 className="text-center mt-7 text-2xl font-semibold">
      Your Listings</h1>
    {userListings.map((listing) => (
      <div
        key={listing._id}
        className="border rounded-lg p-3 flex justify-between items-center gap-4"
      >
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt="listing image"
            className="h-16 w-16 object-contain"
          />
        </Link>

        <Link
          className="flex-1 text-slate-700 font-semibold hover:underline truncate"
          to={`/listing/${listing._id}`}
        >
          <p>{listing.name}</p>
        </Link>

        <div className="flex flex-col items-center">
          <button className="text-red-700 uppercase">Delete</button>
          <button className="text-green-700 uppercase">Edit</button>
        </div>
      </div>
    ))}
  </div>
)}
    </div>
  );
}
