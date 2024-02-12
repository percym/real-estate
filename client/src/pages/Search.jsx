import React, { useState } from 'react'

export default function Search() {
    const [sideBarData, setSideBarData]= useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc'
    });
    console.log(sideBarData);
    const handleChange =(e)=>{
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id==='sale'){
            setSideBarData({...sideBarData,type:e.target.id});
        }

        if(e.target.id === 'searchTerm'){
            setSideBarData({...sideBarData, searchTerm: e.target.value});
        }

        if(e.target.id ==='parking' || e.target.id === 'furnished' || e.target.id ==='offer'){
            setSideBarData({...sideBarData, [e.target.id]:e.target.checked || e.target.checked === 'true'? true : false });
        }

        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({ ...sideBarData, sort, order });
        }
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 sm:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-8' >
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap'>Search Term:</label>
                        <input type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full' 
                            value={sideBarData.searchTerm}
                            onChange={handleChange}/>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label  className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='all' 
                                className='w-5' 
                                onChange={handleChange} 
                                checked={sideBarData.type ==='all'} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='rent' 
                                className='w-5'
                                onChange={handleChange} 
                                checked={sideBarData.type ==='rent'} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='sale' 
                                className='w-5'
                                onChange={handleChange} 
                                checked={sideBarData.type ==='sale'} />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='offer' 
                                className='w-5'
                                onChange={handleChange} 
                                checked={sideBarData.offer} />
                            <span>Offer</span>
                        </div> 
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities:</label>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='parking' 
                                className='w-5'
                                onChange={handleChange} 
                                checked={sideBarData.parking} />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input 
                                type='checkbox' 
                                id='furnished' 
                                className='w-5'
                                onChange={handleChange} 
                                checked={sideBarData.furnished}/>
                            <span>Furniture</span>
                        </div>
            
                    </div>
                    <div className=''>
                        <label>Sort:</label>
                        <select id='sort_order' className='border rounded-lg p-3'>
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option  value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
            </div>
        </div>
    )
}
