import React from 'react';
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <div>
            <header class="section-header header-bar">
                <section class="header-main border-bottom">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-2 col-4">
                                <Link to={'/'}>
                                    <img class="logo-img" src="assets/images/logos/logo.png"></img>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </header>
            <div class="container">{children}</div>
        </div>
    )
}

export default Layout;