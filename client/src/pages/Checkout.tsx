import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useProfile } from '../hooks/useProfile';
import { useAddresses } from '../hooks/useAddresses';
import { useAuth } from '../context/AuthContext';
import { CreateOrderPayload } from '../api/orders';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Checkout = () => {
  const { items, updateQuantity, removeItem, cartTotal, itemCount, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { profile } = useProfile();
  const { addresses, defaultAddress, loading: addressesLoading, refetch: refetchAddresses } = useAddresses();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [newAddress, setNewAddress] = useState({
    label: '',
    full_name: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false,
  });

  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setMode('saved');
    } else if (!addressesLoading && addresses.length === 0) {
      setMode('new');
    }
  }, [defaultAddress, addresses.length, addressesLoading]);

  useEffect(() => {
    if (profile && mode === 'new' && !newAddress.full_name) {
      setNewAddress((prev) => ({
        ...prev,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        phone_number: profile.phone_number || prev.phone_number,
      }));
    }
  }, [profile, mode, newAddress.full_name]);

  const shipping = 50.00;
  const tax = cartTotal * 0.05;
  const finalTotal = cartTotal + shipping + tax;

  const isNewAddressValid =
    newAddress.full_name.trim() &&
    newAddress.address_line1.trim() &&
    newAddress.city.trim() &&
    newAddress.state.trim() &&
    newAddress.postal_code.trim();

  const canPlaceOrder =
    isAuthenticated &&
    ((mode === 'saved' && selectedAddressId != null) || (mode === 'new' && isNewAddressValid));

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to complete your purchase');
      navigate('/auth');
      return;
    }

    if (mode === 'saved' && !selectedAddressId) {
      setOrderError('Please select a shipping address.');
      return;
    }
    if (mode === 'new' && !isNewAddressValid) {
      setOrderError('Please fill in all required address fields.');
      return;
    }

    try {
      setIsPlacingOrder(true);
      setOrderError(null);

      const payload: CreateOrderPayload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      if (mode === 'saved' && selectedAddressId) {
        payload.address_id = selectedAddressId;
      } else {
        payload.shipping_address = newAddress;
        payload.save_address = saveAddress;
      }

      await placeOrder(payload);
      toast.success('Order placed successfully! Thank you for shopping with HerbalUdyog.');
      clearCart();
      if (mode === 'new' && saveAddress) {
        refetchAddresses();
      }
      navigate('/dashboard/orders');
    } catch (err: any) {
      const errMsg = err.message || 'Failed to place order. Please try again.';
      setOrderError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-32 text-center">
        <Package className="w-20 h-20 text-on-surface-variant/30 mx-auto mb-8" />
        <h1 className="font-display-lg text-4xl md:text-5xl mb-6 tracking-tight text-on-surface">Your Basket is Empty</h1>
        <p className="font-body-lg text-on-surface-variant mb-10 max-w-md mx-auto">
          Explore our marketplace to discover organic wellness products.
        </p>
        <Link to="/marketplace">
          <Button size="lg">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-md mb-6 uppercase tracking-widest text-xs">
        <ArrowLeft className="w-3 h-3" />
        Continue Shopping
      </Link>

      <h1 className="font-display-lg text-3xl md:text-4xl mb-8 tracking-tight text-on-surface">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-6">
          {/* Shipping address */}
          {isAuthenticated && (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm">
              <h2 className="font-headline-md text-2xl mb-6 border-b border-outline-variant/30 pb-6 text-on-surface tracking-tight">
                Shipping Address
              </h2>

              {addressesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {addresses.length > 0 && (
                    <div className="flex gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setMode('saved')}
                        className={`px-4 py-2 rounded-full font-label-md text-sm transition-colors ${
                          mode === 'saved'
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Saved addresses
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('new')}
                        className={`px-4 py-2 rounded-full font-label-md text-sm transition-colors ${
                          mode === 'new'
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Add new address
                      </button>
                    </div>
                  )}

                  {mode === 'saved' && addresses.length > 0 && (
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${
                            selectedAddressId === addr.id
                              ? 'border-primary bg-primary-container/20'
                              : 'border-outline-variant/30 hover:border-outline'
                          }`}
                        >
                          <input
                            type="radio"
                            name="checkout-address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1"
                          />
                          <div className="text-on-surface leading-relaxed">
                            <div className="flex items-center gap-2 mb-1">
                              {addr.label && (
                                <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant">
                                  {addr.label}
                                </span>
                              )}
                              {addr.is_default && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-on-primary">Default</span>
                              )}
                            </div>
                            <p className="font-label-lg">{addr.full_name}</p>
                            {addr.phone_number && <p className="text-sm text-on-surface-variant">{addr.phone_number}</p>}
                            <p>{addr.address_line1}</p>
                            {addr.address_line2 && <p>{addr.address_line2}</p>}
                            <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                            <p>{addr.country}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {(mode === 'new' || addresses.length === 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Label (optional)"
                        placeholder="Home, Office…"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      />
                      <Input
                        label="Full Name"
                        required
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                      />
                      <Input
                        label="Phone"
                        value={newAddress.phone_number}
                        onChange={(e) => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 1"
                          required
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 2"
                          value={newAddress.address_line2}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                        />
                      </div>
                      <Input
                        label="City"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                      <Input
                        label="State"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                      <Input
                        label="Postal Code"
                        required
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      />
                      <Input
                        label="Country"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      />
                      <label className="md:col-span-2 flex items-center gap-2 text-sm text-on-surface">
                        <input
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="rounded border-outline"
                        />
                        Save this address to my address book
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 shadow-sm">
            <h2 className="font-headline-md text-2xl mb-8 border-b border-outline-variant/30 pb-6 text-on-surface tracking-tight">
              Items ({itemCount})
            </h2>
            <ul className="space-y-8">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                  <div className="w-28 h-28 rounded-2xl bg-[#F5F5F7] overflow-hidden shrink-0 border border-outline-variant/20">
                    <img
                      src={
                        item.product.primary_image ||
                        (item.product.images?.length > 0
                          ? item.product.images.find((i: any) => i.is_primary)?.image_url || item.product.images[0].image_url
                          : null)
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-label-lg text-xl text-on-surface pr-4 leading-tight">{item.product.name}</h3>
                      </div>
                      {item.size && <p className="font-body-sm text-on-surface-variant text-sm mb-4">Size: {item.size}</p>}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-outline-variant/50 rounded-xl bg-surface px-1 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"
                          >
                            −
                          </button>
                          <span className="font-label-md text-sm w-10 text-center text-on-surface">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-xs font-label-md uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-2xl font-medium text-on-surface">
                        ₹{(Number(item.product.effective_price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 sticky top-28 shadow-sm">
            <h2 className="font-headline-md text-2xl mb-8 text-on-surface tracking-tight">Order Summary</h2>

            <div className="space-y-5 mb-8 font-body-md text-on-surface/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-on-surface">₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-medium text-on-surface">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="font-headline-sm text-lg text-on-surface">Total</span>
                <span className="font-display-md text-3xl font-bold text-on-surface">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {orderError && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm text-sm border border-error/20">
                {orderError}
              </div>
            )}

            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={isPlacingOrder || (isAuthenticated && !canPlaceOrder)}
              className="w-full h-14 text-lg mb-6"
            >
              {!isAuthenticated ? 'Login to Checkout' : isPlacingOrder ? 'Processing...' : 'Place Order'}
            </Button>
            <p className="font-body-sm text-xs text-center text-on-surface-variant">
              By proceeding, you support pure herbal, high-quality, and organic wellness practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
