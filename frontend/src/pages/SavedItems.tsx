import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { userAPI } from '../services/api';

type SavedItem = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  inStock: boolean;
};

const SavedItems = () => {
  const { user, isLoading: isLoaded } = useAuth();
  const { addToCart } = useCart();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadSavedItems = async () => {
      try {
        const response = await userAPI.getFavorites();
        setSavedItems(response.data.favorites || []);
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [user, isLoaded]);

  const removeSavedItem = async (itemId: string) => {
    try {
      await userAPI.removeFromFavorites(itemId);
      setSavedItems(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error removing saved item:', error);
    }
  };

  const addToCartFromSaved = (item: SavedItem) => {
    const image = item.images?.[0] || '';
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image
    });
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const addSelectedToCart = () => {
    selectedItems.forEach(itemId => {
      const item = savedItems.find(i => i._id === itemId);
      if (item) {
        addToCartFromSaved(item);
      }
    });
    setSelectedItems([]);
  };

  const removeSelected = async () => {
    for (const itemId of selectedItems) {
      await removeSavedItem(itemId);
    }
    setSelectedItems([]);
  };

  const selectAll = () => {
    setSelectedItems(savedItems.map(item => item._id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-card p-8 text-center">
          <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Sign in to view saved items</h1>
          <p className="text-primary-700 mb-6">Please sign in to view your saved items.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-primary-800 text-white font-medium rounded-xl hover:bg-primary-900 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 font-display mb-2">Saved Items</h1>
          <p className="text-primary-700">Items you've saved for later. Add them to cart when you're ready to purchase.</p>
        </div>

        {/* Bulk Actions */}
        {savedItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={selectAll}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Select all
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Clear selection
                </button>
                <span className="text-sm text-primary-500">
                  {selectedItems.length} selected
                </span>
              </div>
              <div className="flex gap-2">
                {selectedItems.length > 0 && (
                  <>
                    <button
                      onClick={addSelectedToCart}
                      className="inline-flex items-center px-4 py-2 bg-secondary-500 text-primary-900 font-medium rounded-xl hover:bg-secondary-600 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart ({selectedItems.length})
                    </button>
                    <button
                      onClick={removeSelected}
                      className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Saved Items Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : savedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
            <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No saved items yet</h3>
            <p className="text-primary-600 mb-6">Start browsing and save items you're interested in for later.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 bg-secondary-500 text-primary-900 font-medium rounded-xl hover:bg-secondary-600 transition-colors"
            >
              Browse Shop <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-primary-100 shadow-card hover:shadow-lg transition-shadow">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleSelection(item._id)}
                    className="absolute top-3 left-3 z-10 w-5 h-5 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                  />
                  <button
                    onClick={() => removeSavedItem(item._id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-primary-600 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="aspect-square bg-surface-muted rounded-t-2xl overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-primary-300" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary-900 mb-1 line-clamp-2">{item.name}</h3>
                  {item.category && (
                    <p className="text-sm text-primary-600 mb-2">{item.category}</p>
                  )}
                  <p className="text-lg font-bold text-primary-900 mb-3">
                    KES {item.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => addToCartFromSaved(item)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
