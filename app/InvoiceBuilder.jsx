import React from "react";
import bs58 from "bs58";
import lzma from "lzma";

let invoice_example = {
    "to": "merchant_account_name",
    "to_label": "Merchant Name",
    "currency": "TEST",
    "memo": "Invoice #1234",
    "line_items": [
        {"label": "Something to Buy", "quantity": 1, "price": "1000.00"},
        {"label": "10 things to Buy", "quantity": 10, "price": "1000.00"}
    ],
    "note": "Something the merchant wants to say to the user",
    "callback": "https://merchant.org/complete"
};

class InvoiceBuilder extends React.Component {

    constructor() {
        super();
        this.state = {invoice: invoice_example, compressed_data: null};
    }

    formChange(e) {
        //console.log("[InvoiceBuilder.jsx:18] ----- formChange ----->", e.target.name, e.target.value);
        let invoice = this.state.invoice;
        let target_name = e.target.name;
        let match = target_name.match(/li\-(\d+)\-(\w+)/)
        if (match) {
            let index = match[1];
            let field = match[2];
            invoice.line_items[index][field] = e.target.value
            console.log("[InvoiceBuilder.jsx:28] ----- formChange ----->", match);
        } else {
            invoice[target_name] = e.target.value;
        }
        this.setState({invoice});
    }

    updateCompressedData() {
        lzma.compress(JSON.stringify(this.state.invoice), 1, compressed_data => {
            let buf = new Buffer(compressed_data);
            let data = buf.toString("hex");
            React.findDOMNode(this.refs.compressed_data).innerHTML = data;
            React.findDOMNode(this.refs.compressed_data_link).href = "http://localhost:8080//#/invoice/" + data;
        });
    }

    componentDidMount() {
        this.updateCompressedData();
    }

    componentDidUpdate() {
        this.updateCompressedData();
    }

    removeLineItem(e) {
        e.preventDefault();
        let invoice = this.state.invoice;
        invoice.line_items.splice(e.target.dataset.index, 1);
        this.setState({invoice});
    }

    addLineItem(e) {
        e.preventDefault();
        let invoice = this.state.invoice;
        invoice.line_items.push({"label": "", "quantity": 1, "price": "0.00"});
        this.setState({invoice});
    }

    render() {
        let items = this.state.invoice.line_items.map((item, index) => {
            return (
                <tr>
                    <td><input type="text" name={`li-${index}-label`} value={item.label}/></td>
                    <td><input type="text" name={`li-${index}-quantity`} value={item.quantity}/></td>
                    <td><input type="text" name={`li-${index}-price`} value={item.price}/></td>
                    <td><a href data-index={index} onClick={this.removeLineItem.bind(this)}>X</a></td>
                </tr>
            );
        });
        return (
            <div className="grid-block vertical">
                <div className="grid-content no-overflow">
                    <h3>Bitshares Invoice Builder</h3>

                    <form className="grid-block" onChange={this.formChange.bind(this)}>
                        <div className="small-4">
                            <div className="grid-content">
                                <label>TO</label>
                                <input type="text" name="to" ref="to" value={this.state.invoice.to}/>
                            </div>
                            <div className="grid-content">
                                <label>TO LABEL</label>
                                <input type="text" name="to_label" ref="to_label" value={this.state.invoice.to_label}/>
                            </div>
                            <div className="grid-content">
                                <label>CURRENCY</label>
                                <input type="text" name="currency" ref="currency" value={this.state.invoice.currency}/>
                            </div>
                            <div className="grid-content">
                                <label>MEMO</label>
                                <input type="text" name="memo" ref="memo" value={this.state.invoice.memo}/>
                            </div>
                            <div className="grid-content">
                                <label>NOTE</label>
                                <input type="text" name="note" ref="note" value={this.state.invoice.note}/>
                            </div>
                            <div className="grid-content">
                                <label>CALLBACK</label>
                                <input type="text" name="callback" ref="callback" value={this.state.invoice.callback}/>
                            </div>
                        </div>
                        <div className="small-8">
                            <div className="grid-content">
                                <label>LINE ITEMS</label>
                                <div className="line-items">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>LABEL</th>
                                            <th>quantity</th>
                                            <th>price</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {items}
                                        </tbody>
                                    </table>
                                </div>
                                <a href className="button" onClick={this.addLineItem.bind(this)}>+ Add Item</a>
                            </div>
                        </div>
                    </form>

                    <div className="grid-block">
                        <div className="small-4">
                            <div className="grid-content">
                                <h4>JSON</h4>
                                <pre>{JSON.stringify(this.state.invoice, null, 4)}</pre>
                            </div>
                        </div>
                        <div className="small-8">
                            <div className="grid-content">
                                <h4>Compressed Data</h4>
                                <div className="compressed-data" ref="compressed_data"></div>
                                <br/>
                                <a ref="compressed_data_link" href className="button" target="_blank">Review and pay</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InvoiceBuilder;
