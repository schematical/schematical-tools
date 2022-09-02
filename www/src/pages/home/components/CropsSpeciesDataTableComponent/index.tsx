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

import Timeline, { TimelineHeaders, SidebarHeader, DateHeader } from "react-calendar-timeline";
// make sure you include the timeline stylesheet or the timeline will not be styled
import "react-calendar-timeline/lib/Timeline.css";
import "./index.css";
import moment from "moment";
import { Component, useMemo } from "react";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import MDButton from "../../../../components/MDButton";
import HomeWizard from "../../index";
import { CropService } from "../../../../services/Crop.service";
import TimelineList from "../../../../examples/Timeline/TimelineList";
import TimelineItem from "../../../../examples/Timeline/TimelineItem";

export interface CropsSpeciesDataTableComponentProps {
  wizardComponent: HomeWizard;
}
export interface CropsSpeciesDataTableComponentState {
  cropSpeciesDatas?: any[];
  cropSpeciesGoals?: any;
}
class CropsSpeciesDataTableComponent extends Component<
  CropsSpeciesDataTableComponentProps,
  CropsSpeciesDataTableComponentState
> {
  wizardComponent: HomeWizard;

  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.onCanvasClick = this.onCanvasClick.bind(this);
    this.onGetRemindersClick = this.onGetRemindersClick.bind(this);
    this.wizardComponent = props.wizardComponent;
    this.state = {
      cropSpeciesDatas: [],
    };
    this.getData();
  }

  async handleChange(e: any) {
    console.log(e);
  }

  async onCanvasClick(groupId, time, e) {
    console.log("groupId, time, e", groupId, time, e);
  }

  async getData() {
    console.log("SELECTED CROPS: ", this.wizardComponent.state.crops);
    if (!this.wizardComponent.state.geoLocation) {
      this.wizardComponent.handleBack();
      return;
    }
    const cropSpeciesDatas: any[] = await CropService.getCropSpecieDataByGeoLocation({
      geoLocationId: this.wizardComponent.state.geoLocation._id,
      cropSpeciesIds: this.wizardComponent.state.crops.map((c) => c._id),
    });
    this.setState({
      cropSpeciesDatas,
    });
  }

  async selectCrop(geoLocation) {
    console.log("SELECTED GEO: ", geoLocation);
    // this.wizardComponent.handleNext();
  }

  groupRenderer({ group }) {
    return <div className="custom-group">{group.title}</div>;
  }

  renderTable() {
    const renderedRows = this.wizardComponent.state.crops.map((crop: any, key: any) => {
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
                  {Object.keys(crop.attributes || {}).map((key) => {
                    return <li className="list-group-item">{`${key}: ${crop.attributes[key]}`}</li>;
                  })}
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
              <FormField
                type="number"
                label="Servings"
                InputLabelProps={{ shrink: true }}
                value={(this.state.cropSpeciesGoals && this.state.cropSpeciesGoals[crop._id]) || 10}
                onChange={(e) => {
                  this.setState((prevState) => {
                    const cropSpeciesGoals = prevState.cropSpeciesGoals || {};
                    cropSpeciesGoals[crop._id] = e.target.value;
                    return {
                      cropSpeciesGoals,
                    };
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
    return renderedRows;
  }

  onGetRemindersClick(e) {
    // Validate the email
  }

  render() {
    const groups = [];
    const items = [];
    this.state.cropSpeciesDatas.forEach((cropSpeciesData, i) => {
      // x
      groups.push({
        id: cropSpeciesData.cropSpecies._id,
        title: cropSpeciesData.cropSpecies.name,
      });
      items.push({
        id: `${cropSpeciesData.cropSpecies._id}_plant`,
        group: cropSpeciesData.cropSpecies._id,
        title: "Plant",
        start_time: moment().month(cropSpeciesData.earlyStartMonth),
        end_time: moment().month(cropSpeciesData.lateStartMonth), // .add(0.5, "month"),
      });
      items.push({
        id: `${cropSpeciesData.cropSpecies._id}_harvest`,
        group: cropSpeciesData.cropSpecies._id,
        title: "Harvest",
        start_time: moment()
          .month(cropSpeciesData.lateStartMonth)
          .add(cropSpeciesData.cropSpecies.harvestDayMin, "day"),
        end_time: moment()
          .month(cropSpeciesData.lateStartMonth)
          .add(cropSpeciesData.cropSpecies.harvestDayMax, "day"),
      });
    });

    return (
      <MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Here are the optimal plant and harvest times for the crops you selected
            </MDTypography>
          </MDBox>
          {/* <MDTypography variant="body2" color="text">
            What do you want to grow?
          </MDTypography> */}
        </MDBox>
        <MDBox mt={2}>
          {this.state.cropSpeciesDatas.length > 0 && (
            <Timeline
              groups={groups}
              items={items}
              defaultTimeStart={moment().add(-3, "month")}
              visibleTimeStart={moment().add(-3, "month").toDate().getTime()}
              defaultTimeEnd={moment().add(9, "month")}
              visibleTimeEnd={moment().add(9, "month").toDate().getTime()}
              onCanvasClick={this.onCanvasClick}
              groupRenderer={this.groupRenderer}
            >
              <TimelineHeaders className="sticky">
                {/* <SidebarHeader>
                  {({ getRootProps }) => {
                    return <div {...getRootProps()}>Left</div>;
                  }}
                </SidebarHeader> */}
                <DateHeader unit="primaryHeader" />
                <DateHeader />
              </TimelineHeaders>
            </Timeline>
          )}
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Not sure when to plant these?
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text">
            Let us help you remember when to plant, water, and harvest
          </MDTypography>
        </MDBox>
        <MDBox>
          <TimelineList title="Coming up">{this.renderTimeline()}</TimelineList>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Kick start your gardening habit by setting a few goals
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text">
            How many servings would you like to grow?
          </MDTypography>
        </MDBox>
        <MDBox>
          <Grid container>
            <Grid item xs={12}>
              <TableContainer sx={{ height: "100%", boxShadow: "none" }}>
                <Table>
                  <TableBody>
                    {this.renderTable().map((row) => {
                      return row;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          {/* <MDBox mb={1}>
            <MDTypography variant="h5" fontWeight="regular">
              Would you like reminder emails when its time to plant and harvest these crops?
            </MDTypography>
          </MDBox> */}
          <MDTypography variant="body2" color="text">
            Would you like reminder emails when its time to plant and harvest these crops?
          </MDTypography>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox textAlign="center">
            <FormField type="email" label="Email" InputLabelProps={{ shrink: true }} />
          </MDBox>
        </MDBox>
        <MDBox width="82%" textAlign="center" mx="auto" my={4}>
          <MDBox textAlign="center">
            <MDButton color="info" onClick={this.onGetRemindersClick}>
              Get Reminders
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    );
  }

  renderTimeline() {
    const tasks = [];
    this.state.cropSpeciesDatas.forEach((cropSpeciesData, i) => {
      const startMonth = moment().month(cropSpeciesData.earlyStartMonth);

      const color = "success";
      tasks.push(
        <TimelineItem
          key={cropSpeciesData.cropSpecies.id}
          color={color}
          icon="notifications"
          title={cropSpeciesData.cropSpecies.name}
          dateTime={startMonth.format("MMMM YYYY" /*"MMMM Do YYYY"*/)}
          description={`Plant ${cropSpeciesData.cropSpecies.name}`}
          lastItem={i === this.state.cropSpeciesDatas.length - 1}
        />
      );

      const harvestStart = moment()
        .month(cropSpeciesData.lateStartMonth)
        .add(cropSpeciesData.cropSpecies.harvestDayMin, "day");
      const harvestEnd = moment()
        .month(cropSpeciesData.lateStartMonth)
        .add(cropSpeciesData.cropSpecies.harvestDayMax, "day");

      tasks.push(
        <TimelineItem
          key={cropSpeciesData.cropSpecies.id}
          color="warning"
          icon="notifications"
          title={cropSpeciesData.cropSpecies.name}
          dateTime={harvestStart.format("MMMM YYYY")}
          description={`Harvest ${cropSpeciesData.cropSpecies.name}`}
          lastItem={i === this.state.cropSpeciesDatas.length - 1}
        />
      );
    });
    return tasks;
  }
}

export default CropsSpeciesDataTableComponent;
