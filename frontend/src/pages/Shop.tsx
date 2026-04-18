import { useState } from 'react';
import { Search, Heart, ShoppingCart, Star, Plus, Minus, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../hooks/useCart';

/** Matches Home “Featured Products” mockup blocks — varied per item */
const SHOP_MOCKUP_GRADIENTS = [
  'from-primary-100 to-secondary-100',
  'from-secondary-100 to-accent-100',
  'from-accent-100 to-primary-100',
  'from-primary-200 to-secondary-50',
  'from-secondary-200 to-primary-100',
  'from-primary-100 to-accent-100',
] as const;

function mockupGradientClass(mockupIndex: number) {
  return SHOP_MOCKUP_GRADIENTS[mockupIndex % SHOP_MOCKUP_GRADIENTS.length];
}

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const { addToCart, removeFromCart, updateQuantity: updateCartQuantity, cartItems } = useCart();

  const handleAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    colors?: string[];
    sizes?: string[];
    image?: string;
  }) => {
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
    { value: 'all', label: 'All Products', count: 156 },
    { value: 'clothing', label: 'Clothing', count: 48 },
    { value: 'accessories', label: 'Accessories', count: 32 },
    { value: 'services', label: 'Embroidery Services', count: 28 },
    { value: 'digital', label: 'Digital Products', count: 18 },
    { value: 'corporate', label: 'Corporate', count: 30 },
  ];

  const colors: { value: string; label: string; color: string; light?: boolean }[] = [
    { value: 'red', label: 'Red', color: '#ED3237' },
    { value: 'blue', label: 'Blue', color: '#3B82F6' },
    { value: 'green', label: 'Green', color: '#10B981' },
    { value: 'yellow', label: 'Gold', color: '#FFCB2B' },
    { value: 'black', label: 'Black', color: '#1f324a' },
    { value: 'white', label: 'White', color: '#FFFFFF', light: true },
    { value: 'navy', label: 'Navy', color: '#243b68' },
    { value: 'gray', label: 'Gray', color: '#6B7280' },
    { value: 'burgundy', label: 'Burgundy', color: '#7F1D1D' },
    { value: 'teal', label: 'Teal', color: '#0D9488' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const products = [
    {
      id: '1',
      mockupIndex: 0,
      name: 'Custom T-Shirt',
      description: 'Premium quality cotton t-shirt with custom embroidery',
      price: 1500,
      category: 'clothing',
      rating: 4.8,
      reviews: 124,
      colors: ['red', 'blue', 'black', 'white', 'teal'],
      sizes: ['S', 'M', 'L', 'XL'],
      image: '/api/placeholder/300/300',
      featured: true,
      badge: 'Best Seller'
    },
    {
      id: '2',
      mockupIndex: 1,
      name: 'Embroidered Polo Shirt',
      description: 'Professional polo with custom logo embroidery',
      price: 2200,
      category: 'clothing',
      rating: 4.6,
      reviews: 89,
      colors: ['black', 'white', 'blue', 'navy', 'burgundy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image: '/api/placeholder/300/300',
      featured: true,
      badge: 'Popular'
    },
    {
      id: '3',
      mockupIndex: 2,
      name: 'Custom Cap',
      description: 'High-quality cap with embroidered design',
      price: 1200,
      category: 'accessories',
      rating: 4.7,
      reviews: 156,
      colors: ['black', 'red', 'blue', 'white', 'yellow', 'gray'],
      sizes: ['One Size'],
      image: '/api/placeholder/300/300',
      featured: false
    },
    {
      id: '4',
      mockupIndex: 3,
      name: 'Embroidery Service',
      description: 'Professional embroidery service for your garments',
      price: 500,
      category: 'services',
      rating: 4.9,
      reviews: 203,
      colors: [],
      sizes: [],
      image: '/api/placeholder/300/300',
      featured: false,
      badge: 'Service'
    },
    {
      id: '5',
      mockupIndex: 4,
      name: 'Corporate Uniform',
      description: 'Complete corporate uniform package with embroidery',
      price: 3500,
      category: 'corporate',
      rating: 4.5,
      reviews: 67,
      colors: ['black', 'white', 'blue', 'navy', 'gray'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      image: '/api/placeholder/300/300',
      featured: false
    },
    {
      id: '6',
      mockupIndex: 5,
      name: 'Embroidered Hoodie',
      description: 'Comfortable hoodie with custom embroidery',
      price: 2800,
      category: 'clothing',
      rating: 4.8,
      reviews: 92,
      colors: ['black', 'gray', 'navy', 'green', 'burgundy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      image: '/api/placeholder/300/300',
      featured: true,
      badge: 'New'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesColors = selectedColors.length === 0 || 
                          selectedColors.some(color => product.colors.includes(color));
    const matchesSizes = selectedSizes.length === 0 || 
                        selectedSizes.some(size => product.sizes.includes(size));
    const matchesRating = ratingFilter === 0 || product.rating >= ratingFilter;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesColors && matchesSizes && matchesRating;
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
      case 'newest':
        return b.id.localeCompare(a.id);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 10000 });
    setSelectedColors([]);
    setSelectedSizes([]);
    setRatingFilter(0);
    setSortBy('name');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    priceRange.min > 0 || priceRange.max < 10000,
    selectedColors.length > 0,
    selectedSizes.length > 0,
    ratingFilter > 0
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="min-w-0">
              <h1 className="text-4xl font-bold text-primary-900 mb-2 font-display">Shop</h1>
              <p className="text-lg text-primary-700">Discover our complete range of embroidery products and services</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center bg-white border border-primary-100 rounded-2xl px-4 py-2 shadow-card">
                <span className="text-sm font-medium text-primary-900">{sortedProducts.length} Products</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-primary-200 text-primary-800 hover:border-primary-300'}`}
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl border transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-primary-200 text-primary-800 hover:border-primary-300'}`}
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, services, or brands..."
                className="w-full min-w-0 pl-12 pr-4 py-3.5 sm:py-4 bg-white border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-primary-900 placeholder-primary-400 text-base sm:text-lg shadow-card"
              />
            </div>
            <button
              type="button"
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-card"
            >
              Search
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-primary-200 text-primary-800 hover:border-primary-600 hover:text-primary-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-80 flex-shrink-0 min-w-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mb-6 p-3 bg-primary-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-900">Active Filters</span>
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  </div>
                </div>
              )}

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full min-w-0 px-3 py-2.5 bg-white border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-primary-900"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6 min-w-0">
                <label className="block text-sm font-medium text-primary-900 mb-2">
                  Price range (KES)
                </label>
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:gap-2 min-w-0">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="min-w-0 w-full sm:flex-1 px-3 py-2.5 bg-white border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-primary-900"
                    />
                    <span className="hidden sm:inline text-primary-500 text-center shrink-0 select-none" aria-hidden>
                      –
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="min-w-0 w-full sm:flex-1 px-3 py-2.5 bg-white border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-primary-900"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPriceRange({ min: 0, max: 1000 })}
                      className="px-3 py-1.5 bg-primary-50 text-primary-800 rounded-xl text-sm font-medium border border-primary-100 hover:bg-primary-100"
                    >
                      0–1K
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceRange({ min: 1000, max: 5000 })}
                      className="px-3 py-1.5 bg-primary-50 text-primary-800 rounded-xl text-sm font-medium border border-primary-100 hover:bg-primary-100"
                    >
                      1K–5K
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriceRange({ min: 5000, max: 10000 })}
                      className="px-3 py-1.5 bg-primary-50 text-primary-800 rounded-xl text-sm font-medium border border-primary-100 hover:bg-primary-100"
                    >
                      5K–10K
                    </button>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      title={color.label}
                      onClick={() => {
                        setSelectedColors(prev => 
                          prev.includes(color.value)
                            ? prev.filter(c => c !== color.value)
                            : [...prev, color.value]
                        );
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center shrink-0 transition-shadow ${
                        color.light ? 'ring-1 ring-inset ring-primary-200' : ''
                      } ${
                        selectedColors.includes(color.value)
                          ? 'border-primary-600 ring-2 ring-primary-500/40'
                          : 'border-primary-200'
                      }`}
                      style={{ backgroundColor: color.color }}
                    >
                      {selectedColors.includes(color.value) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes(prev => 
                          prev.includes(size)
                            ? prev.filter(s => s !== size)
                            : [...prev, size]
                        );
                      }}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Minimum Rating</label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-left transition-colors ${
                        ratingFilter === rating
                          ? 'bg-primary-50 border border-primary-600'
                          : 'bg-primary-50 border border-primary-100 hover:bg-primary-100'
                      }`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-secondary-400 fill-current' : 'text-primary-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-primary-700">& Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-primary-200 rounded-2xl shadow-card hover:bg-primary-50/80"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">No products found</h3>
                <p className="text-primary-700 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {sortedProducts.map((product) => {
                  const cartQuantity = getCartQuantity(product.id);
                  const isFavorite = favorites.includes(product.id);
                  
                  return viewMode === 'grid' ? (
                    /* Grid View */
                    <div key={product.id} className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden hover:shadow-float transition-all duration-300 group">
                      {/* Product Image — mockup block (same language as Home featured) */}
                      <div className="relative aspect-square bg-primary-100 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${mockupGradientClass(product.mockupIndex)}`} />
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {product.badge}
                          </div>
                        )}
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-accent-500 text-accent-500' : 'text-primary-700'}`} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-primary-900 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-primary-700 line-clamp-2">{product.description}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? 'text-secondary-400 fill-current' : 'text-primary-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-primary-700">{product.rating} ({product.reviews})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-primary-900">KES {product.price}</span>
                          </div>
                        </div>

                        {/* Add to Cart */}
                        {cartQuantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                              className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{cartQuantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                              className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <div key={product.id} className="bg-white rounded-2xl shadow-card border border-primary-100 p-4 hover:shadow-float transition-all duration-300">
                      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-32 bg-primary-100 rounded-xl overflow-hidden flex-shrink-0">
                          <div className={`w-full h-full bg-gradient-to-br ${mockupGradientClass(product.mockupIndex)}`} />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-primary-900 mb-1">{product.name}</h3>
                                <p className="text-sm text-primary-700">{product.description}</p>
                              </div>
                              {product.badge && (
                                <div className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {product.badge}
                                </div>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating) ? 'text-secondary-400 fill-current' : 'text-primary-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-primary-700">{product.rating} ({product.reviews})</span>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <span className="text-xl font-bold text-primary-900">KES {product.price}</span>
                                <button
                                  onClick={() => toggleFavorite(product.id)}
                                  className="p-2 hover:bg-primary-100 rounded-xl transition-colors"
                                >
                                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-accent-500 text-accent-500' : 'text-primary-700'}`} />
                                </button>
                              </div>

                              {cartQuantity > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                                    className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-12 text-center font-medium">{cartQuantity}</span>
                                  <button
                                    onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                                    className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
