import { useSelector } from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {

  const { currentUser, loading, error } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

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
          },
          credentials: "include",
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
          credentials: "include",
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
const handleSignOut = async() =>{
  try{
    dispatch(signOutUserStart())
    const res = await fetch('/api/auth/signout');
    const data = await res.json();
    if(data.success===false){
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data.message));
  }catch(error){
    dispatch(deleteUserFailure(data.message));
  }
}
  return (
    <div className="p-3 max-w-lg mx-auto">

      <h1 className="text-3xl font-semibold text-center my-7">
        Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

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

      </form>

      <div className="flex justify-between mt-5">

        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>

        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>

      </div>

      <p className="text-red-700 mt-5">
        {error ? error : ""}
      </p>

      <p className="text-green-700 mt-5">
        {updateSuccess
          ? "User updated successfully!"
          : ""}
      </p>

    </div>
  );
}
