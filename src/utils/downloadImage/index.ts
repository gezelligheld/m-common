export default function downloadImage(
  src: string,
  options?: { filename?: string; type: string },
) {
  const { filename = 'default.png', type = 'images/png' } = options || {};
  const image = new Image();
  // 防止图片被缓存不触发onload
  image.src = src + `${src.includes('?') ? '&' : '?'}v=${Date.now()}`;
  image.crossOrigin = 'Anonymous';

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('canvas上下文不存在'));
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('文件路径有误'));
            return;
          }
          const url = window.URL
            ? window.URL.createObjectURL(blob)
            : window.webkitURL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          resolve(image);
        }, type);
      } catch (e) {
        reject(e);
      }
    };
    image.onerror = () => {
      reject(new Error('图片下载失败'));
    };
  });
}
