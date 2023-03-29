# drawImage

画布中插入图片

```js
import { drawImage } from 'm-common';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
if (ctx) {
  drawImage(ctx, '123.png', [200, 50, 50, 25]);
}
```
