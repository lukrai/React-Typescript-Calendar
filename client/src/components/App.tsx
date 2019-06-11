import React from "react";
import Header from "./Header";

import {BrowserRouter, Route} from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div>
                <Header/>
                <Route exact path="/" component={Home}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/dashboard" component={Dashboard}/>
                {/*{props.children}*/}
            </div>
        </BrowserRouter>
    );
};

export default App;
