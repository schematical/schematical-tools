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
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import FormField from "layouts/applications/wizard/components/FormField";
// Images
import { GeoLocationService } from "services/GeoLocation.service";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Component, useMemo } from "react";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import MDButton from "../../../../components/MDButton";
import HomeWizard from "../../index";
import { CropService } from "../../../../services/Crop.service";
import MDBadge from "../../../../components/MDBadge";


export interface CropWizardComponentProps {
  wizardComponent: HomeWizard;
}
export interface CropWizardComponentState {
  crops: any[];
  renderedRows: any[];
  count: number;
  search: string;
}
class CropWizardComponent extends Component<CropWizardComponentProps, CropWizardComponentState> {
  wizardComponent: HomeWizard;

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      crops: [],
      renderedRows: [],
      count: -1,
      search: null,
    };
    this.getData();
    /* setInterval(() => {
      if (this.state.count < 0) {
        return;
      }
      if (this.state.count === 0) {
        this.getData();
      }
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState((prevState) => ({
        count: prevState.count - 1,
      }));
    }, 2000); */
  }

  async handleChange(e: any) {
    this.setState({
      search: e.target.value,
      count: 1,
    });
  }

  async getData() {
    const crops = await CropService.listCropSpecies({});
    const arrayForSort = [...crops];
    arrayForSort.sort((a, b) => {
      let aScore = 0;
      if (a.attributes) {
        aScore = Object.keys(a.attributes).length;
      }
      let bScore = 0;
      if (b.attributes) {
        bScore = Object.keys(b.attributes).length;
      }
      if (aScore === bScore) {
        return 0;
      }
      if (aScore > bScore) {
        return -1;
      }
      return 1;
    });

    this.setState({
      crops: arrayForSort
    });
  }

  // @ts-ignore
  async selectCrop(geoLocation) {
    this.wizardComponent.handleNext();
  }

  render() {
    const { crops } = this.state;
    const renderedRows = crops
      .filter((crop) => {
        if (!this.state.search || this.state.search.length === 0) {
          return true;
        }
        return crop.name.indexOf(this.state.search) !== -1;
      })
      .map((crop: any, key: any) => {
        const tableRows: any = [];
        const rowKey = `row-${key}`;

        // Object.entries(geoLocation).map(([cellTitle, cellContent]: any) => {
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                  <h3>{crop.name}</h3>
                </MDTypography>
              </MDBox>
            </MDBox>
          </TableCell>
        );
        tableRows.push(
            <TableCell align="left" width="30%">
              <MDBox display="flex" alignItems="center" width="max-content">
                <MDBox display="flex" flexDirection="column" ml={3}>
                  <MDTypography variant="button" fontWeight="regular" textTransform="capitalize">
                    <ul className="list-group">
                      {
                        Object.keys(crop.attributes || {}).map((key) => {
                          return <li className="list-group-item">{`${key}: ${crop.attributes[key]}`}</li>
                        })
                      }

                    </ul>
                   {/*  {
                      Object.keys(crop.attributes || {}).map((key) => {
                        return <MDBadge size="xs" badgeContent={`${key}: ${crop.attributes[key]}`} container/>
                      })
                    }*/}
                   {/* {
                      Object.keys(crop.attributes || {}).length > 3 &&
                        <MDBadge size="xs" badgeContent="Nutrient Info" container/>
                    }*/}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </TableCell>
        );
        tableRows.push(
          <TableCell align="left" width="30%">
            <MDBox display="flex" alignItems="center" width="max-content">
              <MDBox display="flex" flexDirection="column" ml={3}>
                <Switch
                  onChange={(event) => {
                    const selectedCrops = this.wizardComponent.state.crops.filter(
                      (c) => crop._id !== c._id
                    );
                    if (event.target.checked) {
                      selectedCrops.push(crop);
                    }
                    this.wizardComponent.setState({
                      crops: selectedCrops,
                    });
                  }}
                />
              </MDBox>
            </MDBox>
          </TableCell>
        );

        // });

        return <TableRow key={rowKey}>{tableRows}</TableRow>;
      });
    return (
      <MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Let&apos;s start with the basic information
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text">
            What do you want to grow?
          </MDTypography>
        </MDBox>
        <MDBox mt={2}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} sm={4} container justifyContent="center">
              <MDBox position="relative" height="max-content" mx="auto">
                <MDAvatar src={team2} alt="profile picture" size="xxl" variant="rounded" />
                <MDBox alt="spotify logo" position="absolute" right={0} bottom={0} mr={-1} mb={-1}>
                  <Tooltip title="Edit" placement="top">
                    <MDButton variant="gradient" color="info" size="small" iconOnly>
                      <Icon>edit</Icon>
                    </MDButton>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid> */}
            <Grid item xs={12}>
              <MDBox>
                <FormField type="text" label="Crops" onChange={this.handleChange} />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => this.wizardComponent.handleBack()}
          >
            Back
          </MDButton>
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => this.wizardComponent.handleNext()}
          >
            Next
          </MDButton>
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
        <MDBox mt={3} width="100%" display="flex" justifyContent="space-between">
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => this.wizardComponent.handleBack()}
          >
            Back
          </MDButton>
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => this.wizardComponent.handleNext()}
          >
            Next
          </MDButton>
        </MDBox>
        <MDBox
          color="dark"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="3.25rem"
          height="3.25rem"
          bgColor="white"
          shadow="sm"
          borderRadius="50%"
          position="fixed"
          right="2rem"
          bottom="2rem"
          zIndex={99}
          sx={{ cursor: "pointer" }}
        >
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => this.wizardComponent.handleNext()}
          >
            Next
          </MDButton>
        </MDBox>
      </MDBox>
    );
  }
}

export default CropWizardComponent;
