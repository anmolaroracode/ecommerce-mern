import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  updateAdminProduct,
  createAdminProduct,
} from "../../redux/slices/adminProductsSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth user to get user._id
  const authUser = useSelector((state) => state.auth.user);

  // Admin products
  const { products } = useSelector((state) => state.adminProducts);

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState(null);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  // ------------------------------------------
  // LOAD PRODUCT WHEN EDIT MODE
  // ------------------------------------------
  useEffect(() => {
    if (isEditMode) {
      const found = products?.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setSizeInput(found.size.join(", "));
        setColorInput(found.colour.join(", "));
      }
    } else {
      //Add. 
     setProduct({
  name: "",
  description: "",
  price: "",
  countInStock: "",
  sku: "",
  category: "",
  brand: "",
  size: ["Free Size"],   
  colour: ["Black"],     
  collections: "Default Collection",
  material: "",
  gender: "Unisex",
  images: [
    {
      url: "https://picsum.photos/300",
      altText: "Default product image",
    },
  ],
  user: authUser?._id,    
});

    }
  }, [products, id, isEditMode, authUser]);

  if (!product) return <div className="p-6">Loading...</div>;

  // ------------------------------------------
  // INPUT HANDLERS
  // ------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e) => {
    const v = e.target.value;
    setSizeInput(v);
    setProduct((prev) => ({
      ...prev,
      size: v.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  };

  const handleColorChange = (e) => {
    const v = e.target.value;
    setColorInput(v);
    setProduct((prev) => ({
      ...prev,
      colour: v.split(",").map((c) => c.trim()).filter(Boolean),
    }));
  };

  const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImageUploading(true);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }

    setProduct((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url: data.imageUrl, altText: prev.name },
      ],
    }));

    toast.success("Image uploaded successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Image upload failed");
  }
  setImageUploading(false);
};


  const handleImageDelete = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ------------------------------------------
  // SUBMIT HANDLER
  // ------------------------------------------
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Required fields validation
  if (!product.sku) return toast.error("SKU is required!");
  if (!product.category) return toast.error("Category is required!");
  if (product.size.length === 0) return toast.error("At least one size required!");
  if (product.colour.length === 0) return toast.error("At least one colour required!");
  if (!product.collections) return toast.error("Collections field required!");
  if (!product.user) return toast.error("User ID missing!");
  if(product.images.length === 0) return toast.error("At least one image is required!");
  if(!product.material) return toast.error("Material is required!");

  // Convert number fields explicitly
  const payload = {
    ...product,
    price: Number(product.price),
    countInStock: Number(product.countInStock),
  };

  try {
    if (isEditMode) {
      await dispatch(
        updateAdminProduct({
          productId: product._id,
          updatedData: payload,
        })
      ).unwrap();

      toast.success("Product updated successfully!");
    } else {
      await dispatch(createAdminProduct(payload)).unwrap();
      toast.success("Product created successfully!");
    }

    navigate("/admin/products");
  } catch (err) {
  const message =
    typeof err === "string"
      ? err
      : err?.message || "Operation failed";

  toast.error(message);
}

};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            className="w-full border p-2 rounded"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* SKU */}
        <div className="mb-4">
          <label className="font-medium block mb-1">SKU</label>
          <input
            type="text"
            name="sku"
            className="w-full border p-2 rounded"
            value={product.sku}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price, Stock */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-medium block mb-1">Price</label>
            <input
              type="number"
              name="price"
              className="w-full border p-2 rounded"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-medium block mb-1">Count In Stock</label>
            <input
              type="number"
              name="countInStock"
              className="w-full border p-2 rounded"
              value={product.countInStock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Category</label>
          <input
            type="text"
            name="category"
            className="w-full border p-2 rounded"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Gender</label>
          <select
            name="gender"
            className="w-full border p-2 rounded"
            value={product.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Mateial */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Material</label>
          <input
            type="text"
            name="material"
            className="w-full border p-2 rounded"
            value={product.material}
            onChange={handleChange}
          />
        </div>

        {/* Brand */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            className="w-full border p-2 rounded"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Sizes (comma separated)</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={sizeInput}
            onChange={handleSizeChange}
          />
        </div>

        {/* Colours */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Colours (comma separated)</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={colorInput}
            onChange={handleColorChange}
          />
        </div>

        {/* Collections */}
        <div className="mb-4">
          <label className="font-medium block mb-1">Collections</label>
          <input
            type="text"
            name="collections"
            className="w-full border p-2 rounded"
            value={product.collections}
            onChange={handleChange}
            required
          />
        </div>

        {/* IMAGES */}
        <div className="mb-6">
          <label className="font-medium block mb-1">Images</label>
          <input type="file" onChange={handleImageUpload} />
          <div className="flex flex-wrap gap-3 mt-3">
            {product.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img.url} className="w-20 h-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageDelete(i)}
                  className="absolute top-0 right-0 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`px-5 py-2 bg-black text-white rounded hover:bg-gray-700 ${
            imageUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={imageUploading}
        >
          {imageUploading ? "Uploading Image" : isEditMode ? "Save Changes" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
