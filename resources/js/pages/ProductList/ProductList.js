import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Swal from 'sweetalert2';
import './ProductListStyles.css';

function ProductList() {
    const limit = 8;
    const [productListItem, setProductListItem] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        loadData();
    }, [page])

    const loadData = async () => {
        try {
            setIsLoading(true);
            const url = "/api/products";
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            };

            const params = {
                page,
                per_page: limit
            };
            const response = await axios.get(url, { params, headers });
            if (response.status == 200 && response.data.status == 'success') {
                setProductListItem((productListItem) => [...productListItem, ...response.data.data.products]);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: (response.message) ? response.message : 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 2500
                })
            }

            setErrorMessage('');
        } catch (error) {
            console.error(error);
            setErrorMessage('Error while loading data. Try again later.');
        } finally {
            setIsLoading(false);
        }
    };


    const doLoadMore = () => {
        setPage((page) => page + 1);
    };

    return (
        <Layout>
            <section class="section-content padding-y">
                <div class="container">
                    <div class="row">
                        <main class="col-md-12">
                            <div class="row">
                                {productListItem && productListItem.map((product, key) => {
                                    return (
                                        <div class="col-md-3" key={key}>
                                            <figure class="card card-product-grid">
                                                <div class="img-wrap">
                                                    <img src={product.cover_image != '' ? product.cover_image : 'assets/images/no-image.jpg'} />
                                                </div>
                                                <figcaption class="info-wrap">
                                                    <div class="fix-height">
                                                        <h5 class="product-title">{product.title}</h5>
                                                    </div>
                                                    <Link
                                                        to={`/${product.id}`}
                                                        className="btn btn-block product-button">
                                                        View Details
                                                    </Link>
                                                </figcaption>
                                            </figure>
                                        </div>
                                    )
                                })}
                            </div>
                        </main>
                    </div>
                    <div class="row load-more-wrapper">
                        {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
                        {
                            (productListItem && productListItem.length > 0) ?
                                <button type="button" className={`btn load-more-button ${isLoading ? 'load-more-disable' : ''}`} disabled={isLoading} onClick={doLoadMore}> {isLoading ? 'Loading...' : 'Load More'}</button>
                                : <div class="loading-text">Loading...</div>
                        }
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default ProductList;