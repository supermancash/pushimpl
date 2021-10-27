import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import React from "react";

import LoginMask from "./components/LoginMask";
import Subscribe from "./components/Subscribe";

const App = () => {
    return (
        <Router>
            <Route exact path="/" component={Subscribe}/>
            <Route path="/admin" component={LoginMask}/>
        </Router>
    );
}

export default App;
