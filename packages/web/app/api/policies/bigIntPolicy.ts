import { FieldPolicy } from "@apollo/client";

export const bigIntPolicy: FieldPolicy<any, bigint> = {
  read: (value) => {
    if (!value || typeof value === 'bigint') 
      return value;
    
    return BigInt(value);
  },
};
