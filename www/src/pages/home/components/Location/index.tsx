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
// import client from "services/Apollo";
// @mui material components
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { VectorMap } from "@react-jvectormap/core";
import { worldMerc } from "@react-jvectormap/world";
// Wizard application components
import FormField from "layouts/applications/wizard/components/FormField";
// Images
import { GeoLocationService } from "services/GeoLocation.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Component, useMemo } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import MDButton from "../../../../components/MDButton";
import HomeWizard from "../../index";
import MDProgress from "../../../../components/MDProgress";

export interface LocationProps {
  wizardComponent: HomeWizard;
}
export interface LocationState {
  geoLocations: any[];
  renderedRows: any[];
  count: number;
  search: string;
  hoveredGeoLocation?: any;

  loadingProgress: number;
}
class Location extends Component<LocationProps, LocationState> {
  wizardComponent: HomeWizard;

  $loadingTimeout: any;

  constructor(props: LocationProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectGeoLocation = this.selectGeoLocation.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      geoLocations: [],
      renderedRows: [],
      count: -1,
      search: null,

      loadingProgress: -1,
    };
    setInterval(() => {
      if (this.state.count < 0) {
        return;
      }
      if (this.state.count === 0) {
        this.getData();
      }
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState((prevState) => {
        return {
          count: prevState.count - 1,
        };
      });
    }, 1000);
  }

  startLoading() {
    this.setState({ loadingProgress: 100 });
    this.$loadingTimeout = setInterval(() => {
      if (this.state.loadingProgress > 0) {
        this.setState((prevState) => {
          let { loadingProgress } = prevState;
          loadingProgress *= 0.99;
          return {
            loadingProgress,
          };
        });
      }
    }, 100);
  }

  endLoading() {
    clearInterval(this.$loadingTimeout);
    this.$loadingTimeout = null;
    this.setState({
      loadingProgress: -1,
    });
  }

  async handleChange(e: any) {
    this.startLoading();
    this.setState({
      search: e.target.value,
      count: 1,
    });
  }

  async getData() {
    const geoLocations = await GeoLocationService.listGeoLocations({
      // eslint-disable-next-line react/no-access-state-in-setstate
      city: this.state.search,
    });

    const renderedRows = geoLocations.map(
      (geoLocation: { [key: string]: string | number | (string | number)[] }, key: any) => {
        const tableRows: any = [];
        const rowKey = `row-${key}`;

        // Object.entries(geoLocation).map(([cellTitle, cellContent]: any) => {
        let label = `${geoLocation.city}, ${geoLocation.state}   ${geoLocation.country}`;
        if (geoLocation.city === geoLocation.state || geoLocation.city === geoLocation.country) {
          label = `${geoLocation.city},  ${geoLocation.country}`;
        }
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                  {label}
                </MDTypography>
              </MDBox>
            </MDBox>
          </TableCell>
        );
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <MDButton
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={(e) => this.selectGeoLocation(geoLocation)}
                >
                  Select
                </MDButton>
              </MDBox>
            </MDBox>
          </TableCell>
        );

        // });

        return <TableRow key={rowKey}>{tableRows}</TableRow>;
      }
    );

    this.setState({
      geoLocations,
      renderedRows,
    });
    this.endLoading();
  }

  // @ts-ignore
  async selectGeoLocation(geoLocation) {
    this.wizardComponent.setGeoLocation(geoLocation);
    this.wizardComponent.handleNext();
  }

  render() {
    // @ts-ignore
    const { renderedRows, geoLocations } = this.state;
    return (
      <MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Let&apos;s start with the basic information
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text">
            Roughly where in the world are you?
          </MDTypography>
        </MDBox>

        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox>
                <FormField type="text" label="City" onChange={this.handleChange} />
              </MDBox>
              {this.state.loadingProgress > 0 && (
                <MDBox>
                  <MDProgress value={100 - this.state.loadingProgress} />
                </MDBox>
              )}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container>
            <Grid item xs={12}>
              <TableContainer sx={{ height: "100%", boxShadow: "none" }}>
                <Table>
                  <TableBody>
                    {renderedRows.map((row) => {
                      return row;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    );
  }
}

export default Location;
