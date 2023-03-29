export function writeString(
  dataView: DataView,
  offset: number,
  string: string,
) {
  for (let i = 0; i < string.length; i++) {
    dataView.setUint8(offset + i, string.charCodeAt(i));
  }
}

// pcm转为wav，添加wav头
// 参考 https://www.bilibili.com/read/cv9214843/
export function getWavHeader(encodedBuffers: Int16Array[]) {
  // Create header data
  const BYTES_PER_SAMPLE = Int16Array.BYTES_PER_ELEMENT; // 2
  const dataLength = encodedBuffers.reduce(
    (prev, next) => prev + next.byteLength,
    0,
  );
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // 资源交换文件标识符
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier length and file description length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type 'WAVE'
  writeString(view, 8, 'WAVE');
  // format chunk identifier 'fmt '
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, 1, true);
  // sample rate
  view.setUint32(24, 16000, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, 16000 * BYTES_PER_SAMPLE, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, BYTES_PER_SAMPLE, true);
  // bits per sample
  view.setUint16(34, 8 * BYTES_PER_SAMPLE, true);
  // data chunk identifier 'data'
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  return header;
}

export default function pcmToWav(encodedBuffers: Int16Array[]) {
  const buffers = [
    getWavHeader(encodedBuffers),
    ...encodedBuffers.splice(0, encodedBuffers.length),
  ];
  const data = new Blob(buffers, { type: 'audio/wav' });
  return data;
}
