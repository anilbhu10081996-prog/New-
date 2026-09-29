import React, { useState } from 'react';
import { BusinessProfile, UserProfile } from '../../types';
import { Building2, MapPin, Phone, MessageSquare, Clock, Truck, Globe, CheckCircle2 } from 'lucide-react';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveBusiness: (business: BusinessProfile) => void;
  existingBusiness?: BusinessProfile | null;
}

export const BusinessModal: React.FC<BusinessModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveBusiness,
  existingBusiness,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(existingBusiness?.name || '');
  const [phone, setPhone] = useState(existingBusiness?.phone || currentUser.phone || '');
  const [category, setCategory] = useState(existingBusiness?.category || 'Retail & Grocery');
  const [subCategory, setSubCategory] = useState(existingBusiness?.sub_category || 'General Store');
  const [location, setLocation] = useState(existingBusiness?.location || 'Delhi NCR');
  const [address, setAddress] = useState(existingBusiness?.address || currentUser.address || '');
  const [whatsapp, setWhatsapp] = useState(existingBusiness?.whatsapp || currentUser.phone || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(existingBusiness?.google_maps_url || '');
  const [homeDelivery, setHomeDelivery] = useState(existingBusiness?.home_delivery ?? true);
  const [serviceArea, setServiceArea] = useState(existingBusiness?.service_area || 'Within 5-10 Km radius');
  const [openingHours, setOpeningHours] = useState(existingBusiness?.opening_hours || '09:00 AM - 09:00 PM');
  const [description, setDescription] = useState(existingBusiness?.description || '');
  const [published, setPublished] = useState(existingBusiness?.published ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !location.trim() || !address.trim()) {
      alert('Please fill out Business Name, Mobile, Location, and Address.');
      return;
    }

    const businessData: BusinessProfile = {
      id: existingBusiness?.id || 'biz_' + Date.now(),
      user_id: currentUser.id,
      name: name.trim(),
      phone: phone.trim(),
      category: category.trim(),
      sub_category: subCategory.trim(),
      location: location.trim(),
      address: address.trim(),
      whatsapp: whatsapp.trim() || undefined,
      google_maps_url: googleMapsUrl.trim() || undefined,
      home_delivery: homeDelivery,
      service_area: serviceArea.trim() || undefined,
      opening_hours: openingHours.trim() || undefined,
      description: description.trim(),
      published: published,
      created_at: existingBusiness?.created_at || new Date().toISOString(),
    };

    onSaveBusiness(businessData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl font-bold">
            🏢
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {existingBusiness ? 'Edit Business Profile' : 'Register Your Business / Shop'}
            </h2>
            <p className="text-xs text-slate-500">
              Connect your shop to customers across your city with home delivery & Google Maps.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Business / Shop Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharma Electricals & Hardware"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Retail & Grocery">Retail & Grocery</option>
                <option value="Electrical & Hardware">Electrical & Hardware</option>
                <option value="Plumbing & Sanitary">Plumbing & Sanitary</option>
                <option value="Home Repairs & Services">Home Repairs & Services</option>
                <option value="Auto Garage & Parts">Auto Garage & Parts</option>
                <option value="Education & Coaching">Education & Coaching</option>
                <option value="Other Business">Other Business</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="e.g. Switchboards, Wires & Lighting"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Noida Sector 18"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                WhatsApp Number (for Orders)
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Shop Address *
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop No., Market Name, Landmark, Pincode"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Google Maps Location URL
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="e.g. 09:00 AM - 09:30 PM (Closed Tuesday)"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={homeDelivery}
                  onChange={(e) => setHomeDelivery(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Provide Home Delivery Service</span>
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="Delivery Area radius (e.g. 5-10 Km)"
                className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Publish to Public Business Directory</span>
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Visible to customers searching local businesses nearby.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              About Business & Services Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your products, brands you stock, warranties, and special discounts..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Publish Business</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
