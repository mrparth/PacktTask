import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import Swal from 'sweetalert2';
import './ProductDetailStyles.css';
import Moment from 'moment';

function ProductDetail() {
    const [id, setId] = useState(useParams().id);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [productTitle, setProductTitle] = useState("");
    const [productTagline, setProductTagline] = useState("");
    const [productCover, setProductCover] = useState("");
    const [productISBN, setProductISBN] = useState("");
    const [productPages, setProductPages] = useState("");
    const [productPubDate, setProductPubDate] = useState("");
    const [productDescription, setProductDescription] = useState("");

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        try {
            setIsLoading(true);
            const url = "/api/products/" + id;
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            };

            const response = await axios.get(url, { headers });
            if (response.status == 200 && response.data.status == 'success') {
                console.log(response.data.data);
                setProductTitle(response.data.data.title);
                setProductTagline(response.data.data.tagline);
                setProductCover(response.data.data.cover_image);
                setProductISBN(response.data.data.isbn13);
                setProductPages(response.data.data.pages);
                setProductPubDate(Moment(response.data.data.publication_date).format('MMM YYYY'));
                setProductDescription(response.data.data.description);
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

    return (
        <Layout>

            <section class="section-content padding-y">
                <div class="container">
                    <div class="row">
                        <main class="col-md-12">
                            {isLoading ? <div class="loading-text">Loading...</div> :
                                <div class="row">
                                    <div class="col-md-4">
                                        <img src={productCover} class="cover-image"></img>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="product-desc-title">{productTitle || ''}</div>
                                        <div class="mt-4 product-tagline">{productTagline}</div>
                                        <div class="mt-4">
                                            <ul class="product-table">
                                                <li class="price-table-item">
                                                    <span class="col-title">
                                                        ISBN
                                                    </span>
                                                    <span class="col-value">
                                                        {productISBN}
                                                    </span>
                                                </li>
                                                <li class="price-table-item">
                                                    <span class="col-title">
                                                        PAGES
                                                    </span>
                                                    <span class="col-value">
                                                        {productPages}
                                                    </span>
                                                </li>
                                                <li class="price-table-item">
                                                    <span class="col-title">
                                                        PUBLICATION DATE
                                                    </span>
                                                    <span class="col-value">
                                                        {productPubDate}
                                                    </span>
                                                </li>

                                            </ul>
                                        </div>

                                        <div class="mt-4">
                                            <div class="product-about-this-book">About this book</div>
                                            <div class="product-description" dangerouslySetInnerHTML={{ __html: productDescription }} >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                        </main>
                    </div>
                </div>
            </section>

        </Layout>
    );
}

export default ProductDetail;