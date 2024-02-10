import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUpLoadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);


  console.log('percentage', filePerc);
  console.log('fiera', file);
  console.log('formData', formData);
  console.log('file upload error ', fileUploadError);
  console.log('current user profile', currentUser);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        setFileUpLoadError(false);
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));

      }, (error) => {
        setFileUpLoadError(true);
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    )

  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData),
      });
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }

  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserStart(error.message));
    }
  };

  const handleUserSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        showListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      showListingsError(true);

    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center m7 '>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e) => { setFile(e.target.files[0]) }} type='file' ref={fileRef} accept='image/*' hidden />
        <img
          onClick={() => { fileRef.current.click() }}
          className='self-center rounded-full h-24 w-24 object-cover hover:cursor-pointer'
          src={formData.avatar || currentUser.avatar} alt={currentUser.username}
        />
        <p className='text-sm self-center text-pretty text-center'>
          {fileUploadError ?
            (<span className='text-red-700'>Error uploading image</span>) :
            (filePerc > 0 && filePerc < 100) ?
              (<span className='text-green-700'>{`Uploading  ${filePerc} % `}</span>) : filePerc === 100 ?
                (<span className='text-green-700'>Upload success</span>) : " "}
        </p>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange} />

        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange} />

        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange} />

        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-90 disabled:opacity-80'> {loading ? 'Loading...' : 'Update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:placeholder-opacity-95' to={'/create-listing'}>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleUserDelete} >Delete account </span>
        <span className='text-red-700 cursor-pointer' onClick={handleUserSignOut}>Sign out </span>
      </div>
      <p><span className='text-red-700 '>{error ? error : ''}</span></p>
      <p><span className='text-green-700 '>{updateSuccess ? 'User updated sucessfully' : ''}</span></p>
      <button onClick={handleShowListings} className='text-green-700 w-full' >Show Listings</button>
      <p><span className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : ''}</span></p>
      {userListings && userListings.length > 0 && 
      (<div className='flex flex-col gap-4'>
        <h1 className='text-center my-7 font-semibold text-2xl'>Your listings</h1>
         {userListings.map((listing) => (
        <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center  gap-4'>
          <Link to={`/listing/${listing._id}`}>
            <img
              src={listing.imageUrls[0]}
              alt='cover'
              className='h-16 w-16 object-contain rounded-lg' />
          </Link>
          <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
            <p >{listing.name}</p>
          </Link>
          <div className=' flex flex-col items-center'>
            <button className='text-red-700 uppercase'>Delete</button>
            <button className='text-green-700 uppercase'>Edit</button>
          </div>
        </div>
      ))
      
      }</div>)}
    </div>
  )
}
