export default function int8ToInt16(int8: Int8Array) {
  const buf = (window as any).Buffer.from(int8);
  return new Int16Array(
    buf.buffer,
    buf.byteOffset,
    buf.byteLength / Int16Array.BYTES_PER_ELEMENT,
  );
}
