import { useState } from 'react';
import { LOGO_ORIGINATION_KES } from '../config/pricing';
import { Upload, Calculator, Scissors, Palette, FileText } from 'lucide-react';

const toolPanelClass =
  'rounded-3xl bg-white border border-primary-100 shadow-card p-6 sm:p-8';
const fieldClass =
  'w-full px-3 py-2.5 border border-primary-200 rounded-2xl bg-white text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400';
const dashedZoneClass =
  'border-2 border-dashed border-primary-200 rounded-2xl p-6 sm:p-8 text-center hover:border-secondary-400/50 transition-colors bg-primary-50/40';

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
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-display">Tools & Resources</h1>
          <p className="text-lg sm:text-xl text-primary-700">
            Professional tools to help you with your embroidery projects. Convert files,
            count stitches, and estimate prices instantly.
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="flex justify-center mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-1">
          <div
            className="inline-flex flex-wrap sm:flex-nowrap justify-center gap-2 p-1.5 bg-white rounded-2xl shadow-card border border-primary-100 min-w-0"
            role="tablist"
            aria-label="Tool selection"
          >
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
                  activeTab === tool.id
                    ? 'bg-primary-600 text-white shadow-card'
                    : 'text-primary-800 hover:bg-primary-50 border border-transparent'
                }`}
              >
                {tool.icon}
                <span>{tool.name}</span>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-8 text-center font-display">
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
              <div
                key={index}
                className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 hover:shadow-float transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary-100 rounded-xl shrink-0">
                    <FileText className="w-6 h-6 text-secondary-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-primary-900 mb-2">{resource.title}</h3>
                    <p className="text-primary-700 text-sm mb-3">{resource.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-primary-600">
                        {resource.type} • {resource.size}
                      </span>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 font-semibold text-sm"
                      >
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
    <div className={toolPanelClass}>
      <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Embroidery File Converter</h2>
      <p className="text-sm text-primary-700 mb-6">Convert between common machine formats.</p>

      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Upload file</label>
          <div className={dashedZoneClass}>
            <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <p className="text-primary-900 font-medium">
                {file ? file.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-primary-600 mt-1">DST, EMB, PES, JEF files up to 10MB</p>
            </label>
          </div>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Source format</label>
            <select value={sourceFormat} onChange={(e) => setSourceFormat(e.target.value)} className={fieldClass}>
              <option value="DST">DST</option>
              <option value="EMB">EMB</option>
              <option value="PES">PES</option>
              <option value="JEF">JEF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Target format</label>
            <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className={fieldClass}>
              <option value="EMB">EMB</option>
              <option value="DST">DST</option>
              <option value="PES">PES</option>
              <option value="JEF">JEF</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? 'Converting...' : 'Convert file'}
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
    <div className={toolPanelClass}>
      <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Stitch counter</h2>
      <p className="text-sm text-primary-700 mb-6">Upload a design image to estimate stitch count.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Upload design image</label>
          <div className={dashedZoneClass}>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <p className="text-primary-900 font-medium">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-primary-600 mt-1">JPG, PNG, GIF files up to 10MB</p>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCount}
          disabled={!image || isProcessing}
          className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Count stitches'}
        </button>

        {result && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50/80 p-6 shadow-card">
            <h3 className="font-semibold text-lg text-primary-900 mb-4 font-display">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-primary-700">Total stitches</p>
                <p className="text-2xl font-bold text-primary-600">{result.stitches.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-primary-700">Estimated time</p>
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
      const embroideryPrice = LOGO_ORIGINATION_KES;
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
    <div className={toolPanelClass}>
      <h2 className="text-2xl font-bold text-primary-900 mb-2 font-display">Price estimator</h2>
      <p className="mb-6 text-sm text-primary-700">
        Logo origination (digitizing from your PNG or JPEG) is billed at KES {LOGO_ORIGINATION_KES.toLocaleString()} per design (incl. VAT);
        add a product below to estimate a sample total.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Upload logo (PNG or JPEG)</label>
          <div className={dashedZoneClass}>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/png,image/jpeg,.png,.jpg,.jpeg"
              className="hidden"
              id="design-upload"
            />
            <label htmlFor="design-upload" className="cursor-pointer block">
              <Upload className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <p className="text-primary-900 font-medium">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-sm text-primary-600 mt-1">
                PNG or JPEG, up to 10MB — origination KES {LOGO_ORIGINATION_KES.toLocaleString()} (incl. VAT)
              </p>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Product type</label>
            <select value={productType} onChange={(e) => setProductType(e.target.value)} className={fieldClass}>
              <option value="tshirt">T-Shirt</option>
              <option value="shirt">Shirt</option>
              <option value="short">Short</option>
              <option value="overall">Overall</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} className={fieldClass}>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">X-Large</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter color"
            className={fieldClass}
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="include-product"
            checked={includeProduct}
            onChange={(e) => setIncludeProduct(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500/30"
          />
          <label htmlFor="include-product" className="text-sm text-primary-800 leading-snug">
            Include product in order (not just embroidery)
          </label>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!image || isCalculating}
          className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'Calculating...' : 'Calculate price'}
        </button>

        {result && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50/80 p-6 shadow-card">
            <h3 className="font-semibold text-lg mb-4 text-primary-900 font-display">Price breakdown</h3>
            <div className="space-y-3">
              {includeProduct && (
                <div className="flex justify-between gap-4">
                  <span className="text-primary-700">Product price</span>
                  <span className="font-semibold text-primary-900">KES {result.productPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-primary-700">Logo origination (digitizing)</span>
                <span className="font-semibold text-primary-900">KES {result.embroideryPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4 text-lg font-bold border-t border-primary-200 pt-3">
                <span className="text-primary-900">Total</span>
                <span className="text-primary-600">KES {result.totalPrice.toLocaleString()}</span>
              </div>
              <div className="text-sm text-primary-700 pt-1">
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
