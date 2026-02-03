import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductDetails,
  fetchRecommendedProducts,
} from '../../redux/slices/productsSlice';
import { addItemToCart } from '../../redux/slices/cartSlice' // adjust path if needed

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // ✅ Correct destructuring
  const { selectedProduct, loading, error, recommendedProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  // Fetch product details & recommended items
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchRecommendedProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  // Set initial image safely
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedColour || !selectedSize) {
      toast.error('Please select a colour and size before adding to cart.');
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addItemToCart({
        productId: productFetchId,
        quantity: selectedQuantity,
        size: selectedSize,
        colour:selectedColour,
        guestId,
        userId: user?._id
      })
    )
      .then(() => {
        toast.success('Product added to cart successfully!', { duration: 1000 });
      })
      .catch(() => {
        toast.error('Failed to add product to cart.');
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // ✅ Handle loading and error safely
  if (loading.selectedProduct) {
    return <p className="text-center mt-10">Loading product details...</p>;
  }

  if (error.selectedProduct) {
    return <p className="text-center text-red-600 mt-10">Error: {error.selectedProduct}</p>;
  }

  if (!selectedProduct) {
    return <p className="text-center mt-10">No product found.</p>;
  }

 return (
  <div className="w-full max-w-6xl mx-auto px-4 py-10">
    <div className="flex flex-col md:flex-row gap-12">

      {/* LEFT SECTION */}
      <div className="flex gap-6">

        {/* Thumbnails */}
        <div className="hidden md:flex flex-col space-y-4">
          {selectedProduct?.images?.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt=""
              className={`h-20 w-20 object-cover rounded-lg cursor-pointer border ${
                mainImage === image.url ? "border-black" : "border-gray-300"
              }`}
              onClick={() => setImage(image.url)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div>
          <img
            src={mainImage || selectedProduct?.images?.[0]?.url}
            alt="Product"
            className="w-[450px] h-auto object-cover rounded-xl"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1">

        <h1 className="text-3xl font-bold mb-3">{selectedProduct.name}</h1>

        {selectedProduct.originalPrice && (
          <p className="text-lg text-gray-500 line-through">
            ₹{selectedProduct.originalPrice}
          </p>
        )}

        <p className="text-2xl font-semibold mb-4">₹{selectedProduct.price}</p>

        <p className="text-gray-700 mb-6 max-w-lg">
          {selectedProduct.description}
        </p>

        {/* Colors */}
        <div className="mb-5">
          <p className="font-medium mb-2">Color:</p>
          <div className="flex gap-3">
            {selectedProduct?.colour?.map((colour) => (
              <button
                key={colour}
                style={{ backgroundColor: colour.toLowerCase() }}
                className={`w-6 h-6 rounded-full border cursor-pointer ${
                  selectedColour === colour
                    ? "ring-2 ring-black"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedColour(colour)}
              ></button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-5">
          <p className="font-medium mb-2">Size:</p>
          <div className="flex gap-3">
            {selectedProduct?.size?.map((size) => (
              <button
                key={size}
                className={`px-3 py-1.5 text-sm border rounded-md ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <p className="font-medium mb-2">Quantity:</p>
          <div className="flex items-center gap-3">
            <button
              className="px-2.5 py-1 text-sm border rounded-md bg-gray-200"
              onClick={() =>
                setSelectedQuantity(Math.max(1, selectedQuantity - 1))
              }
            >
              -
            </button>

            <span className="text-lg">{selectedQuantity}</span>

            <button
              className="px-2.5 py-1 text-sm border rounded-md bg-gray-200"
              onClick={() => setSelectedQuantity(selectedQuantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* ADD TO CART */}
        <button
          className={`w-full py-2 text-sm bg-black text-white rounded-md mb-10 ${
            isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddToCart}
        >
          {isButtonDisabled ? "Adding..." : "ADD TO CART"}
        </button>

        {/* Characteristics */}
        <h2 className="text-xl font-semibold mb-3">Characteristics:</h2>

        <table className="w-full text-gray-700 text-sm">
          <tbody>
            <tr>
              <td className="py-2 font-medium">Brand</td>
              <td className="py-2">{selectedProduct.brand}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Material</td>
              <td className="py-2">{selectedProduct.material}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    {/* Recommended */}
    <div className="mt-20">
      <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
      <ProductGrid products={recommendedProducts} loading={loading.recommendedProducts} error={error.recommendedProducts} />
    </div>
  </div>
);
};

export default ProductDetails;
