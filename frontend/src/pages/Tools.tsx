import { useState } from 'react';
import { Upload, Calculator, Scissors, Palette, FileText } from 'lucide-react';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('converter');

  const tools = [
    {
      id: 'converter',
      name: 'File Converter',
      description: 'Convert embroidery files between different formats (DST to EMB)',
      icon: <Scissors className="w-6 h-6" />,
    },
    {
      id: 'stitch-counter',
      name: 'Stitch Counter',
      description: 'Calculate the number of stitches from your design image',
      icon: <Calculator className="w-6 h-6" />,
    },
    {
      id: 'price-estimator',
      name: 'Price Estimator',
      description: 'Get instant price estimates for embroidery projects',
      icon: <Palette className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Tools & Resources</h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Professional tools to help you with your embroidery projects. Convert files, 
            count stitches, and estimate prices instantly.
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-colors ${
                  activeTab === tool.id
                    ? 'bg-primary-600 text-white'
                    : 'text-black hover:text-primary-600'
                }`}
              >
                {tool.icon}
                <span className="font-medium">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'converter' && <FileConverter />}
          {activeTab === 'stitch-counter' && <StitchCounter />}
          {activeTab === 'price-estimator' && <PriceEstimator />}
        </div>

        {/* Resources Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-8 text-center">
            Downloadable Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Embroidery Guide',
                description: 'Complete guide to getting started with embroidery',
                type: 'PDF',
                size: '2.5 MB',
              },
              {
                title: 'Design Templates',
                description: '50+ professional embroidery design templates',
                type: 'ZIP',
                size: '15 MB',
              },
              {
                title: 'Color Charts',
                description: 'Thread color compatibility charts',
                type: 'PDF',
                size: '1.2 MB',
              },
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-black text-sm mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-black">{resource.type} • {resource.size}</span>
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// File Converter Component
const FileConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState('DST');
  const [targetFormat, setTargetFormat] = useState('EMB');
  const [isConverting, setIsConverting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    
    setIsConverting(true);
    // Simulate conversion
    setTimeout(() => {
      setIsConverting(false);
      alert('File converted successfully!');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6">Embroidery File Converter</h2>
      
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Upload File
          </label>
          <div className="border-2 border-dashed border-black rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-black mx-auto mb-4" />
              <p className="text-black">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-black mt-1">
                DST, EMB, PES, JEF files up to 10MB
              </p>
            </label>
          </div>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Source Format
            </label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="DST">DST</option>
              <option value="EMB">EMB</option>
              <option value="PES">PES</option>
              <option value="JEF">JEF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Target Format
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="EMB">EMB</option>
              <option value="DST">DST</option>
              <option value="PES">PES</option>
              <option value="JEF">JEF</option>
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? 'Converting...' : 'Convert File'}
        </button>
      </div>
    </div>
  );
};

// Stitch Counter Component
const StitchCounter = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ stitches: number; time: number } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCount = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      const mockStitches = Math.floor(Math.random() * 10000) + 1000;
      setResult({
        stitches: mockStitches,
        time: Math.ceil(mockStitches / 1000),
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6">Stitch Counter</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Upload Design Image
          </label>
          <div className="border-2 border-dashed border-black rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-black mx-auto mb-4" />
              <p className="text-black">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-black mt-1">
                JPG, PNG, GIF files up to 10MB
              </p>
            </label>
          </div>
        </div>

        <button
          onClick={handleCount}
          disabled={!image || isProcessing}
          className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Count Stitches'}
        </button>

        {result && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Stitches</p>
                <p className="text-2xl font-bold text-primary-600">{result.stitches.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="text-2xl font-bold text-primary-600">{result.time} min</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Price Estimator Component
const PriceEstimator = () => {
  const [image, setImage] = useState<File | null>(null);
  const [productType, setProductType] = useState('tshirt');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('White');
  const [includeProduct, setIncludeProduct] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{
    productPrice: number;
    embroideryPrice: number;
    totalPrice: number;
    stitchCount: number;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCalculate = async () => {
    if (!image) return;
    
    setIsCalculating(true);
    // Simulate calculation
    setTimeout(() => {
      const priceMap: Record<string, number> = { tshirt: 1500, shirt: 2000, short: 1200, overall: 3500 };
      const basePrice = priceMap[productType];
      const embroideryPrice = Math.floor(Math.random() * 1000) + 500;
      const totalPrice = includeProduct ? basePrice + embroideryPrice : embroideryPrice;
      
      setResult({
        productPrice: includeProduct ? basePrice : 0,
        embroideryPrice,
        totalPrice,
        stitchCount: Math.floor(Math.random() * 10000) + 1000,
      });
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6">Price Estimator</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Upload Design
          </label>
          <div className="border-2 border-dashed border-black rounded-lg p-6 text-center">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="design-upload"
            />
            <label htmlFor="design-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-black mx-auto mb-4" />
              <p className="text-black">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-black mt-1">
                JPG, PNG, GIF files up to 10MB
              </p>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Product Type
            </label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tshirt">T-Shirt</option>
              <option value="shirt">Shirt</option>
              <option value="short">Short</option>
              <option value="overall">Overall</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">X-Large</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter color"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="include-product"
            checked={includeProduct}
            onChange={(e) => setIncludeProduct(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="include-product" className="ml-2 text-sm text-gray-700">
            Include product in order (not just embroidery)
          </label>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!image || isCalculating}
          className="w-full py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'Calculating...' : 'Calculate Price'}
        </button>

        {result && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>
            <div className="space-y-3">
              {includeProduct && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Price</span>
                  <span className="font-semibold">KES {result.productPrice}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Embroidery Price</span>
                <span className="font-semibold">KES {result.embroideryPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Price</span>
                <span className="text-primary-600">KES {result.totalPrice}</span>
              </div>
              <div className="text-sm text-gray-600 pt-2 border-t">
                Estimated stitches: {result.stitchCount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
