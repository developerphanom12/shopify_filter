// File: CustomExtension.js
import React, { useEffect, useState } from 'react';
import { Layout, LegacyCard,Autocomplete, Icon ,Text} from '@shopify/polaris';
import { useTranslation } from 'react-i18next';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';

export function Design() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetch = useAuthenticatedFetch(); // Use your custom fetch hook
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/communityData'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setData(data);
        console.log(data,"abc")
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
// shpua_c3c16c65765a3c311d49ed68726fc59b
    fetchData();
  }, [fetch]);

  return (
   <>
  <Layout>
        <Layout.Section>
          <LegacyCard title="Shop Dashboard" sectioned>               
          <p>This is dummy Context.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
      </>
  );
}
