import React, { useState, useCallback, useEffect } from "react";
import {
  Select,
  MediaCard,
  Page,
  TextField,
  Layout,
  LegacyCard,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";

export function Filter() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [name, setName] = useState("Default Name");
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();

  const app = useAppBridge();
  console.log("app", app);
  const [value, setValue] = useState("Jaded Pixel");

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  useEffect(() => {
    async function fetchCollections() {
      try {
        if (!fetch) {
          throw new Error(
            "useAuthenticatedFetch hook not properly initialized."
          );
        }

        const response = await fetch("/api/collections/list");
        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }

    fetchCollections();
  }, [fetch]);

  const options = collections.map((collection) => ({
    label: collection.title,
    value: collection.id,
  }));

  const handleSelectChange = (value) => {
    setSelectedCollection(value);
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          collection: selectedCollection,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();
      console.log("Data submitted successfully:", responseData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <Page
        backAction={{ content: "Settings", url: "/" }}
        title="Search Collection"
        primaryAction={
          <Link
            style={{
              backgroundColor: "rgb(215 215 215)",
              borderRadius: "5px",
              color: "#000",
              padding: "10px 20px", 
              textDecoration: "none",
              fontWeight: "600",
            }}
            className="filter-btn"
            to="/"
            variant="primary"
          >
            Save
          </Link>
        }
      >
        <div className="search-collection">
          <Layout>
            <Layout.Section>
              <TextField
                label="Store name"
                value={value}
                onChange={handleChange}
                autoComplete="off"
              />
            </Layout.Section>

            <Layout.Section variant="oneThird">
              <LegacyCard>
                <Select
                  options={options}
                  placeholder="Select Collection Filter Use"
                  onChange={handleSelectChange}
                  value={selectedCollection}
                />
              </LegacyCard>
            </Layout.Section>
          </Layout>
        </div>
        <div className="media-Card">
          <Layout>
            <Layout.Section variant="oneThird">
              <LegacyCard.Section>
                <MediaCard
                  title="Getting Started"
                  description="Discovers how Shopify can power up your entrepreneurial journey."
                  popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
                >
                  <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  />
                </MediaCard>
              </LegacyCard.Section>
            </Layout.Section>
          </Layout>
        </div>
      </Page>
    </>
  );
}
