import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/HeroTemp";
import GenderCollSection from "../components/Products/GenderCollSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollections from "../components/Products/FeaturedCollections";
import FeatureSection from "../components/Products/FeatureSection";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProducts } from "../redux/slices/productsSlice";

const Homee = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.products
  );
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        gender: "Women",
        category: "Top Wear",
        limit: 8,
      })
    );

    const fetchBestSellerProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-sellers`
        );
        setBestSeller(response.data || []);
      } catch (err) {
        console.error("Error fetching best sellers", err);
        setBestSeller([]);
      }
    };

    fetchBestSellerProducts();
  }, [dispatch]);

  return (
    <>
      <Hero />
      <GenderCollSection />
      <NewArrivals />

      {/* BEST SELLER */}
      <h2 className="text-3xl text-center font-bold mb-4">
        Best Seller
      </h2>

      {bestSeller.length > 0 ? (
        <ProductDetails productId={bestSeller[0]._id} />
      ) : (
        <p className="text-center text-gray-500">
          No best seller products available
        </p>
      )}

      {/* TOP WEARS */}
      <div className="container mx-auto gap-6">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>

        <ProductGrid
          products={products}
          loading={loading.products}
          error={error.products}
        />
      </div>

      <FeaturedCollections />
      <FeatureSection />
    </>
  );
};

export default Homee;
