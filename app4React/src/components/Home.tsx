import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { Mediator } from '../mediator';


interface IState {
    customers: any[];
    message: string;
    messagePresent: boolean;
    navs: string[];
}

let mediator: Mediator;

export default class Home extends React.Component<RouteComponentProps, IState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { customers: [], message: '', messagePresent: false, navs: [] }
    }

    public async componentDidMount() {
        mediator = new Mediator(this);
        this.setState( {messagePresent: false} );

        if (!mediator.isConnected()) {
        await mediator.connect();
        }
        //let href = window.location.href;
        let pathname = window.location.pathname;
        console.log('window.location: ', window.location.href);
        await mediator.frameLoaded(window.origin, pathname);

        axios.get(`http://localhost:3200/customers`).then(data => {
            this.setState({ customers: data.data })
        })
    }

    public componentWillUnmount() {
        mediator.disconnect();
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
        let navs = this.state.navs;
        return (    
            <div>
                <nav className="submenu">
                    <ul>
                        {navs.map(nav => (
                        <li >
                            <a href="#" onClick={() => mediator.navigate(nav, {sample:"payload"})}>{nav.substring(1)}</a>
                        </li>
                        ))}
                    </ul>
                </nav>

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
