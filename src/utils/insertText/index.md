# innsertText

画布中添加文字，超出宽度时自动换行

```js
import { innsertText } from 'm-common';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
if (ctx) {
  innsertText(ctx, 'hello world', 200, 50, 50, 25);
}
```
