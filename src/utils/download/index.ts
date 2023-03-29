interface downloadConfig {
  url: string;
  method?: 'get' | 'post';
  params?: Document | XMLHttpRequestBodyInit | null | undefined;
  header?: [string, string];
  responseType?: XMLHttpRequestResponseType;
}

export default function download<T = any>(config: downloadConfig): Promise<T> {
  const { url, method = 'get', header, params, responseType = '' } = config;
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.open(method, url);
  if (header) {
    xhr.setRequestHeader(...header);
  }
  xhr.send(params);

  return new Promise((resolve, reject) => {
    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { response } = xhr;
        // 如果返回不是数据流格式抛出错误
        if (response.type !== 'application/octet-stream') {
          const text = await response.text();
          const errorMsg = JSON.parse(text);
          reject(errorMsg?.message || '导出失败！');
        } else {
          resolve(response);
          if ((window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveBlob(response);
          } else {
            const url = window.URL
              ? window.URL.createObjectURL(response)
              : window.webkitURL.createObjectURL(response);
            const a = document.createElement('a');

            // 文件名可以从响应头里拿到
            const content = xhr.getResponseHeader('content-disposition');
            let name1 = '';
            let name2 = '';
            if (content) {
              const str = content.match(/filename=(.*)/)?.[1] || '';
              // 获取filename的值
              name1 = decodeURIComponent(str);
              // 获取filename*的值
              name2 = decodeURIComponent(str.substring(6));
            }
            a.href = url;
            // 文件名可以从响应头里拿到
            a.download = name2 || name1;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        }
      }
    };
    xhr.onerror = (error) => reject(error);
  });
}
