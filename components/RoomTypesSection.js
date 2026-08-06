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
      setPaymentOption("pay_full"); // default to full payment option on click
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
      return 2000; // Fixed token booking amount
    }
    return room.rent; // Full amount = monthly rent
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    const txn = "PAY" + qrNonce;
    setPaymentTxnId(txn);
    setIsPaid(true);
  };

  const currentAmount = selectedRoom ? getPayableAmount(selectedRoom, paymentOption) : 0;
  
  // Construct dynamic UPI deep link
  const upiPayload = selectedRoom
    ? `upi://pay?pa=dreamhomes@upi&pn=Dream%20Homes%20PG&am=${currentAmount}&tn=Booking_${selectedRoom.type}_Ref${qrNonce}&cu=INR`
    : "";

  // Dynamic QR Code API image URL with custom purple branding color
  const qrImageUrl = upiPayload
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}&qzone=1&color=4c1d95`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-800 text-lg">Room Types & Pricing</h2>
        <span className="text-xs text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full font-medium">
          👉 Click any room to select & pay
        </span>
      </div>

      <div className="space-y-3">
        {roomTypes.map((r) => {
          const isSelected = selectedRoom?.type === r.type;
          return (
            <div
              key={r.type}
              onClick={() => handleRoomClick(r)}
              className={`border rounded-xl p-4 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-md"
                  : "border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-base flex items-center gap-2">
                      {r.type} Room
                      {isSelected && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-normal">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                      {r.ac && (
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          AC
                        </span>
                      )}
                      {r.attached_bathroom && (
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                          Attached Bathroom
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          r.available > 0
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {r.available > 0 ? `${r.available} available` : "Full"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-purple-700 font-bold text-xl">
                    ₹{r.rent.toLocaleString()}
                    <span className="text-gray-400 text-sm font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Inline Selection Action Bar */}
              {isSelected && (
                <div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between text-xs text-purple-900">
                  <span className="font-semibold flex items-center gap-1">
                    ✨ Room selected! Dynamic QR code ready below.
                  </span>
                  <span className="text-purple-700 font-bold underline">
                    Scroll to Pay ↓
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Configuration & Dropdown Section when Room is Selected */}
      {selectedRoom && (
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl space-y-5 transition-all animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-700/60 pb-4 gap-2">
            <div>
              <span className="bg-yellow-400 text-purple-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Step 2: Dynamic Payment Options
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Booking for {selectedRoom.type} Room - {pgName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-purple-200">Selected Room</span>
              <div className="font-bold text-yellow-300 text-lg">
                ₹{selectedRoom.rent.toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* Payment Type Selection Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-100">
              Select Payment Option (Dropdown):
            </label>
            <div className="relative">
              <select
                value={paymentOption}
                onChange={(e) => handlePaymentOptionChange(e.target.value)}
                className="w-full bg-purple-950/80 border border-purple-500/50 text-white text-base rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer font-medium"
              >
                <option value="" disabled className="bg-gray-900 text-gray-400">
                  -- Choose Payment Mode --
                </option>
                <option value="pay_full" className="bg-purple-950 text-white py-2">
                  💳 Pay Full Amount — ₹{selectedRoom.rent.toLocaleString()} (1st Month Rent)
                </option>
                <option value="pay_booking" className="bg-purple-950 text-white py-2">
                  🔖 Pay Booking Amount — ₹2,000 (Advance Token to reserve room)
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-yellow-400">
                ▼
              </div>
            </div>
          </div>

          {/* Payment Mode Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePaymentOptionChange("pay_full")}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                paymentOption === "pay_full"
                  ? "border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400"
                  : "border-purple-700/60 bg-purple-950/30 hover:bg-purple-950/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Pay Full Amount</span>
                  {paymentOption === "pay_full" && (
                    <span className="text-yellow-400 font-bold text-xs">✓ Selected</span>
                  )}
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  1 Month Rent (₹{selectedRoom.rent.toLocaleString()})
                </p>
              </div>
              <div className="mt-3 text-lg font-bold text-yellow-300">
                ₹{selectedRoom.rent.toLocaleString()}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePaymentOptionChange("pay_booking")}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                paymentOption === "pay_booking"
                  ? "border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400"
                  : "border-purple-700/60 bg-purple-950/30 hover:bg-purple-950/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Pay Booking Amount</span>
                  {paymentOption === "pay_booking" && (
                    <span className="text-yellow-400 font-bold text-xs">✓ Selected</span>
                  )}
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  Token advance to instantly lock & hold this room for 48 hrs.
                </p>
              </div>
              <div className="mt-3 text-lg font-bold text-yellow-300">₹2,000</div>
            </button>
          </div>

          {/* Dynamic Payment QR & Details Box */}
          {paymentOption && (
            <div className="bg-white text-gray-800 rounded-xl p-5 shadow-2xl space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {paymentOption === "pay_full"
                        ? "Pay Full Amount"
                        : "Pay Booking Token"}
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                      Live Dynamic QR
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Dynamic QR generated specifically for this amount & room session.
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold block">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-purple-700">
                    ₹{currentAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {!isPaid ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                  {/* Dynamic Branded QR Code Box */}
                  <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 via-white to-gray-50 rounded-2xl border-2 border-purple-200 shadow-inner relative group">
                    {/* Header Badge inside QR card */}
                    <div className="w-full flex items-center justify-between text-xs text-purple-900 border-b border-purple-100 pb-2 mb-3">
                      <span className="font-bold flex items-center gap-1">
                        🏠 Dream Homes PG
                      </span>
                      <span className="font-mono bg-purple-100 px-2 py-0.5 rounded text-[11px] font-bold text-purple-800">
                        REF #{qrNonce}
                      </span>
                    </div>

                    {/* QR Code Canvas / Image Container */}
                    <div className="relative p-2 bg-white rounded-xl shadow-md border border-purple-100 flex items-center justify-center min-h-[200px] min-w-[200px]">
                      {isGeneratingQr ? (
                        <div className="flex flex-col items-center gap-2 py-10">
                          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-purple-700 font-semibold">
                            Generating New QR...
                          </span>
                        </div>
                      ) : (
                        <img
                          src={qrImageUrl}
                          alt={`Dynamic UPI QR Code for ₹${currentAmount}`}
                          className="w-48 h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      {/* Embedded Center Logo Overlay */}
                      {!isGeneratingQr && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 bg-purple-700 text-white rounded-xl flex items-center justify-center font-bold text-lg border-2 border-white shadow-lg">
                            D
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic QR Timestamp & Refresh Button */}
                    <div className="w-full mt-3 space-y-2 text-center">
                      <div className="text-[11px] text-gray-500 font-medium">
                        Amount encoded: <span className="font-bold text-purple-700">₹{currentAmount.toLocaleString()}</span> • {qrGeneratedTime || "Just now"}
                      </div>
                      <button
                        type="button"
                        onClick={generateNewQrCode}
                        className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>🔄</span> Generate New QR Code
                      </button>
                    </div>

                    {/* Supported Apps footer */}
                    <div className="w-full pt-3 mt-3 border-t border-purple-100 flex items-center justify-center gap-3 text-[11px] font-semibold text-gray-500">
                      <span>GPay</span>
                      <span>•</span>
                      <span>PhonePe</span>
                      <span>•</span>
                      <span>Paytm</span>
                      <span>•</span>
                      <span>BHIM UPI</span>
                    </div>
                  </div>

                  {/* Payment Details & Action */}
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-xl p-3.5 text-xs space-y-2 text-purple-900">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected Room:</span>
                        <span className="font-semibold">{selectedRoom.type} Room</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Option:</span>
                        <span className="font-semibold">
                          {paymentOption === "pay_full" ? "Full Rent" : "Booking Advance Token"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dynamic Session ID:</span>
                        <span className="font-mono font-bold text-purple-700">REF-{qrNonce}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-purple-200 font-bold text-sm">
                        <span>Payable Amount:</span>
                        <span className="text-purple-700">
                          ₹{currentAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-green-600/30 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <span>🔒</span> Confirm Payment of ₹{currentAmount.toLocaleString()}
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Success View */
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-green-800">
                    Payment Successful!
                  </h4>
                  <p className="text-sm text-green-700">
                    Your {selectedRoom.type} room booking request at {pgName} has been confirmed.
                  </p>
                  <div className="bg-white border border-green-200 rounded-lg p-3 max-w-sm mx-auto text-xs text-gray-700 space-y-1 text-left">
                    <div>
                      <span className="text-gray-400">Transaction ID:</span>{" "}
                      <span className="font-mono font-bold text-purple-700">{paymentTxnId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount Paid:</span>{" "}
                      <span className="font-bold">
                        ₹{currentAmount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Room Reserved:</span>{" "}
                      <span className="font-bold">{selectedRoom.type} Room</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaid(false);
                      generateNewQrCode();
                    }}
                    className="text-xs text-purple-700 font-bold hover:underline pt-2 block mx-auto flex items-center justify-center gap-1"
                  >
                    <span>🔄</span> Generate New QR / Change Option
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
