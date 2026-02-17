import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ClaimFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ClaimForm({ onSubmit, isLoading }: ClaimFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    policyNumber: '',
    incidentDate: '',
    city: '',
    state: '',
    country: '',
    category: 'Auto',
    description: '',
    estimatedValue: '',
    thirdParties: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPG and PNG images are supported');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-indigo-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-indigo-50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-indigo-50');
    if (e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const loadDemoData = async () => {
    setFormData({
      fullName: 'Sarah Mitchell',
      policyNumber: 'POL-2024-88421',
      incidentDate: '2026-02-14',
      city: 'Austin',
      state: 'Texas',
      country: 'United States',
      category: 'Auto',
      description: 'I was stopped at a red light when another vehicle rear-ended my car at high speed. The back of my car is severely damaged. The other driver admitted fault at the scene.',
      estimatedValue: '12000',
      thirdParties: 'John Davis (other driver), Officer Rodriguez',
    });

    try {
      const response = await fetch('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80');
      const blob = await response.blob();
      const file = new File([blob], 'damage.jpg', { type: 'image/jpeg' });
      handleImageUpload(file);
    } catch (error) {
      console.error('Failed to load demo image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.policyNumber || !formData.incidentDate || !formData.city || !formData.state || !formData.country || !formData.description || !formData.estimatedValue || !imageFile) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      onSubmit({
        claimData: {
          name: formData.fullName,
          policyNumber: formData.policyNumber,
          incidentDate: formData.incidentDate,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          category: formData.category,
          description: formData.description,
          estimatedValue: formData.estimatedValue,
          thirdParties: formData.thirdParties,
        },
        imageBase64: base64,
      });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <section id="submit-claim" className="py-20 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4">
            Submit Your Claim
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Start Your Claim
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill in your details and upload damage photos. Our AI pipeline will process your claim in under two minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Date of Incident *
                  </label>
                  <input
                    type="date"
                    name="incidentDate"
                    value={formData.incidentDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Location *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Claim Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  >
                    <option>Auto</option>
                    <option>Property</option>
                    <option>Home</option>
                    <option>Commercial</option>
                    <option>Medical</option>
                    <option>Liability</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Incident Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    rows={4}
                    placeholder="Describe the incident in detail..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Estimated Loss Value *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-600 font-medium">$</span>
                    <input
                      type="number"
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Third Parties Involved
                  </label>
                  <input
                    type="text"
                    name="thirdParties"
                    value={formData.thirdParties}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Names and roles of any other parties involved"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Upload Damage Photos *
                </label>
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-600 hover:bg-indigo-50 transition"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="font-semibold text-slate-900 mb-1">Upload Damage Photos</p>
                    <p className="text-sm text-slate-600">Drag and drop or click to upload. JPG or PNG up to 10MB.</p>
                  </div>
                ) : (
                  <div className="border border-slate-300 rounded-xl p-4 h-full flex flex-col">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                    <p className="text-sm text-slate-600 mb-4 truncate">{imageFile?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Process My Claim →
              </button>
              <button
                type="button"
                onClick={loadDemoData}
                disabled={isLoading}
                className="text-indigo-600 hover:text-indigo-700 transition text-sm font-medium disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                Load Demo Claim
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
