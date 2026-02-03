// (if not) Make sure this file is located at: src/components/checkout/Checkout.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  createCheckoutSession,
  updateCheckoutToPaid,
  finalizeCheckout,
} from "../../redux/slices/checkoutSlice";

import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth || {});

  const [isCheckoutId, setIsCheckoutId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // (if not) Load Razorpay script only once
  useEffect(() => {
    const id = "razorpay-checkout-script";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        const s = document.getElementById(id);
        if (s) s.remove();
      };
    }
  }, []);

  // (if not) Redirect if cart is empty, EXCEPT on order-confirmation page
  useEffect(() => {
    if (
      (!cartItems || !cartItems.products || cartItems.products.length === 0) &&
      window.location.pathname !== "/order-confirmation"
    ) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  if (!cartItems?.products || cartItems.products.length === 0) return null;

  // (if not) Calculate subtotal + conditional shipping
  var shipping = 0;
  const computeTotal = () => {
    const subtotal = cartItems.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

     shipping = subtotal >= 299 ? 0 : 99;

    return subtotal + shipping;
  };

  // (if not) Create checkout session
  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const totalAmount = computeTotal();

      const res = await dispatch(
        createCheckoutSession({
          checkoutItems: cartItems.products,
          shippingAddress,
          paymentMethod: "razorpay",
          totalPrice: totalAmount,
        })
      );

      if (res.meta.requestStatus === "fulfilled") {
        setIsCheckoutId(res.payload._id);
      } else {
        const err = res.payload || "Failed to create checkout";
        alert(typeof err === "string" ? err : JSON.stringify(err));
      }
    } catch (err) {
      console.error("Create checkout error:", err);
      alert("Error creating checkout session");
    } finally {
      setLoading(false);
    }
  };

  // (if not) Open Razorpay + handle payment
  const handleRazorpayPayment = async () => {
    if (!isCheckoutId) {
      alert("Please create a checkout session first.");
      return;
    }

    try {
      setLoading(true);

      const totalAmount = computeTotal();

      // Razorpay order creation
      const orderRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/razorpay/order`,
        { amount: Math.round(totalAmount) },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const order = orderRes.data;

      if (!order || !order.id) {
        throw new Error("Failed to create Razorpay order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: order.id,

        // (if not) Razorpay payment success handler
        handler: async (response) => {
          try {
            setLoading(true);

            // Update payment status
            const paidRes = await dispatch(
              updateCheckoutToPaid({
                checkoutId: isCheckoutId,
                paymentStatus: "paid",
                paymentDetails: response,
              })
            );

            if (paidRes.meta.requestStatus !== "fulfilled") {
              alert("Payment saved but update failed.");
              return;
            }

            // Finalize order
            const finalRes = await dispatch(
              finalizeCheckout({ checkoutId: isCheckoutId })
            );

            if (finalRes.meta.requestStatus !== "fulfilled") {
              alert("Order not finalized. Backend error.");
              return;
            }

            // Clear cart + Navigate
            if (finalRes.meta.requestStatus === "fulfilled") {
              const orderId = finalRes.payload._id;
              dispatch(clearCart());
              navigate(`/order-confirmation?orderId=${orderId}`);
            }
          } catch (err) {
            console.error("Post-payment error:", err);
            alert(
              "Payment succeeded but order could not finalize. Contact support."
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: shippingAddress.phone || "",
        },

        notes: {
          checkoutId: isCheckoutId,
        },

        theme: {
          color: "#6861f2",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp) {
        console.error("Payment failed:", resp);
        alert("Payment failed. Please try again.");
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Unable to start Razorpay. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Checkout Form */}
      <div className="bg-white rounded-lg p-8 shadow flex flex-col justify-center">
        <h2 className="text-2xl mb-6 uppercase font-semibold">Checkout</h2>

        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* Contact Details */}
          <div>
            <h3 className="text-lg mb-4 font-medium">Contact Details</h3>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || "user@example.com"}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          {/* Delivery */}
          <div>
            <h3 className="text-lg mb-4 font-medium">Delivery</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6">
            {!isCheckoutId ? (
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 text-white py-2 rounded-lg transition"
                disabled={loading}
              >
                {loading ? "Creating checkout..." : "Proceed to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4 font-medium">
                  Pay with UPI / Razorpay
                </h3>

                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-gray-100 rounded-lg p-4 shadow flex flex-col">
        <h2 className="text-lg mb-4 border-b pb-2 font-semibold">
          Order Summary
        </h2>

        <div>
          {cartItems.products.map((product, index) => (
            <div
              key={product._id || index}
              className="flex gap-4 mb-4 border-b pb-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex justify-between w-full">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">
                    Colour: {product.color}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>

                <p className="text-sm font-semibold">₹{product.price}</p>
              </div>
            </div>
          ))}

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-sm font-semibold">
                ₹
                {cartItems.products.reduce(
                  (sum, p) => sum + p.price * p.quantity,
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Shipping</span>
              <span className="text-sm font-semibold">{shipping}</span>
            </div>

            <div className="flex justify-between mt-4 pt-2 border-t">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold">
                ₹{computeTotal()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
