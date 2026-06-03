import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Minus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

function assetBase(): string {
  const raw =
    import.meta.env.VITE_PUBLIC_ASSET_BASE_URL ||
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/i, '') ||
    '';
  return String(raw).replace(/\/$/, '');
}

function productImageUrl(images?: string[]): string {
  const first = images?.[0]?.trim();
  if (!first) return '';
  if (first.startsWith('http')) return first;
  const base = assetBase();
  const path = first.startsWith('/') ? first : `/${first}`;
  return base ? `${base}${path}` : path;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productsAPI.getById(id!);
      console.log('Product API response:', response.data);
      // Handle the API response structure: { success: true, data: product }
      if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
        const productData = (response.data as { success: boolean; data: unknown }).data;
        console.log('Extracted product data:', productData);
        return productData;
      }
      // Fallback for direct product data
      console.log('Using fallback product data:', response.data);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      try {
        const response = await reviewsAPI.getProductReviews(id!);
        return response.data;
      } catch {
        // If reviews endpoint doesn't exist or fails, return empty data
        return { data: [], averageRating: 0, reviewCount: 0 };
      }
    },
    enabled: !!id,
  });

  // Initialize size and color when product loads
  const initialSize = product?.sizes?.[0] || '';
  const initialColor = product?.colors?.[0] || '';
  if (selectedSize === '' && initialSize) setSelectedSize(initialSize);
  if (selectedColor === '' && initialColor) setSelectedColor(initialColor);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image: productImageUrl(product.images),
    });
  };

  const cartQuantity = cartItems.find((item) => item.id === product?._id)?.quantity || 0;

  if (productLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <p className="text-primary-700">Product not found</p>
            <Link to="/shop" className="inline-block mt-4 text-primary-600 hover:text-primary-800">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const averageRating = reviewsData?.averageRating || 0;
  const reviewCount = reviewsData?.reviewCount || 0;

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-primary-600">
          <Link to="/" className="hover:text-primary-800">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary-800">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-primary-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-card overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={productImageUrl([images[selectedImageIndex]])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <span className="text-primary-400">No image available</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={productImageUrl([image])}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                {averageRating > 0 && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating) ? 'text-secondary-400 fill-current' : 'text-primary-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
                {reviewCount > 0 && (
                  <span className="text-sm text-primary-600">
                    ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>

            <div className="text-3xl font-bold text-primary-900">
              KES {(product.price || 0).toLocaleString()}
            </div>

            <p className="text-primary-700 leading-relaxed">{product.description || ''}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-primary-900 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-800 font-medium">
                  {cartQuantity} item{cartQuantity !== 1 ? 's' : ''} in cart
                </span>
                <Link to="/cart" className="ml-auto text-green-600 hover:text-green-800 font-medium">
                  View Cart
                </Link>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            )}

            {!product.inStock && (
              <p className="text-center text-red-600 font-medium">Out of stock</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">Reviews</h2>
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : reviewsData?.data && reviewsData.data.length > 0 ? (
            <div className="space-y-4">
              {reviewsData.data.map((review: { _id: string; rating: number; title?: string; comment: string; userId?: { name: string }; createdAt: string; verifiedPurchase?: boolean }) => (
                <div key={review._id} className="bg-white rounded-2xl shadow-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-secondary-400 fill-current' : 'text-primary-200'
                              }`}
                            />
                          ))}
                        </div>
                        {review.verifiedPurchase && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h3 className="font-semibold text-primary-900 mb-1">{review.title}</h3>
                      )}
                      <p className="text-sm text-primary-600">
                        By {review.userId?.name || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-primary-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <p className="text-primary-600">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
