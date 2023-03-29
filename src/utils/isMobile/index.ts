import isBrowser from '../isBrowser';

const userAgent = () => {
  const u = navigator.userAgent;
  return {
    trident: u.includes('Trident'),
    presto: u.includes('Presto'),
    webKit: u.includes('AppleWebKit'),
    gecko: u.includes('Gecko') && !u.includes('KHTML'),
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.includes('Android') || u.includes('Adr'),
    iPhone: u.includes('iPhone'),
    iPad: u.includes('iPad'),
    webApp: !u.includes('Safari'),
    weixin: u.includes('MicroMessenger'),
    qq: !!u.match(/\sQQ/i),
  };
};

export default function isMobile() {
  if (!isBrowser()) {
    return false;
  }
  const { mobile, android, ios } = userAgent();
  return mobile || android || ios || document.body.clientWidth < 750;
}
