import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const params= useParams();

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
        console.log('data landlord= >',data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandLord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className=''>
          <p>Contact <span>{landlord.username}</span></p>
        </div>
      )}
    </>
  )
}


