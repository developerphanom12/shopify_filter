import React, { useCallback, useState } from "react";
import {
  Page,
  Button,
  LegacyCard,
  Layout,
  FormLayout,
  TextField,
  TextContainer,
  Text,
  EmptyState,
  Grid,
  CalloutCard,
  Icon,
  ActionList,
  RangeSlider,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import styled from "styled-components";

export function AddFilters() {
  const [rangeValue, setRangeValue] = useState(320);

  const handleRangeSliderChange = useCallback(() => setRangeValue(value), []);

  return (
    <>
      <Root>
        <Page
          title="Collection Filter Apps"
          primaryAction={
            <Link
              className="filter-btn"
              to="/newfilter"
              style={{
                backgroundColor: "rgb(215 215 215)",
                borderRadius: "5px",
                color: "#000",
                padding: "10px 20px",
                textDecoration: "none",
                fontWeight: "600",
              }}
              variant="primary"
            >
              Add New Filter
            </Link>
          }
        >
          <Grid columns={{ sm: 2 }}>
            <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 8, xl: 8 }}>
              <LegacyCard
                title="Filter list that we provide you in the collection"
                sectioned
              >
                <p>
                  The default filter is automatically used for all collection
                  pages, search pages, and all product pages. When a particular
                  collection is selected among many filter trees, the filter
                  tree created lastly would be prioritized to apply to that
                  collection. To disable the filter app on a collection, please
                  remove that collection from all of filter trees.
                </p>
              </LegacyCard>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 10, sm: 8, md: 8, lg: 4, xl: 4 }}>
              <LegacyCard sectioned>
                {/* <ActionList
                actionRole="menuitem"
                items={[
                  {
                    content: 'Go here',
                  },
                  {
                    content: 'Or there',
                  },
            
                ]}
              /> */}
                <div className="custom_div">
                  <h2 className="heading">Collection</h2>
                  <div className="sub_types">
                    <a href="">All</a>
                    <a href="">Tops</a>
                    <a href="">Dresses</a>
                    <a href="">Intimates</a>
                    <a href="">Outerwear</a>
                    <a href="">Swimwear</a>
                    <a href="">Shoes</a>
                  </div>

                  <h2 className="heading">Size</h2>
                  <div className="box_div">
                    <div className="box">XXS</div>
                    <div className="box">XS</div>
                    <div className="box">S</div>
                    <div className="box">M</div>
                    <div className="box">L</div>
                    <div className="box">XL</div>
                    <div className="box">XXL</div>
                  </div>

                  <h2 className="heading">Color</h2>
                  <div className="color_types">
                    <a>Red</a>
                    <a>Black</a>
                    <a>Yellow</a>
                    <a>Blue</a>
                    <a>White</a>
                    <a>Pink</a>
                    <a>Brown</a>
                  </div>

                  <h2 className="heading">Price</h2>

                  <div className="price_types">
                    <LegacyCard>
                      <RangeSlider
                        value={rangeValue}
                        onChange={handleRangeSliderChange}
                        output
                      />
                    </LegacyCard>
                  </div>

                  <h2 className="heading">Tags</h2>
                  <input type="text" className="tag_div" />
                </div>
              </LegacyCard>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
              <CalloutCard
                title="Customize the style of your checkout"
                illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                primaryAction={{
                  content: "Add Filter",
                  url: "/newfilter ",
                }}
              >
                <p>Add filters to collection and search pages youu.</p>
              </CalloutCard>
            </Grid.Cell>
          </Grid>

          <Layout>
            <LegacyCard>
              <EmptyState></EmptyState>
            </LegacyCard>
          </Layout>
        </Page>
      </Root>
    </>
  );
}

const Root = styled.section`
  .custom_div {
    height: 320px;
    overflow: auto;
    .heading {
      font-size: 1rem;
      font-weight: 600;
    }

    .sub_types {
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin: 15px 0 20px 0;
      a {
        color: black;
        text-decoration: none;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .box_div {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 15px 0 20px 0;
      .box {
        border: 1px solid #c9c6c6;
        width: 21%;
        height: 38px;
        border-radius: 5px;
        box-shadow: 0rem 0.125rem 0.25rem rgba(31, 33, 36, 0.1),
          0rem 0.0625rem 0.375rem rgba(31, 33, 36, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s;
        &:hover {
          background-color: black;
          color: white;
        }
      }
    }

    .color_types {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      margin: 15px 0 20px 0;
      a {
        color: black;
        text-decoration: none;
        font-size: 14px;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .price_types {
      display: flex;
      margin: 15px 0 20px 0;
      gap: 10px;
      input {
        border: 1px solid #c9c6c6;
        box-shadow: 0rem 0.125rem 0.25rem rgba(31, 33, 36, 0.1),
          0rem 0.0625rem 0.375rem rgba(31, 33, 36, 0.05);
        height: 42px;
        width: 50%;
        border-radius: 5px;
      }
    }

    .tag_div {
      border: 1px solid #c9c6c6;
      box-shadow: 0rem 0.125rem 0.25rem rgba(31, 33, 36, 0.1),
        0rem 0.0625rem 0.375rem rgba(31, 33, 36, 0.05);
      margin: 15px 0 20px 0;
      height: 42px;
      border-radius: 5px;
      width: 100%;
    }

    .Polaris-LegacyCard {
      width: 95%;
      margin: 15px 0 20px 0;
    }
    .price_types input {
      border: unset;
    }
  }

  a.Polaris-Button {
    background-color: rgb(215 215 215);
    border-radius: 5px;
    color: #000;
    padding: 10px 20px;
    text-decoration: none;
    font-weight: 600;
    border:none;
  }
  .Polaris-Grid-Cell.Polaris-Grid-Cell--cell_6ColumnXs.Polaris-Grid-Cell--cell_4ColumnSm.Polaris-Grid-Cell--cell_4ColumnMd.Polaris-Grid-Cell--cell_8ColumnLg.Polaris-Grid-Cell--cell_8ColumnXl:nth-child(
      3
    ) {
    margin-top: -30%;
  }
`;
