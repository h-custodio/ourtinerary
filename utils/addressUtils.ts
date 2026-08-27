import { Address } from "@/component_types/address";

export const parseAddress = (address: string | null): Address | null => {
  if (address === null) {
    return null;
  }

  const addressParts = address
    .split(",")
    .map((addressPart) => addressPart.trim());

  return {
    street: addressParts[0] || "123 Main ST",
    city: addressParts[1] || "Montreal",
    province: addressParts[2] || "QC",
    zipCode: addressParts[3] || "H3Z 2Y7",
    country: addressParts[4] || "Canada",
  };
};
