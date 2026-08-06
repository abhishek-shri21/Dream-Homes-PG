"use client";

import { useState } from "react";

export default function RoomTypesSection({ roomTypes, pgName }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [paymentOption, setPaymentOption] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentTxnId, setPaymentTxnId] = useState("");

  // Dynamic QR Code State
  const [qrNonce, setQrNonce] = useState(100001);
  const [qrGeneratedTime, setQrGeneratedTime] = useState("");
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  const generateNewQrCode = () => {
    setIsGeneratingQr(true);
    const newNonce = Math.floor(100000 + Math.random() * 900000);
    setQrNonce(newNonce);
    const now = new Date();
    setQrGeneratedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setIsGeneratingQr(false), 300);
  };

  const handleRoomClick = (room) => {
    if (selectedRoom?.type !== room.type) {
      setSelectedRoom(room);
      setPaymentOption("pay_full");
      setIsPaid(false);
      generateNewQrCode();
    }
  };

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
    setIsPaid(false);
    generateNewQrCode();
  };

  const getPayableAmount = (room, option) => {
    if (!room) return 0;
    if (option === "pay_booking") {
      return 2000;
    }
    return room.rent;
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    const txn = "PAY" + qrNonce;
    setPaymentTxnId(txn);
    setIsPaid(true);
  };

  const currentAmount = selectedRoom ? getPayableAmount(selectedRoom, paymentOption) : 0;
  
  const upiPayload = selectedRoom
    ? `upi://pay?pa=dreamhomes@upi&pn=Dream%20Homes%20PG&am=${currentAmount}&tn=Booking_${selectedRoom.type}_Ref${qrNonce}&cu=INR`
    : "";

  const qrImageUrl = upiPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}&qzone=1&color=004790`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-primary text-xl">Room Types & Pricing</h2>
        <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
          👉 Select a room below to calculate rent & pay
        </span>
      </div>

      <div className="space-y-3">
        {roomTypes.map((r) => {
          const isSelected = selectedRoom?.type === r.type;
          return (
            <div
              key={r.type}
              onClick={() => handleRoomClick(r)}
              className={`border rounded-[24px] p-5 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                  : "border-outline-variant/40 hover:border-primary/40 hover:shadow-sm bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-outline bg-white"
                    }`}
                  >
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-primary text-base">
                        {r.type} Occupancy Sharing
                      </h3>
                      {r.ac && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ❄️ AC Room
                        </span>
                      )}
                      {r.attached_bathroom && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          🚿 Attached Washroom
                        </span>
                      )}
                    </div>
                    <p className="text-onSurface-variant text-xs mt-0.5">
                      Security Deposit: ₹{r.deposit.toLocaleString()} • Notice Period: 30 days
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-onSurface-variant block">Rent / month</span>
                  <span className="text-primary font-display font-extrabold text-xl">
                    ₹{r.rent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Booking Payment Card */}
      {selectedRoom && (
        <div className="bg-white border border-primary/30 rounded-[24px] p-6 shadow-ambient animate-fadeIn space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-container pb-4 gap-2">
            <div>
              <span className="text-secondary font-bold text-xs uppercase tracking-wider block">
                Selected Option
              </span>
              <h3 className="text-xl font-display font-extrabold text-primary">
                Reserve {selectedRoom.type} Sharing Room
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-onSurface-variant block">Total Monthly Rent</span>
              <span className="text-2xl font-display font-extrabold text-primary">
                ₹{selectedRoom.rent.toLocaleString()}
              </span>
            </div>
          </div>

          {!isPaid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Payment Mode Selector */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-onSurface-variant block uppercase tracking-wider">
                  Select Payment Amount:
                </span>
                
                <label
                  onClick={() => handlePaymentOptionChange("pay_full")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentOption === "pay_full"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-outline-variant/60 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentOption === "pay_full"}
                      onChange={() => {}}
                      className="accent-primary"
                    />
                    <div>
                      <span className="font-bold text-primary text-sm block">Full Monthly Rent</span>
                      <span className="text-xs text-onSurface-variant">Pay 100% rent now</span>
                    </div>
                  </div>
                  <span className="font-display font-extrabold text-primary text-base">
                    ₹{selectedRoom.rent.toLocaleString()}
                  </span>
                </label>

                <label
                  onClick={() => handlePaymentOptionChange("pay_booking")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentOption === "pay_booking"
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-outline-variant/60 hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_opt"
                      checked={paymentOption === "pay_booking"}
                      onChange={() => {}}
                      className="accent-primary"
                    />
                    <div>
                      <span className="font-bold text-primary text-sm block">Advance Token Booking</span>
                      <span className="text-xs text-onSurface-variant">Reserve bed immediately</span>
                    </div>
                  </div>
                  <span className="font-display font-extrabold text-primary text-base">
                    ₹2,000
                  </span>
                </label>
              </div>

              {/* Dynamic UPI QR Code Box */}
              <div className="bg-surface-container/60 border border-outline-variant/40 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                  📱 Scan & Pay via GPay / PhonePe / Paytm / BHIM
                </span>
                
                <div className="w-48 h-48 bg-white p-2 rounded-2xl border border-outline-variant/60 shadow-sm relative mb-3 flex items-center justify-center">
                  {isGeneratingQr ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <img
                      src={qrImageUrl}
                      alt="Dynamic UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="text-xs text-onSurface-variant space-y-1 mb-4">
                  <p>Amount: <strong className="text-primary font-bold">₹{currentAmount.toLocaleString()}</strong></p>
                  <p className="font-mono text-[11px]">UPI ID: dreamhomes@upi</p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  className="w-full bg-secondary-container hover:bg-secondary text-white font-display font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <span>🔒</span> Simulate Payment Confirmation (₹{currentAmount.toLocaleString()})
                </button>
              </div>
            </div>
          ) : (
            /* Booking Success Receipt Modal */
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
                ✓
              </div>
              <h4 className="text-2xl font-display font-extrabold text-emerald-800">
                Room Booking Confirmed!
              </h4>
              <p className="text-sm text-emerald-700 max-w-md mx-auto">
                Your reservation for <strong>{selectedRoom.type} Sharing Room</strong> at <strong>{pgName}</strong> has been successfully booked.
              </p>
              
              <div className="bg-white border border-emerald-200 rounded-xl p-4 max-w-sm mx-auto text-xs text-onSurface-variant space-y-2 text-left shadow-sm">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Booking Reference ID:</span>
                  <span className="font-mono font-bold text-primary">{paymentTxnId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-700">₹{currentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Room Reserved:</span>
                  <span className="font-bold">{selectedRoom.type} Room</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPaid(false);
                    generateNewQrCode();
                  }}
                  className="text-xs text-primary font-bold bg-white border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/5 transition-all"
                >
                  Book Another Room
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
