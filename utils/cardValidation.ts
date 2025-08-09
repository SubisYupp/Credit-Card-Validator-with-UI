// Credit card validation utilities

export interface CardType {
  name: string;
  pattern: RegExp;
  gaps: number[];
  lengths: number[];
  code: {
    name: string;
    size: number;
  };
}

export const cardTypes: Record<string, CardType> = {
  visa: {
    name: 'Visa',
    pattern: /^4/,
    gaps: [4, 8, 12],
    lengths: [16, 18, 19],
    code: { name: 'CVV', size: 3 }
  },
  mastercard: {
    name: 'Mastercard',
    pattern: /^(5[1-5]|2[2-7])/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: 'CVC', size: 3 }
  },
  amex: {
    name: 'American Express',
    pattern: /^3[47]/,
    gaps: [4, 10],
    lengths: [15],
    code: { name: 'CID', size: 4 }
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5)/,
    gaps: [4, 8, 12],
    lengths: [16, 19],
    code: { name: 'CID', size: 3 }
  },
  dinersclub: {
    name: 'Diners Club',
    pattern: /^3[0689]/,
    gaps: [4, 10],
    lengths: [14],
    code: { name: 'CVV', size: 3 }
  },
  jcb: {
    name: 'JCB',
    pattern: /^35/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: { name: 'CVV', size: 3 }
  }
};

// Luhn algorithm for credit card validation
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Detect card type
export function detectCardType(cardNumber: string): CardType | null {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  for (const type of Object.values(cardTypes)) {
    if (type.pattern.test(cleanNumber)) {
      return type;
    }
  }
  
  return null;
}

// Format card number with spaces
export function formatCardNumber(value: string, cardType?: CardType | null): string {
  const cleanValue = value.replace(/\D/g, '');
  const gaps = cardType?.gaps || [4, 8, 12];
  
  let formatted = '';
  let gapIndex = 0;
  
  for (let i = 0; i < cleanValue.length; i++) {
    if (gapIndex < gaps.length && i === gaps[gapIndex]) {
      formatted += ' ';
      gapIndex++;
    }
    formatted += cleanValue[i];
  }
  
  return formatted;
}

// Validate expiry date
export function validateExpiryDate(expiry: string): { isValid: boolean; error?: string } {
  const cleanExpiry = expiry.replace(/\D/g, '');
  
  if (cleanExpiry.length !== 4) {
    return { isValid: false, error: 'Invalid format' };
  }
  
  const month = parseInt(cleanExpiry.substring(0, 2));
  const year = parseInt('20' + cleanExpiry.substring(2, 4));
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month' };
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Card expired' };
  }
  
  return { isValid: true };
}

// Format expiry date
export function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
  }
  return cleanValue;
}

// Validate CVV
export function validateCVV(cvv: string, cardType?: CardType | null): boolean {
  const cleanCVV = cvv.replace(/\D/g, '');
  const expectedLength = cardType?.code.size || 3;
  return cleanCVV.length === expectedLength;
}