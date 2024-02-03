import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage';
import React from 'react';
import { useState } from 'react';
import app from '../firebase';

export default function CreateListing() {
    const [files,setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls:[],

    });
    console.log(formData);
    const handleImageSubmit=()=>{
        if(files.length > 0 && files.length < 7){
            const promises = [];

            for(let i=0 ; i < files.length ; i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
               setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)});     
            });
        }
    }

    const storeImage = async (file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().time + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "stateChanged",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
                    console.log(`upload progress  ${progress}`);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        resolve(downloadUrl);
                    });
                }
            );

        });
    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a listing </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1 '>
                    <input
                        type="text"
                        placeholder='Name'
                        className='border p-3 rounded-bg'
                        id='name'
                        maxLength={62}
                        minLength={10}
                        required />
                    <textarea
                        type="text"
                        placeholder='Description'
                        className='border p-3 rounded-bg'
                        id='description'
                        required />
                    <input
                        type="text"
                        placeholder='Address'
                        className='border p-3 rounded-bg'
                        id='address'
                        required />
                    <div className='flex gap-6 flex-wrap' >
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' />
                            <span>Rent</span>

                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <input  className='p-3 border-gray-300 rounded-lg' type='number' id='bedrooms' min='1' max='10' required/>
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input  className='p-3 border-gray-300 rounded-lg' type='number' id='bathrooms' min='1' max='10' required/>
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input  className='p-3 border-gray-300 rounded-lg' type='number' id='regularPrice' min='1' max='5' required/>
                           <div className='flex flex-col items-center'>
                           <p>Regular Price</p>
                           <span className='text-xs'>($ / month)</span>
                            </div> 
                        </div>
                        <div className='flex items-center gap-2'>
                            <input  className='p-3 border-gray-300 rounded-lg' type='number' id='discountedPrice' min='1' max='5' required/>
                           <div className='flex flex-col items-center'>
                           <p>Discounted Price</p>
                           <span className='text-xs'>($ / month)</span>
                            </div> 
                        </div>
                     
                    </div>
                </div>
                <div className='flex flex-col gap-4 flex-1'>
                    <p className='font-semibold'>Images:</p>
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span>
                    <div className='flex gap-4'>
                        <input  onChange={(e)=>{setFiles(e.target.files)}} className='p-3 border border-gray-300 rounded w-full'
                             type='file' id='images' accept='images/*' multiple />
                        <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700  rounded uppercase border border-green-700 hover:shadow-lg disabled:opacity-80'>Upload</button>
                    </div>
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80'>Create Listing</button>
                </div>
                
            </form>
        </main>
    )
}
