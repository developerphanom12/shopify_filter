import {
  Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";
import { AddFilters, Design } from "../components";


export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title="FILTER APP" primaryAction={null} />
     
      {/* <Design/>  */}
      <AddFilters/>
     
    </Page>
  );
}
