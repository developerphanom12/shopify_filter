import express from 'express';
import axios from "axios";


const router = express.Router();

router.get("/products",async (req, res) => {
    try {
        var session_data = res.locals.shopify.session;
        console.log("Sessionggggdata:", session_data);
                                                                                                                                                                                                                                                                                                                                                                                        
      const shopName = "fashion-hub-444.myshopify.com";
      const accessToken = "shpua_ee18b96174ca270055c3356ff5e5718b";
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
            'X-Shopify-Access-Token': accessToken,
          },
        }
      );
  
      res.status(200).json(response.data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
export { router }; 
