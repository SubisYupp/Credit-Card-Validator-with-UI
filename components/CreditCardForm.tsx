"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard as CreditCardIcon, Lock, Check, AlertCircle } from "lucide-react";
import {
  luhnCheck,
  detectCardType,
  formatCardNumber,
  validateExpiryDate,
  formatExpiryDate,
  validateCVV,
  CardType
} from "@/utils/cardValidation";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface ValidationState {
  cardNumber: { isValid: boolean; error?: string };
  expiryDate: { isValid: boolean; error?: string };
  cvv: { isValid: boolean; error?: string };
  cardholderName: { isValid: boolean; error?: string };
}

export default function CreditCardForm() {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const [validation, setValidation] = useState<ValidationState>({
    cardNumber: { isValid: false },
    expiryDate: { isValid: false },
    cvv: { isValid: false },
    cardholderName: { isValid: false }
  });

  const [cardType, setCardType] = useState<CardType | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Real-time validation
  useEffect(() => {
    const newValidation: ValidationState = {
      cardNumber: { isValid: false },
      expiryDate: { isValid: false },
      cvv: { isValid: false },
      cardholderName: { isValid: false }
    };

    // Validate card number
    const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');
    if (cleanCardNumber.length >= 13) {
      const detectedType = detectCardType(cleanCardNumber);
      setCardType(detectedType);
      
      if (detectedType && detectedType.lengths.includes(cleanCardNumber.length)) {
        if (luhnCheck(cleanCardNumber)) {
          newValidation.cardNumber = { isValid: true };
        } else {
          newValidation.cardNumber = { isValid: false, error: "Invalid card number" };
        }
      } else {
        newValidation.cardNumber = { isValid: false, error: "Invalid card length" };
      }
    } else if (cleanCardNumber.length > 0) {
      const detectedType = detectCardType(cleanCardNumber);
      setCardType(detectedType);
      newValidation.cardNumber = { isValid: false, error: "Card number too short" };
    }

    // Validate expiry date
    if (formData.expiryDate.length >= 5) {
      const expiryValidation = validateExpiryDate(formData.expiryDate);
      newValidation.expiryDate = expiryValidation;
    } else if (formData.expiryDate.length > 0) {
      newValidation.expiryDate = { isValid: false, error: "Invalid format (MM/YY)" };
    }

    // Validate CVV
    if (formData.cvv.length > 0) {
      if (validateCVV(formData.cvv, cardType)) {
        newValidation.cvv = { isValid: true };
      } else {
        const expectedLength = cardType?.code.size || 3;
        newValidation.cvv = { isValid: false, error: `Must be ${expectedLength} digits` };
      }
    }

    // Validate cardholder name
    if (formData.cardholderName.trim().length >= 2) {
      newValidation.cardholderName = { isValid: true };
    } else if (formData.cardholderName.length > 0) {
      newValidation.cardholderName = { isValid: false, error: "Name too short" };
    }

    setValidation(newValidation);
  }, [formData, cardType]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;

    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value, cardType);
        // Limit length based on card type
        const maxLength = cardType?.lengths[0] || 19;
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length > maxLength) return;
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        if (formattedValue.length > 5) return;
        break;
      case 'cvv':
        formattedValue = value.replace(/\D/g, '');
        const maxCvvLength = cardType?.code.size || 4;
        if (formattedValue.length > maxCvvLength) return;
        break;
      case 'cardholderName':
        formattedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        if (formattedValue.length > 26) return;
        break;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allValid = Object.values(validation).every(v => v.isValid);
    
    if (allValid) {
      setIsSubmitted(true);
      // Here you would typically send the data to your payment processor
      console.log('Valid card data:', formData);
    }
  };

  const getFieldIcon = (field: keyof ValidationState) => {
    const fieldValidation = validation[field];
    if (formData[field].length === 0) return null;
    
    return fieldValidation.isValid ? (
      <Check className="w-5 h-5 text-green-400" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-400" />
    );
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Card Validated!</h3>
        <p className="text-gray-300">Your {cardType?.name} card passed all validation checks.</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-4 px-4 py-2 bg-cyan-500 text-gray-900 rounded-lg hover:bg-cyan-400 transition"
        >
          Validate Another Card
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <CreditCardIcon className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-semibold">Card Validation</h3>
        {cardType && (
          <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded">
            {cardType.name}
          </span>
        )}
      </div>

      {/* Card Number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition pr-12"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldIcon('cardNumber')}
          </div>
        </div>
        {validation.cardNumber.error && (
          <p className="text-red-400 text-sm">{validation.cardNumber.error}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Expiry Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
          <div className="relative">
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldIcon('expiryDate')}
            </div>
          </div>
          {validation.expiryDate.error && (
            <p className="text-red-400 text-sm">{validation.expiryDate.error}</p>
          )}
        </div>

        {/* CVV */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {cardType?.code.name || 'CVV'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              placeholder={cardType?.code.size === 4 ? "1234" : "123"}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldIcon('cvv')}
            </div>
          </div>
          {validation.cvv.error && (
            <p className="text-red-400 text-sm">{validation.cvv.error}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Cardholder Name</label>
        <div className="relative">
          <input
            type="text"
            value={formData.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            placeholder="JOHN DOE"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-400 focus:outline-none transition pr-12"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getFieldIcon('cardholderName')}
          </div>
        </div>
        {validation.cardholderName.error && (
          <p className="text-red-400 text-sm">{validation.cardholderName.error}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!Object.values(validation).every(v => v.isValid)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-gray-900 rounded-lg font-medium hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <Lock className="w-4 h-4" />
        Validate Card
      </button>

      {/* Security Notice */}
      <p className="text-xs text-gray-400 text-center">
        🔒 This is a demo validator. No real payment data is processed.
      </p>
    </motion.form>
  );
}