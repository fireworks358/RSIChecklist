// Runtime polyfills for older iPad/Safari versions (iPadOS 15–17.3).
// Must be imported before anything that pulls in pdfjs-dist.

// Promise.withResolvers — Safari 17.4+
if (typeof (Promise as { withResolvers?: unknown }).withResolvers !== 'function') {
  (Promise as unknown as { withResolvers: () => unknown }).withResolvers = function withResolvers<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// structuredClone — Safari 15.4+ (fallback handles the plain-data cases pdfjs uses)
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
}

// Array/String/TypedArray .at() — Safari 15.4+
function atPolyfill<T>(this: ArrayLike<T> | string, index: number) {
  const n = Math.trunc(index) || 0;
  const i = n < 0 ? this.length + n : n;
  return i < 0 || i >= this.length ? undefined : this[i];
}
for (const proto of [Array.prototype, String.prototype, Object.getPrototypeOf(Uint8Array.prototype)]) {
  if (typeof proto.at !== 'function') {
    Object.defineProperty(proto, 'at', { value: atPolyfill, writable: true, configurable: true });
  }
}

export {};
