export default function svgrToFile(dataurl: string, filename: string) {
  const dom = new DOMParser().parseFromString(
    decodeURIComponent(dataurl.split(',')[1]),
    'image/svg+xml',
  );
  const svg = dom.childNodes[0];
  const bstr = new XMLSerializer().serializeToString(svg);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: 'image/svg+xml',
  });
}
