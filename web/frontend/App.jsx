import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
// import { Collection } from "./components/Collection";

export default function App() {
 
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  const [showStoreInfo, setShowStoreInfo] = useState(false);

 

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: t("NavigationMenu.pageName"),
                  destination: "/pagename",
                },

                {
                  label: t("AppSettingsLayout"),
                  destination: "/AppSettingsLayout",
                },

              ]}
            />
           
         {/* <Collection /> */}
              
          
            <Routes pages={pages} />
          </QueryProvider>    
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
