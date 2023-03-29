export default function getSuffixName(str: string) {
  return str.substring(str.lastIndexOf('.') + 1);
}
