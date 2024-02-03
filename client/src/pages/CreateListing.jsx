
import React from 'react';
import { useState } from 'react';
import app from '../firebase';
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage';

export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,

    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
console.log('formData => ', formData.imageUrls)
    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            setUploading(true);
            setImageUploadError(false);

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed (2mb max image size)');
                setUploading(false);
            });

        } else {
            setImageUploadError('Too many image files');
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "stateChanged",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload progress  ${progress}`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            );

        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, imageUrls: formData.imageUrls.filter((url, i) => i !== index)
        })

    };
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
                            <input className='p-3 border-gray-300 rounded-lg' type='number' id='bedrooms' min='1' max='10' required />
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border-gray-300 rounded-lg' type='number' id='bathrooms' min='1' max='10' required />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border-gray-300 rounded-lg' type='number' id='regularPrice' min='1' max='5' required />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border-gray-300 rounded-lg' type='number' id='discountedPrice' min='1' max='5' required />
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
                        <input onChange={(e) =>  setFiles(e.target.files) } className='p-3 border border-gray-300 rounded w-full'
                            type='file' id='images' accept='images/*' multiple />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 
                        rounded uppercase border 
                        border-green-700 hover:shadow-lg 
                        disabled:opacity-80'>
                            {uploading ? 'uploading' : 'upload'}</button>
                    </div>
                   
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, index)=>(
                        <div className='flex justify-between p-3 border items-center' key={url}>
                            <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                            <button onClick={() => { handleRemoveImage(index) }} type='button' className='text-red-700 rounded-lg hover:opacity-75'>Delete</button>
                        </div>
                        
                        ))
                     
                    }
                     <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:placeholder-opacity-95 disabled:placeholder-opacity-80'>Create Listing</button>
                </div>

            </form>
        </main>
    )
}
