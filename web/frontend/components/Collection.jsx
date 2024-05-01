import React, { useEffect, useState } from "react";
import { Card, TextContainer, Text, Image } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useAuthenticatedFetch } from "../hooks";

export function Collection({ productData }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStoreProducts = async () => {
      try {
        const response = await fetch("/api/collections/list");
        if (!response.ok) {
          throw new Error("Failed to fetch store products");
        }
        const data = await response.json();
        console.log("datdddddddda", data);
        setProducts(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreProducts();
  }, [fetch]);


  return (
    <>
    
    </>
  );
}
