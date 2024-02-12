import React, { useEffect, useState } from 'react';
import { useParams , Link} from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');
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

  const onChange=async()=>{

  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p >Contact <span className='font-semibold'>{landlord.username }</span>
           for  <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
           <textarea 
            name="message" 
            id="message" 
            rows={2} 
            value={message} 
            onChange={onChange}
            className='w-full border p-3 rounded-lg'>
          </textarea>
          <Link 
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center uppercase rounded-lg hover:opacity-95'>
              Send message
          </Link>
        </div>
      )}
    </>
  )
}


