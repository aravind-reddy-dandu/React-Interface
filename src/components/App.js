import { each } from 'jquery';
import { findIndex, result, without } from 'lodash';
import React, { Component } from 'react'
import '../css/App.css';
import AddAppointments from './AddAppointments'
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';

class App extends Component {

  constructor() {
    super();
    this.state = {
      myAppointments: [],
      aptId: 0,
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
    }
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addApt = this.addApt.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(name, value, id){
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId : id
    })
    tempApts[aptIndex][name] = value
    this.setState({
      myAppointments : tempApts
    })
  }

  searchApts(value){
    this.setState({
      queryText : value
    })
  }


  changeOrder(orderBy, orderDir) {

    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    })

  }

  addApt(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.aptId;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      aptId: this.state.aptId + 1
    })
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts
    })
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.aptId
          this.setState({ aptId: this.state.aptId + 1 });
          return item;
        });
        this.setState({
          myAppointments: apts
        });
      })
  }

  render() {

    let order;

    let filteredApts = this.state.myAppointments;

    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1
    }

    filteredApts = filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()
      ) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    }).filter(eachItem => {
      return (
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptDate'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase())
      )
    });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addApt}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts = {this.searchApts}
                />
                <ListAppointments appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo = {this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
