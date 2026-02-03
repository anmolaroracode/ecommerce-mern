import React, { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAdminProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductsSlice";

const ProductsManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );

  //Fetch products
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleEdit = (product) => {
    navigate(`/admin/products/${product._id}/edit`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteAdminProduct(productId)).unwrap();
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Products Management
            </h1>
            <p className="text-gray-600">
              Manage all products — Add, Edit, Delete.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products/add")}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white 
                       rounded-full shadow-md hover:bg-green-700 transition-all
                       active:scale-95 border border-green-700"
          >
            <span className="text-2xl font-bold">+</span>
            <span className="font-medium">Add Product</span>
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="flex-1 bg-white rounded-xl border shadow-md overflow-hidden">
          <div className="h-full overflow-y-auto">

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {/* LOADING STATE */}
                {loading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-gray-500 text-lg"
                    >
                      Loading products...
                    </td>
                  </tr>
                )}

                {/* ERROR STATE */}
                {!loading && error && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-red-500 text-lg"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {/* PRODUCTS */}
                {!loading && !error && products.length > 0 &&
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="px-6 py-4 text-gray-800">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        ₹{product.price.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {product.sku}
                      </td>

                      <td className="px-6 py-4 flex gap-2">
                        <button
                          className="px-4 py-1.5 bg-blue-500 text-white rounded-lg 
                                     hover:bg-blue-600 transition active:scale-95"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="px-4 py-1.5 bg-red-500 text-white rounded-lg 
                                     hover:bg-red-600 transition active:scale-95"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* EMPTY STATE */}
                {!loading && !error && products.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-gray-500 text-lg"
                    >
                      No products found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManagement;
