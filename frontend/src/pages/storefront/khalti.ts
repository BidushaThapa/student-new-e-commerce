let khaltiScriptPromise: Promise<void> | undefined;

export function loadKhaltiCheckout(): Promise<void> {
  if (window.KhaltiCheckout) return Promise.resolve();
  if (khaltiScriptPromise) return khaltiScriptPromise;

  khaltiScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://khalti.com/static/khalti-checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Khalti checkout'));
    document.head.appendChild(script);
  });
  return khaltiScriptPromise;
}
