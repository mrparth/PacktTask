import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from './pages/ProductList/ProductList';
import ProductDetail from "./pages/ProductDetail/ProductDetail"

function Main() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<ProductList />} />
                <Route path="/:id" element={<ProductDetail />} />
            </Routes>
        </Router>
    );
}

export default Main;

if (document.getElementById('app')) {
    ReactDOM.render(<Main />, document.getElementById('app'));
}