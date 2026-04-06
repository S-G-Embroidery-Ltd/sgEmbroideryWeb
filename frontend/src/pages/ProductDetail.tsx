import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Details</h1>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">Product ID: {id}</p>
          <p className="text-gray-600 mt-4">Product details page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
