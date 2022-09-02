/**
 =========================================================
 * Material Dashboard 2 PRO React TS - v1.0.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
 * Copyright 2022 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import { Component } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { VectorMap } from "@react-jvectormap/core";
import { worldMerc } from "@react-jvectormap/world";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/sunflower.jpg";
// Wizard page components
import Location from "pages/home/components/Location";
import Account from "layouts/applications/wizard/components/Account";
import Address from "layouts/applications/wizard/components/Address";
import CropWizardComponent from "./components/Crops";
import CropsSpeciesDataTableComponent from "./components/CropsSpeciesDataTableComponent";

function getSteps(): string[] {
  return ["Location", "Crops", "Schedule"];
}
export interface HomeWizardProps {}
export interface HomeWizardState {
  activeStep: number;
  steps: string[];
  geoLocation?: any;
  crops?: any[];
  markers: any[];
  hideMarkers: boolean;
}
class HomeWizard extends Component<HomeWizardProps, HomeWizardState> {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.state = {
      activeStep: 0,
      steps: getSteps(),
      crops: [],
      markers: [],
      hideMarkers: false,
    };
  }

  handleBack() {
    const { activeStep } = this.state as any;
    this.setState({
      activeStep: activeStep - 1,
    });
  }

  handleNext() {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  }

  getStepContent(): JSX.Element {
    switch (this.state.activeStep) {
      case 0:
        return <Location wizardComponent={this} />;
      case 1:
        return <CropWizardComponent wizardComponent={this} />;
      case 2:
        return <CropsSpeciesDataTableComponent wizardComponent={this} />;
      default:
        return null;
    }
  }

  getMarkers() {
    const markers = [
      /* {
        name: "USA",
        latLng: [40.71296415909766, -74.00437720027804],
      },*/
    ];
    if (this.state.geoLocation) {
      markers.push({
        name: this.state.geoLocation.city,
        latLng: [this.state.geoLocation.location[1], this.state.geoLocation.location[0]],
      });
      if (this.state.geoLocation.nearestMatchGeoLocation) {
        markers.push({
          name: this.state.geoLocation.city,
          latLng: [
            this.state.geoLocation.nearestMatchGeoLocation.location[1],
            this.state.geoLocation.nearestMatchGeoLocationlocation[0],
          ],
        });
      }
    }
    return markers;
  }

  async setGeoLocation(geoLocation: any) {
    this.setState({
      geoLocation,
      hideMarkers: true,
      markers: [],
    });
    setTimeout(() => {
      this.setState({
        markers: this.getMarkers(),
        hideMarkers: false,
      });
    }, 1);
  }

  render() {
    const { activeStep, steps } = this.state as any;
    const isLastStep: boolean = activeStep === steps.length - 1;
    return (
      <CoverLayout image={bgImage}>
        {/*<DashboardNavbar />*/}
        <MDBox pt={3} pb={8}>
          <Grid container justifyContent="center" sx={{ my: 4 }}>
            <Grid item xs={12} lg={8}>
              <MDBox mt={6} mb={8} textAlign="center">
                <MDBox mb={1}>
                  <MDTypography variant="h3" fontWeight="bold" color="white">
                    Build Your Profile
                  </MDTypography>
                </MDBox>
                <MDTypography variant="h5" fontWeight="regular" color="white">
                  This information will let us know more about you.
                </MDTypography>
              </MDBox>
              <Card>
                <MDBox mt={-3} mx={2}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </MDBox>
                <MDBox height="400Px">
                  {/*     <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <MDBox mb={2}>*/}
                  {!this.state.hideMarkers && (
                    <VectorMap
                      map={worldMerc}
                      zoomOnScroll={false}
                      zoomButtons={false}
                      markersSelectable
                      backgroundColor="transparent"
                      selectedMarkers={[]}
                      markers={this.getMarkers()}
                      regionStyle={{
                        initial: {
                          fill: "#dee2e7",
                          "fill-opacity": 1,
                          stroke: "none",
                          "stroke-width": 0,
                          "stroke-opacity": 0,
                        },
                      }}
                      markerStyle={{
                        initial: {
                          fill: "#e91e63",
                          stroke: "#ffffff",
                          "stroke-width": 5,
                          "stroke-opacity": 0.5,
                          r: 7,
                        },
                        hover: {
                          fill: "E91E63",
                          stroke: "#ffffff",
                          "stroke-width": 5,
                          "stroke-opacity": 0.5,
                        },
                        selected: {
                          fill: "E91E63",
                          stroke: "#ffffff",
                          "stroke-width": 5,
                          "stroke-opacity": 0.5,
                        },
                      }}
                      style={{
                        marginTop: "-1.5rem",
                      }}
                      onRegionTipShow={() => false}
                      onMarkerTipShow={() => false}
                    />
                  )}
                  {/* </MDBox>
            </Grid>
          </Grid>*/}
                </MDBox>
                <MDBox p={2}>
                  <MDBox>
                    {this.getStepContent()}
                    {/*<MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
                      {activeStep === 0 ? (
                        <MDBox />
                      ) : (
                        <MDButton variant="outlined" color="dark" onClick={this.handleBack}>
                          back
                        </MDButton>
                      )}
                      <MDButton
                        variant="gradient"
                        color="dark"
                        onClick={!isLastStep ? this.handleNext : undefined}
                      >
                        {isLastStep ? "send" : "next"}
                      </MDButton>
                    </MDBox>*/}
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </CoverLayout>
    );
  }
}

export default HomeWizard;
