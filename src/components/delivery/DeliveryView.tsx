import React, { useState } from 'react';
import { DeliveryBooking, UserProfile } from '../../types';
import { Truck, MapPin, Package, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface DeliveryViewProps {
  currentUser: UserProfile;
  deliveries: DeliveryBooking[];
  onBookDelivery: (booking: DeliveryBooking) => void;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  currentUser,
  deliveries,
  onBookDelivery,
}) => {
  const [senderName, setSenderName] = useState(currentUser.full_name || '');
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '');
  const [senderAddress, setSenderAddress] = useState(currentUser.address || '');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [weightKg, setWeightKg] = useState<number>(2);
  const [parcelType, setParcelType] = useState('Documents / Files');
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTracking, setCreatedTracking] = useState<string | null>(null);

  // Dynamic calculated fare: base ₹60 + ₹25/kg + ₹50 if urgent
  const calculatedFare = Math.round(60 + weightKg * 25 + (urgent ? 50 : 0));

  const handleBookDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderAddress || !receiverAddress || !receiverPhone) {
      alert('Please fill out sender address, receiver address, and receiver phone');
      return;
    }

    setIsSubmitting(true);
    const trackingNo = 'AWS-DLV-' + Math.floor(100000 + Math.random() * 900000);

    const newBooking: DeliveryBooking = {
      id: 'dlv_' + Date.now(),
      user_id: currentUser.id,
      sender_name: senderName.trim(),
      sender_phone: senderPhone.trim(),
      sender_address: senderAddress.trim(),
      receiver_name: receiverName.trim(),
      receiver_phone: receiverPhone.trim(),
      receiver_address: receiverAddress.trim(),
      weight_kg: Number(weightKg),
      parcel_type: parcelType,
      urgent: urgent,
      price: calculatedFare,
      tracking_number: trackingNo,
      status: 'pickup_scheduled',
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onBookDelivery(newBooking);
      setIsSubmitting(false);
      setCreatedTracking(trackingNo);
      setReceiverName('');
      setReceiverPhone('');
      setReceiverAddress('');
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full">
            SAME-DAY PARCEL & COURIER SERVICE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Local City Express Pickup & Delivery
          </h1>
          <p className="text-blue-200 text-sm mt-2">
            Send urgent documents, spare parts, parcels, electronics or keys across town with real-time tracking and verified courier riders.
          </p>
        </div>
      </div>

      {createdTracking && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold">
              Pickup Scheduled! Tracking Number:{' '}
              <strong className="font-mono text-emerald-900">{createdTracking}</strong>
            </span>
          </div>
          <button
            onClick={() => setCreatedTracking(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Book Pickup & Delivery</h2>
          <p className="text-xs text-slate-500 mb-6">
            Rider will arrive within 30-45 minutes of booking confirmation.
          </p>

          <form onSubmit={handleBookDelivery} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pickup Address (Sender) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  placeholder="Complete pickup house, street, area"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Drop Address (Receiver) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  placeholder="Complete delivery house, street, area"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Receiver Name *
                </label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="Name of person receiving parcel"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Receiver Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Parcel Category
                </label>
                <select
                  value={parcelType}
                  onChange={(e) => setParcelType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Documents / Files">Documents / Files</option>
                  <option value="Tools / Spare Parts">Tools / Spare Parts</option>
                  <option value="Electronics / Mobile">Electronics / Mobile</option>
                  <option value="Medicines / Health">Medicines / Health</option>
                  <option value="Box / Package">Box / Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Approx Weight (Kg)
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={25}
                  step={0.5}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    ⚡ Urgent Express (+₹50)
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">ESTIMATED FARE</span>
                <span className="text-2xl font-black text-slate-900">₹{calculatedFare}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow transition-transform active:scale-98"
              >
                {isSubmitting ? 'Booking Rider...' : 'Schedule Pickup Now'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Delivery History */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-blue-400 mb-1">Active Deliveries</h3>
            <p className="text-xs text-slate-400">Track current parcels & order history.</p>
          </div>

          {deliveries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
              <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>No deliveries booked yet</span>
            </div>
          ) : (
            deliveries.map((dlv) => (
              <div
                key={dlv.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {dlv.tracking_number}
                  </span>
                  <span className="font-bold text-emerald-600 uppercase text-[10px]">
                    {dlv.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-slate-600">
                  <p className="truncate"><strong>To:</strong> {dlv.receiver_name} ({dlv.receiver_phone})</p>
                  <p className="truncate text-slate-400">{dlv.receiver_address}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                  <span>{dlv.parcel_type} ({dlv.weight_kg} kg)</span>
                  <span>₹{dlv.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
