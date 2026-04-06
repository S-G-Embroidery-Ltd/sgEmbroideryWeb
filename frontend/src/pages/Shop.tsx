import { useState } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { addToCart, removeFromCart, updateQuantity: updateCartQuantity, cartItems } = useCart();

  const handleAddToCart = (product: any) => {
    console.log('Adding to cart:', product);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: product.colors?.[0] || 'Default',
      size: product.sizes?.[0] || 'One Size',
      image: product.image || ''
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'services', label: 'Embroidery Services' },
    { value: 'digital', label: 'Digital Products' },
  ];

  const products = [
    {
      id: '1',
      name: 'Custom T-Shirt',
      description: 'Premium quality cotton t-shirt with custom embroidery',
      price: 1500,
      category: 'clothing',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      badge: 'BESTSELLER',
      colors: ['Black', 'White', 'Navy', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    },
    {
      id: '2',
      name: 'Embroidered Polo Shirt',
      description: 'Professional polo shirt with custom logo embroidery',
      price: 2200,
      category: 'clothing',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      badge: 'POPULAR',
      colors: ['White', 'Navy', 'Black', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    },
    {
      id: '3',
      name: 'Custom Hoodie',
      description: 'Comfortable hoodie with personalized embroidery design',
      price: 3500,
      category: 'clothing',
      rating: 4.9,
      reviews: 67,
      inStock: true,
      colors: ['Black', 'Gray', 'Navy', 'Maroon'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    },
    {
      id: '4',
      name: 'Embroidered Cap',
      description: 'High-quality cap with custom embroidery',
      price: 800,
      category: 'accessories',
      rating: 4.6,
      reviews: 45,
      inStock: true,
      colors: ['Black', 'Navy', 'Red', 'White'],
      sizes: ['One Size'],
    },
    {
      id: '5',
      name: 'Custom Tote Bag',
      description: 'Durable canvas tote with embroidered design',
      price: 600,
      category: 'accessories',
      rating: 4.5,
      reviews: 34,
      inStock: true,
      colors: ['Natural', 'Black', 'Navy'],
      sizes: ['One Size'],
    },
    {
      id: '6',
      name: 'Logo Embroidery Service',
      description: 'Professional logo embroidery on any garment',
      price: 500,
      category: 'services',
      rating: 4.9,
      reviews: 156,
      inStock: true,
      badge: 'SERVICE',
      colors: [],
      sizes: [],
    },
    {
      id: '7',
      name: 'Custom Tracksuit',
      description: 'Comfortable tracksuit with personalized embroidery',
      price: 4500,
      category: 'clothing',
      rating: 4.7,
      reviews: 78,
      inStock: true,
      colors: ['Black', 'Navy', 'Gray', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    },
    {
      id: '8',
      name: 'Embroidery Design Pack',
      description: 'Collection of 50+ professional embroidery patterns',
      price: 800,
      category: 'digital',
      rating: 4.8,
      reviews: 92,
      inStock: true,
      badge: 'DIGITAL',
      colors: [],
      sizes: [],
    },
    {
      id: '9',
      name: 'Custom Jersey',
      description: 'Sports jersey with team name and number embroidery',
      price: 2800,
      category: 'clothing',
      rating: 4.6,
      reviews: 56,
      inStock: true,
      colors: ['White', 'Navy', 'Black', 'Red', 'Green'],
      sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    },
    {
      id: '10',
      name: 'Embroidered Apron',
      description: 'Kitchen apron with custom name or logo embroidery',
      price: 1200,
      category: 'accessories',
      rating: 4.4,
      reviews: 23,
      inStock: true,
      colors: ['White', 'Black', 'Navy', 'Red'],
      sizes: ['One Size'],
    },
    {
      id: '11',
      name: 'Corporate Uniform Package',
      description: 'Complete uniform package for 10 employees',
      price: 25000,
      category: 'services',
      rating: 4.9,
      reviews: 45,
      inStock: true,
      badge: 'PACKAGE',
      colors: [],
      sizes: [],
    },
    {
      id: '12',
      name: 'Embroidery Font Collection',
      description: 'Professional embroidery fonts and monograms',
      price: 500,
      category: 'digital',
      rating: 4.7,
      reviews: 67,
      inStock: true,
      badge: 'DIGITAL',
      colors: [],
      sizes: [],
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 font-sans">Shop</h1>
          <p className="text-lg text-black">Discover our complete range of embroidery products and services</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-medium p-6 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-3 py-2 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Cart ({getTotalCartItems()} items)
                </span>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-2xl hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-medium hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100">
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-accent-600 text-white text-xs font-bold rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.includes(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Colors:</p>
                        <div className="flex space-x-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <span key={index} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          KES {product.price.toLocaleString()}
                        </span>
                        {product.category === 'services' && (
                          <span className="text-xs text-gray-500 block">Starting from</span>
                        )}
                      </div>
                      
                      {getCartQuantity(product.id) > 0 ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(product.id, getCartQuantity(product.id) - 1)}
                            className="p-1 text-gray-600 hover:text-primary-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {getCartQuantity(product.id)}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(product.id, getCartQuantity(product.id) + 1)}
                            className="p-1 text-gray-600 hover:text-primary-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn-primary p-2"
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-medium">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
