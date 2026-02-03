import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeItemFromCart } from '../../redux/slices/cartSlice';
import { toast } from 'sonner';
import { useEffect } from 'react';

const CartContents = ({ cartItems, userId, guestId }) => {
  const dispatch = useDispatch();

  // SAFELY extract products from ANY backend shape
  const products =
    cartItems?.products ||
    cartItems?.cart?.products ||
    (Array.isArray(cartItems) ? cartItems : []);

  // EMPTY CART VIEW
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p className="text-lg font-medium">Your cart is empty.</p>
      </div>
    );
  }

  // Totals
  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId, delta, quantity, size, colour) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;

    dispatch(
      updateCartItem({
        productId,
        quantity: newQuantity,
        userId,
        guestId,
        size,
        colour,
      })
    );
  };
   const handleRemove = (productId, size, colour) => {
    dispatch(
      removeItemFromCart({
        productId,
        userId,
        guestId,
        size,
        colour,
      })
    );
  };

  return (
    <div className="space-y-5">
      {products.map((product) => (
        <div
         key={`${product.productId}-${product.size}-${product.colour}`}
          className="flex items-start gap-3 p-3 border rounded-lg shadow-sm bg-white"
        >
          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-24 rounded-md object-cover flex-shrink-0"
          />

          {/* Right content */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            
            {/* Name + details */}
            <div className="space-y-1 min-w-0">
             <h2 className="text-sm font-semibold leading-tight truncate max-w-[180px] md:max-w-full">
               {product.name}
             </h2>


              <p className="text-xs text-gray-500">
                Size: {product.size} • Colour: {product.colour || product.color || "N/A"}
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-2 w-full">
              
              {/* Quantity */}
              <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                <button
                  className="px-3 py-1 text-lg font-medium"
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.colour
                    )
                  }
                >
                  –
                </button>

                <span className="px-4 py-1 text-sm font-medium">
                  {product.quantity}
                </span>

                <button
                  className="px-3 py-1 text-lg font-medium"
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.colour
                    )
                  }
                >
                  +
                </button>
              </div>

              {/* Price + delete */}
              <div className="flex flex-col items-end ml-3 flex-shrink-0">
                <p className="text-sm font-bold">₹{product.price}</p>

                <button
                  className="text-red-500 hover:text-red-700 mt-1"
                  onClick={() =>
                    handleRemove(product.productId, product.size, product.colour)
                  }
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* SUMMARY */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold"> ₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold">₹{shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between pt-2 border-t text-base font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartContents;
