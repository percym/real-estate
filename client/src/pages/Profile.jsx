import React from 'react';
import {useSelector} from 'react-redux';
import {useRef,useState, useEffect} from 'react';
import {getStorage,ref,uploadBytesResumable } from 'firebase/storage';
import app from '../firebase';

export default function Profile() {

  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [file,setFile] = useState(undefined);
  console.log('fiera', file);

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload=(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100;
      console.log(' up load is at ', progress)
    },(error)=>{
      console.log(error);
    })
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center m7 '>Profile</h1>
    <form className='flex flex-col gap-4 '>
    <input onChange={(e)=>{setFile(e.target.files[0])}} type='file' ref={fileRef}  hidden accept='image/*'/>
    <img onClick={()=>{fileRef.current.click()}} className='self-center rounded-full h-24 w-24 object-cover hover:cursor-pointer'  src={currentUser.avatar} alt={currentUser.username} />
    <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username'/>
    <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email'/>
    <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
    <button  className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-90 disabled:opacity-80'> update</button>
    </form>
    <div className='flex justify-between mt-5'>
      <span className='text-red-700'>Delete account </span>
      <span className='text-red-700'>Sign out </span>
    </div>
    </div>
  )
}
