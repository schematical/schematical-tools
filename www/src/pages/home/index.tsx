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
import * as d3 from 'd3-selection';
import * as d3Drag from 'd3-drag';
/*import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';*/
import * as d3Zoom from 'd3-zoom';
import * as d3Force from "d3-force";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
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
import {ResourceService} from "../../services/Resource.service";
// Wizard page components
import './index.css';

export interface HomeWizardProps {}
export interface HomeWizardState {}
class HomeWizard extends Component<HomeWizardProps, HomeWizardState> {
    private publicCount: number = 0;
    private notHasDepsCount: number = 0;
    private simulation: any; // Simulation<any, any>;
    private svgParent: any;
    private svg: any;
    private nodes: any;
    private resources: any[];
    private links: any;
    private inputNodeYHight?: number;
    private nodeYHight?: number;
    private padding: number = 50;
    private maxDeps: number;
    // Selection<EnterElement, any, SVGGElement, any>;

    // Selection<SVGElement, any, HTMLElement, any>;

  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderNetwork();
  }
  async renderNetwork() {
      const links = [];
      const resources = (await ResourceService.listResource({}));
      this.resources = resources.map((resource)=>{

          resource = {
              remoteId: resource.remoteId,
              name: resource.name,
              deps: resource.deps,
              attributes: {
                  hasDeps: false,
                  isPublic: false,
                  ...resource.attributes
              },
          };
          resource.attributes.IpPermissions.forEach((ipPermission) => {
              if (ipPermission.IpRanges.length > 0) {
                  resource._publicIndex = this.publicCount;
                  this.publicCount += 1;

                  resource.attributes.isPublic = true;
              }
          });
          if (resource.deps.length > 0) {
              resource.attributes.hasDeps = true;


          }else {
              resource._notHasDepsIndex  = this.notHasDepsCount;
              this.notHasDepsCount += 1;
          }
          return resource;
      });
      this.resources.forEach((resource) => {
          if (resource.deps.length === 0) {
              return
          }
          resource.depObjs = [];
          resource.deps.forEach((depId) => {
              const dep = this.resources.find((d) => d.remoteId === depId);
              dep.attributes.isDep = true;
              resource.depObjs.push(dep);
              links.push({
                  source: resource,
                  target: dep
              });
          });
      });

      this.svgParent = d3.select<SVGElement, any>("svg");
      if(!this.svgParent){
          throw new Error("Missing `this.svGParent`");
      }

      this.svg = this.svgParent.append("svg:g");



     /* var zoom = d3Zoom.zoom()
      //.scaleExtent([1, 10])
          .on("zoom", (e)=>{ this.zoomed(e) })
      this.svg.call(zoom);*/







      this.simulation = d3Force.forceSimulation<any, any>()
          .force("link", d3Force.forceLink().id((d: any) => { return d.id; }))
          .force("collide", d3Force.forceCollide().radius((d)=> {
              return 20;
              /*if(this.nodeYHight < 20){
                  return 20;
              }
              return this.nodeYHight * 2;*/
          }).iterations(2))

          .force('x', d3Force.forceX()
              .x((resource: any) => {

                  if(resource.attributes.isPublic) {
                      return this.padding;
                  }
                  if (resource.attributes.hasDeps) {
                      return parseInt(this.svgParent.style("width"), 10)/2; // null;
                  }
                  return parseInt(this.svgParent.style("width"), 10) - this.padding;

              })
              .strength((resource: any) => {

                  if(resource.attributes.isPublic) {
                      return .1;
                  }
                  if (resource.attributes.hasDeps) {
                      return 1; // 0
                  }
                  return 1;

              })
          )

      this.updateY();


      const force = this.simulation
          .nodes(this.resources)


      this.simulation.force("link")
          .links(links);

       this.drawLink(links);
      this.drawNode();
      force.on("tick", ()=>{
          this.ticked();
      });

    }

    updateY(){
      if (this.publicCount === 0){
          return;
      }
        this.inputNodeYHight = ((parseInt(this.svgParent.style('height'), 10) - (this.padding * 2))/this.publicCount);
        this.nodeYHight = ((parseInt(this.svgParent.style('height'), 10) - (this.padding*2))/this.resources.length);
        this.simulation.force('Y', d3Force.forceY()
            .y((d: any) => {
                let y = null;
                if (d.attributes.isPublic) {
                    y = d._publicIndex * this.inputNodeYHight + this.padding;
                    return y;
                }
                if (d.attributes.hasDeps) {
                   return null;

                }
                y = d._notHasDepsIndex * this.nodeYHight + this.padding;
                return y;
            })
            .strength((d: any) => {
                if (d.attributes.isPublic) {
                    return 1;
                }
                if (!d.attributes.hasDeps) {
                    return 1;

                }
                return 0;
            })
        )
        //.alphaMin(0.5)
            .alpha(1).restart()
    }
    drawLink(links) {

        this.links = this.svg
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .style('stroke-width', function(d){

                return 2;
            })
            .style('stroke', function(d){
                return "#660000";
            })
            .classed('hightlighted_link', function(d){
                if(!d.source.node){
                    return false;
                }
                return d.source.node.classed('selected_node');
            });

        this.links.exit().remove();
    }
    ticked() {

        this.links
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .classed('hightlighted_link', function(d){
                if(!d.source.lastFireTime ){
                    return false;
                }
                return (new Date().getTime() - d.source.lastFireTime < 1000);
            })
            .classed('link', function(d){
                if(!d.source.lastFireTime ){
                    return true;
                }
                return !(new Date().getTime() - d.source.lastFireTime < 1000);
            })

        this.nodes
            .each(function(d){
                d3.select(d.node).attr("transform", (d: any) => {
                    return `translate(${d.x},${d.y})`;
                })
                .classed('firing_node', (d: any) => {
                    if(!d.lastFireTime ){
                        return null;
                    }

                    return (new Date().getTime() - d.lastFireTime < 1000);
                })
            })




    }
  drawNode() {


        this.nodes = this.svg
            .selectAll("g.node")
            .data(this.resources)
            .enter();

        const nodeEnter = this.nodes
            .append("g")
            .attr("class", "node")
            .each(function(d) {
                // @ts-ignore
                d.node = this;
            })
            .on("mousedown", function (event){


                  // @ts-ignore
                console.log("SELECTED:", event, this);


            })
            /*.on("mousedown", (selectedNeuron)=>{


                this.setSelectedNeuron(selectedNeuron);


            })
            .on("mouseover", (d)=>{



                /!*
                                let self = this;
                                function updateDependants(d){
                                    d3.select(d.node).classed('selected_node', true);
                                    if(!d.dependants){
                                        return;
                                    }
                                    d.dependants.forEach((dep)=>{
                                        let depNode = self.brainData.indexedNodes[dep.id]
                                        updateDependants(depNode);
                                    });
                                }
                                updateDependants.apply(this,[nodeData]);*!/


            })
            .on("mouseout", (d)=>{

                /!* let self = this;
                 function updateDependants(d){
                     d3.select(d.node).classed('selected_node', false);
                     if(!d.dependants){
                         return;
                     }
                     d.dependants.forEach((dep)=>{
                         let depNode =  self.state.nNet.neurons
                         updateDependants(depNode);
                     });
                 }
                 updateDependants.apply(this,[nodeData]);*!/
            })
*/


        nodeEnter.append('svg:circle')
            .attr("class", "node_circle")
            .attr('r', (d) => {
                return 10;//this.nodeYHight / 2;
            })
            .each(function(d){
                let className = null;
                if (d.attributes.isPublic) {
                    className = 'public';
                } else if (d.attributes.hasDeps) {
                    className = 'has-deps'
                } else {
                    className = 'middle'
                }
                d3.select(d.node).select('circle').classed(className, true);
            })


        //nodeEnter.merge(this.nodes)
        nodeEnter.append("svg:text")
            .attr("text-anchor", "middle")
            .attr("class","textClass")
            .attr("id", function(d) { return  d.id;})
            .attr("fill", "black")
            .attr("stroke-width",(d)=>{ return 1; })// this.nodeYHight/10 })
            .attr("font-size", function(d){return 1; }) // this.nodeYHight * 6})
            .attr("text-align", "center")
            .attr("dy", function(d){return 30})
            .text(function(d) {
                return d.name;
            });


        const drag = d3Drag.drag()
           /* .on("start", (e)=>{ this.dragstarted(e); })
            .on("drag",  (e)=>{ this.dragged(e); })
            .on("end", (e)=>{  this.dragended(e); });*/

        drag(this.svg);

        this.nodes.exit()
        //.transition()
            .remove();
    }

  render() {
    return (
      <svg id="svg" />
    );
  }


}

export default HomeWizard;
