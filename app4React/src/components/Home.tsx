import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { PostMessage } from './postMessage';
import axios from 'axios';


interface IState {
    customers: any[];
    message: string;
    messagePresent: boolean;
}

export default class Home extends React.Component<RouteComponentProps, IState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { customers: [], message: '', messagePresent: false }
    }

    public componentDidMount(): void {
        let messenger: PostMessage;
        this.setState( {messagePresent: false} );
    
        window.addEventListener('message', e => { 
    
              console.log('message: ', e);
              if (e.data.message) {
                this.setState( {messagePresent: true} );
                let msg = e.data.message;
                this.setState( {message: 'Message arrived from [' + e.origin + ']: ' + msg.text} )
                
                setTimeout(() => this.setState( {messagePresent: false} ), 4000);
    
                if (!messenger) {
                    messenger = new PostMessage(window.parent, e.origin);
                }
    
                messenger.postMessage({
                    "sender": e.data.recipient,
                    "text": "Echoing.... " + msg.text
                });
    
                //if (e.origin!="http://localhost:4200") {
                //  return false;
                //}
              }
    
        });

        axios.get(`http://localhost:3200/customers`).then(data => {
            this.setState({ customers: data.data })
        })
    }

    public deleteCustomer(id: number) {
        axios.delete(`http://localhost:3200/customers/${id}`).then(data => {
            const index = this.state.customers.findIndex(customer => customer.id === id);
            this.state.customers.splice(index, 1);
            this.props.history.push('/');
        })
    }

    public render() {
        const customers = this.state.customers;
        let messagePresent = this.state.messagePresent;
        let message = this.state.message;
        return (
            <div>
                {messagePresent && (
                    <div className="text-center">
                        <h2>{message}</h2>
                    </div>
                )}

                {customers.length === 0 && (
                    <div className="text-center">
                        <h2>No customer found at the moment</h2>
                    </div>
                )}

                <div className="container">
                    <div className="row">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Firstname</th>
                                    <th scope="col">Lastname</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers && customers.map(customer =>
                                    <tr key={customer.id}>
                                        <td>{customer.first_name}</td>
                                        <td>{customer.last_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.description}</td>
                                        <td>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="btn-group" style={{ marginBottom: "20px" }}>
                                                    <Link to={`edit/${customer.id}`} className="btn btn-sm btn-outline-secondary">Edit Customer </Link>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => this.deleteCustomer(customer.id)}>Delete Customer</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}
