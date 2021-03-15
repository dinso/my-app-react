import React, { Component } from 'react';
import {Table, Button} from  'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown , faThumbsUp , faImage , faMoneyCheckAlt, faSearchDollar } from '@fortawesome/free-solid-svg-icons'

class App extends Component {
  state = { 
    isLoading :false,
    invoices :  []
 }

  remove(id){
    console.log(id);
    let updateedInvoices = [...this.state.invoices].filter (i => i.invoice_id !== id)
    this.setState({invoices : updateedInvoices});
}

async componentDidMount() {
  const response = await fetch(
    "https://epxaw5ag98.execute-api.ap-south-1.amazonaws.com/development"
  );
  const body = await response.json();
  this.setState({ invoices: body, isLoading: false });
}

render() { 
  const isLoading = this.state.isLoading;
  const allinvoices = this.state.invoices;

  if (isLoading)
    return(<div>Loading...</div>);

  let invoices = 
    allinvoices.map( invoice => 
      <tr key={invoice.invoice_id}>
        <td>{invoice.Vendor}</td>
        <td>{invoice.Amount}</td>
        <td>{invoice.invoice_number}</td>
        <td>{invoice.invoice_date}</td>
        <td>{invoice.is_paid === 'true' ? 'Paid' : 'Unpaid'}</td>
        <td><Button className="btn btn-lg btn-success" onClick={ () => this.remove(invoice.invoice_id)} > <FontAwesomeIcon icon={faThumbsUp} /> OK </Button></td>
        <td><Button className="btn btn-lg btn-danger" onClick={ () => this.remove(invoice.invoice_id)} > <FontAwesomeIcon icon={faThumbsDown} /> NOK </Button></td>
        <td><Button className="btn btn-lg btn-info" onClick={ () => this.remove(invoice.invoice_id)} > <FontAwesomeIcon icon={faMoneyCheckAlt} /> 50% </Button></td>
        <td><Button className="btn btn-lg btn-warning" onClick={ () => this.remove(invoice.invoice_id)} ><FontAwesomeIcon icon={faSearchDollar} /> ?? </Button></td>
        <td><Button className="btn btn-lg btn-info" onClick={ () => this.remove(invoice.invoice_id)} > <FontAwesomeIcon icon={faImage} /> Image </Button></td>
      </tr>
  )

  return (
      <div className="container border border-secondary rouded center">
        <div className="row">
          <div className="col-12">
              <h4>Pending Invoices - The Test Comapny</h4>
          </div>
        </div>

        <div className="row">
          <div className=".col-xs-12 center text-center">
            <Table dark responsive striped bordered hover>
                <thead>
                    <tr>
                        <th >Vendor</th>
                        <th>Amount</th>
                        <th>Invoice #</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th colSpan="4">Actions</th>
                        <th>Image</th>
                    </tr>
                </thead>
            
            <tbody>
                {this.state.invoices.length === 0 ? <td colSpan="10">All caught up!</td> : invoices}
            </tbody>
            </Table>

          </div>

        </div>



      </div>

  );
}
}

export default App;
