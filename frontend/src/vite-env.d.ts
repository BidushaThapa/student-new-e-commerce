/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_KHALTI_PUBLIC_KEY?: string;
  readonly VITE_KHALTI_PRODUCT_ID?: string;
}

type KhaltiPayload = {
  token: string;
  amount: number;
};

type KhaltiCheckout = {
  show: (options: { amount: number }) => void;
};

interface Window {
  KhaltiCheckout?: new (config: {
    publicKey: string;
    productIdentity: string;
    productName: string;
    productUrl: string;
    paymentPreference: string[];
    eventHandler: {
      onSuccess: (payload: KhaltiPayload) => void;
      onError: (error: unknown) => void;
      onClose: () => void;
    };
  }) => KhaltiCheckout;
}
