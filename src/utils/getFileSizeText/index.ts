export default function getFileSizeText(size: number) {
  const units = ['B', 'KB', 'MB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
  const getText = (size: number, index: number): string => {
    if (index > units.length - 1) {
      return size + units[units.length - 1];
    }
    if (size >= 1024) {
      return getText(size / 1024, index + 1);
    }
    return size + units[index];
  };
  return getText(size, 0);
}
