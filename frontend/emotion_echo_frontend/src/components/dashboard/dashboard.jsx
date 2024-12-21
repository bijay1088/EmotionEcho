import React from 'react'
import './dashboard.css'
import '../charts/lineChart'
import LineChart from '../charts/lineChart'
import PieChart from '../charts/pieChart'
import BarChart from '../charts/barChart'
import RadarChart from '../charts/radarChart'
import Table from '../table/table'
import Profile from '../account/profile'

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const dashboard = () => {

  return (
    
    <div className='m-4 cusContainer'>

    <Tabs
      defaultActiveKey="profile"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      
      <Tab eventKey="chart" title="Charts"> 
        <Row xs={1} md={2} className="g-4">
          <Col className='p-4'>
            <Card>
              <Card.Body >
                <LineChart/> 
              </Card.Body>
            </Card>
          </Col>

          <Col className='p-4'>
            <Card>
              <Card.Body >
                <BarChart/> 
              </Card.Body>
            </Card>
          </Col>

          <Col className='p-4'>
            <Card>
                <Card.Body >
                  <RadarChart/> 
                </Card.Body>
              </Card>
          </Col>
          
        </Row>
      </Tab>
      <Tab eventKey="table" title="Table" >
        <Table/>
      </Tab>
      <Tab eventKey="profile" title="Profile">
        <Profile/>
      </Tab>
    </Tabs>
      
    </div>
    
  );

}

export default dashboard