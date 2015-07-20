require("./assets/stylesheets/app.scss");
import React from "react";
import InvoiceBuilder from "./InvoiceBuilder"

class App extends React.Component {
    render() {
        return (
            <div className="grid-frame vertical">
                <InvoiceBuilder/>
            </div>
        );
    }

}

React.render(<App/>, document.getElementById("content"));
