import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css';

export default function Listing() {
    SwiperCore.use(Navigation);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        try {
            setLoading(true)
            const fetchListing = async () => {
                const res = await fetch(`/api/listing/get/${params.id}`);
                const data = await res.json();
                if (data.success === false) {
                    return;
                }
                console.log('data listing =>', data)
                setListing(data);
                setLoading(false);
            }
            fetchListing();
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    },[params.listingId])
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>..loading  </p>}
            {error && <p className='text-center my-7 text-2xl'>Listing fetch error  </p>}
            {listing && !error && !loading && 
                <div>
                <Swiper navigation>
                    {listing.imageUrls.map((url) =>(
                        <SwiperSlide key={url}>
                           <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`,backgroundSize:'cover'}}>

                           </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                </div>
            }
            </main>
      
    )
}
