// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios";
import connection from "./database/connection.js";
const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/userdata", async (_req, res) => {
  res.send("gnfgjnjffdnbjfgdjmnk");
});

app.get("/api/communityData", (req, res) => {
  var session_data = res.locals.shopify.session;
  console.log("Session data:", session_data);

  const shopName = session_data.shop;
  const accessToken = session_data.accessToken;

  res.json({ shopName, accessToken });
});

app.get("/products", async (req, res) => {
  try {
    const shopName = "phanomgetcustomer.myshopify.com";
    const accessToken = "shpua_a45fdbef2bd0bb3708ce7a01665ce290";

    const query = `
    {
      products(first: 100, query: "status:active") {
        edges {
          node {
            productType
            variants(first: 50) {
              edges {
                node {
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
           
          }
        }
      }
    }
    `;

    const response = await axios.post(
      `https://${shopName}/admin/api/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/sfd", async (req, res) => {
  try {
    const shopName = "fashion-hub-444.myshopify.com";
    const accessToken = "shpua_ee18b96174ca270055c3356ff5e5718b";

    const query = `
      {
        collections(first: 250) {
          edges {
            node {
              id
              title
              productsCount
            }
          }
        }
      }
    `;

    const response = await axios.post(
      `https://${shopName}/admin/api/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Error fetching collection data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/collections", async (req, res) => {
  try {
    const sizes = req.query.sizes;
    const colors = req.query.colors;
    const reqmin = req.query.minPrice;
    const reqmax = req.query.maxPrice;

    const minPrice = typeof reqmin === "string" ? parseFloat(reqmin) : null;
    const maxPrice = typeof reqmax === "string" ? parseFloat(reqmax) : null;
    const requestedSize =
      typeof sizes === "string" ? sizes.toLowerCase() : null;
    const requestedColor =
      typeof colors === "string" ? colors.toLowerCase() : null;

    const response = await axios.post(
      `https://phanomgetcustomer.myshopify.com/admin/api/graphql.json`,
      {
        query: `
          {
            products(first:50, query: "status:active") {
              edges {
                node {
                  id
                  title
                  images(first: 3) {
                    edges {
                      node {
                        id
                        src
                      }
                    }
                  }
                  variants(first: 5) {
                    edges {
                      node {
                        id
                        title
                        price
                        image {
                          src
                        }
                        selectedOptions {
                          name
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          "X-Shopify-Access-Token": "shpua_a45fdbef2bd0bb3708ce7a01665ce290",
        },
      }
    );

    const products = response.data.data.products.edges;
    const filteredProducts = products
      .filter((product) => {
        const variants = product.node.variants.edges;
        return variants.some((variant) => {
          const variantOptions = variant.node.selectedOptions;
          const variantTitle = variant.node.title.toLowerCase();
          const variantPrice = parseFloat(variant.node.price);

          const hasRequestedSize =
            requestedSize === null ||
            variantOptions.some(
              (option) =>
                option.name.toLowerCase() === "size" &&
                option.value.toLowerCase() === requestedSize
            );
          const hasRequestedColor =
            requestedColor === null ||
            variantOptions.some(
              (option) =>
                option.name.toLowerCase() === "color" &&
                option.value.toLowerCase() === requestedColor
            );

          const isWithinPriceRange =
            minPrice === null ||
            maxPrice === null ||
            (variantPrice >= minPrice && variantPrice <= maxPrice);

          return hasRequestedSize && hasRequestedColor && isWithinPriceRange;
        });
      })
      .map((product) => ({
        id: product.node.id,
        title: product.node.title,
        images: product.node.images,
        variants: product.node.variants.edges
          .filter((variant) => {
            const variantOptions = variant.node.selectedOptions;
            const variantPrice = parseFloat(variant.node.price);

            const hasRequestedSize =
              requestedSize === null ||
              variantOptions.some(
                (option) =>
                  option.name.toLowerCase() === "size" &&
                  option.value.toLowerCase() === requestedSize
              );
            const hasRequestedColor =
              requestedColor === null ||
              variantOptions.some(
                (option) =>
                  option.name.toLowerCase() === "color" &&
                  option.value.toLowerCase() === requestedColor
              );

            const isWithinPriceRange =
              minPrice === null ||
              maxPrice === null ||
              (variantPrice >= minPrice && variantPrice <= maxPrice);

            return hasRequestedSize && hasRequestedColor && isWithinPriceRange;
          })
          .map((variant) => ({
            id: variant.node.id,
            title: variant.node.title,
            price: variant.node.price,
            image: variant.node.image ? variant.node.image.src : null,
            selectedOptions: variant.node.selectedOptions,
          })),
      }));

    if (filteredProducts.length > 0) {
      res.status(200).json({ products: filteredProducts });
    } else {
      res.status(200).json({ message: "No products match the given filters." });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/collections/list", async (req, res) => {
  try {
    const session_data = res.locals.shopify.session;
    console.log("Session data:", session_data); 
    const shopName = session_data.shop;
    const accessToken = session_data.accessToken;

    const query = `
      {
        collections(first: 10) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
    `;

    const response = await axios.post(
      `https://${shopName}/admin/api/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );

    console.log("GraphQL response:", response.data); // Log GraphQL response for debugging purposes

    if (
      response.data &&
      response.data.data &&
      response.data.data.collections &&
      response.data.data.collections.edges
    ) {
      const collections = response.data.data.collections.edges.map(
        (edge) => edge.node
      );
      res
        .status(200)
        .json({ status: 200, data: collections, shopName, accessToken });
    } else {
      throw new Error("Invalid GraphQL response format");
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/data", (req, res) => {
  try {
    const { name, collection } = req.body;

    const session_data = res.locals.shopify.session;
    console.log("sess", session_data);
    const shopname = session_data.shop;
    const tokenshop = session_data.accessToken;

    const sql =
      "INSERT INTO shopdetail (name, collection, tokenshop, shopname) VALUES (?, ?, ?, ?)";

    connection.query(
      sql,
      [name, collection, tokenshop, shopname],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into MySQL:", err);
          res.status(500).json({
            success: false,
            error: "Failed to insert data into database",
          });
          return;
        }
        console.log("Data inserted into MySQL:", result);
        res
          .status(200)
          .json({ success: true, message: "Data inserted successfully" });
      }
    );
  } catch (error) {
    console.error("Error handling /api/data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/search", async (req, res) => {
  try {
    const title = req.query.title;

    const response = await axios.post(
      `https://fashion-hub-444.myshopify.com/admin/api/graphql.json`,
      {
        query: `
     {
    products(first: 50, query: "status:active title:*${title ? title : ""}*") {
      edges {
        node {
          id
          title
          images(first: 3) {
            edges {
              node {
                id
                src
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price
                image {
                  src
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`,
      },
      {
        headers: {
          "X-Shopify-Access-Token": "shpua_ee18b96174ca270055c3356ff5e5718b",
        },
      }
    );

    const products = response.data.data.products.edges;

    if (products.length > 0) {
      res.status(200).json({ products: products });
    } else {
      res.status(200).json({ message: "No products match the given title." });
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);