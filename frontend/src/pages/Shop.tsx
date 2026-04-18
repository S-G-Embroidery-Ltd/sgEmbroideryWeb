import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, ShoppingCart, Star, Plus, Minus, Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { productsAPI } from '../services/api';

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

type ApiProduct = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  featured?: boolean;
  inStock?: boolean;
};

type DisplayProduct = {
  id: string;
  mockupIndex: number;
  name: string;
  description: string;
  price: number;
  category: string;
  colors: string[];
  sizes: string[];
  image: string;
  featured: boolean;
  badge?: string;
  inStock: boolean;
};

function toDisplayProduct(p: ApiProduct): DisplayProduct {
  const id = String(p._id);
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const img = productImageUrl(p.images);
  return {
    id,
    mockupIndex: Math.abs(h),
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    colors: p.colors?.length ? p.colors : [],
    sizes: p.sizes?.length ? p.sizes : ['One Size'],
    image: img,
    featured: !!p.featured,
    badge: p.featured ? 'Featured' : undefined,
    inStock: p.inStock !== false,
  };
}

const Shop = () => {
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
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

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['shop-products', selectedCategory, priceRange.min, priceRange.max, appliedSearch],
    queryFn: async () => {
      const res = await productsAPI.getAll({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < 10000 ? priceRange.max : undefined,
        search: appliedSearch.trim() || undefined,
        limit: 60,
        page: 1,
      });
      return res.data as { products: ApiProduct[]; pagination: { total: number } };
    },
  });

  const rawProducts: DisplayProduct[] = useMemo(
    () => (data?.products || []).map(toDisplayProduct),
    [data]
  );

  const filteredProducts = rawProducts.filter((product) => {
    const q = searchInput.trim().toLowerCase();
    const matchesLocalSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);
    const matchesColors =
      selectedColors.length === 0 || selectedColors.some((c) => product.colors.includes(c));
    const matchesSizes =
      selectedSizes.length === 0 || selectedSizes.some((s) => product.sizes.includes(s));
    const matchesRating = ratingFilter === 0 || true;
    return matchesLocalSearch && matchesColors && matchesSizes && matchesRating;
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
        return 0;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const categories = [
    { value: 'all', label: 'All Products', count: data?.pagination?.total ?? 0 },
    { value: 'physical', label: 'Physical', count: 0 },
    { value: 'embroidery', label: 'Embroidery', count: 0 },
    { value: 'downloadable', label: 'Digital', count: 0 },
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

  const handleAddToCart = (product: DisplayProduct) => {
    if (!product.inStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: product.colors[0] || 'Default',
      size: product.sizes[0] || 'One Size',
      image: product.image || '',
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const getCartQuantity = (productId: string) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const clearFilters = () => {
    setSearchInput('');
    setAppliedSearch('');
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
    ratingFilter > 0,
    appliedSearch.length > 0,
  ].filter(Boolean).length;

  const applySearch = () => {
    setAppliedSearch(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="min-w-0">
              <h1 className="text-4xl font-bold text-primary-900 mb-2 font-display">Shop</h1>
              <p className="text-lg text-primary-700">Browse products from our catalogue</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center bg-white border border-primary-100 rounded-2xl px-4 py-2 shadow-card">
                <span className="text-sm font-medium text-primary-900">
                  {isLoading ? '…' : sortedProducts.length} Products
                </span>
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

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                placeholder="Search products…"
                className="w-full min-w-0 pl-12 pr-4 py-3.5 sm:py-4 bg-white border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 text-primary-900 placeholder-primary-400 text-base sm:text-lg shadow-card"
              />
            </div>
            <button
              type="button"
              onClick={applySearch}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-card"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-primary-200 text-primary-800 hover:border-primary-600 hover:text-primary-600'
                }`}
              >
                {category.label}
                {category.value === 'all' && typeof category.count === 'number' ? ` (${category.count})` : ''}
              </button>
            ))}
          </div>
        </div>

        {isError && (
          <div className="mb-6 rounded-2xl border border-accent-200 bg-accent-50 text-accent-900 px-4 py-3 text-sm flex flex-wrap items-center justify-between gap-2">
            <span>{error instanceof Error ? error.message : 'Could not load products.'}</span>
            <button type="button" onClick={() => refetch()} className="font-semibold underline">
                Retry
              </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`w-full lg:w-80 flex-shrink-0 min-w-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-card border border-primary-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900">Filters</h3>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

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

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Price Range (KES)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    value={priceRange.min}
                    onChange={(e) => setPriceRange((p) => ({ ...p, min: Math.max(0, Number(e.target.value) || 0) }))}
                    className="px-3 py-2 border border-primary-200 rounded-xl"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min={0}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange((p) => ({ ...p, max: Math.max(0, Number(e.target.value) || 0) }))}
                    className="px-3 py-2 border border-primary-200 rounded-xl"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Colors</label>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      title={color.label}
                      onClick={() => {
                        setSelectedColors((prev) =>
                          prev.includes(color.value)
                            ? prev.filter((c) => c !== color.value)
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Sizes</label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSizes((prev) =>
                          prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-900 mb-2">Minimum Rating</label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      type="button"
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

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-primary-200 rounded-2xl shadow-card hover:bg-primary-50/80"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">No products found</h3>
                <p className="text-primary-700 mb-4">Try adjusting filters or add products in the database.</p>
                <button
                  type="button"
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
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-card border border-primary-100 overflow-hidden hover:shadow-float transition-all duration-300 group"
                    >
                      <div className="relative aspect-square bg-primary-100 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${mockupGradientClass(product.mockupIndex)}`} />
                        )}
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                            {product.badge}
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute bottom-3 left-3 bg-primary-900/80 text-white text-xs px-2 py-1 rounded-full z-10">
                            Out of stock
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                        >
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-accent-500 text-accent-500' : 'text-primary-700'}`} />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="text-lg font-semibold text-primary-900 mb-1 line-clamp-1">{product.name}</h3>
                          <p className="text-sm text-primary-700 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-primary-900">KES {product.price.toLocaleString()}</span>
                        </div>
                        {cartQuantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                              className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{cartQuantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                              className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-card border border-primary-100 p-4 hover:shadow-float transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                        <div className="w-full sm:w-32 h-32 bg-primary-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${mockupGradientClass(product.mockupIndex)}`} />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-primary-700 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xl font-bold text-primary-900">KES {product.price.toLocaleString()}</span>
                              <button
                                type="button"
                                onClick={() => toggleFavorite(product.id)}
                                className="p-2 hover:bg-primary-100 rounded-xl transition-colors"
                              >
                                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-accent-500 text-accent-500' : 'text-primary-700'}`} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-4">
                            {cartQuantity > 0 ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(product.id, cartQuantity - 1)}
                                  className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{cartQuantity}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(product.id, cartQuantity + 1)}
                                  className="p-2 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!product.inStock}
                                onClick={() => handleAddToCart(product)}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add</span>
                              </button>
                            )}
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
