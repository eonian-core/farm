import { FieldPolicy } from "@apollo/client";

export const bigIntPolicy: FieldPolicy<any, BigInt> = {
  read: (value) => {
    if (!value || value instanceof BigInt) {
      return value;
    }
    return BigInt(value);
  },
};
