import React, { useState, useEffect } from 'react';
import { Select } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import './main.css';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { useTranslation } from 'react-i18next';

function AppSettingsLayout() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [name, setName] = useState('Default Name');
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  const app = useAppBridge();
  console.log("app", app);

  useEffect(() => {
    async function fetchCollections() {
      try {
        if (!fetch) {
          throw new Error('useAuthenticatedFetch hook not properly initialized.');
        }

        const response = await fetch("/api/communityData");
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await response.json();
        setCollections(data.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }

    fetchCollections();
  }, [fetch]);

  const options = collections.map(collection => ({
    label: collection.title,
    value: collection.id
  }));

  const handleSelectChange = (value) => {
    setSelectedCollection(value);
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          collection: selectedCollection,
         
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit data');
      }
     


      const responseData = await response.json();
      console.log('Data submitted successfully:', responseData);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  return (
    <>
      <h1 className='h11'>Hello Fashionhub! Welcome</h1>
      <div className='name'>
        <p>Name Add</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add Name Filter"
        />
      </div>
      <div className='red'>
        Collection List
        <Select 
          options={options}
          placeholder='Select Collection Filter Use'
          onChange={handleSelectChange}
          value={selectedCollection}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default AppSettingsLayout;
