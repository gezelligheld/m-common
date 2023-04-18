# useTable

antd table hook

```js
import { useTable } from 'm-common';
import { Table } from 'antd';

export default () => {
  const { tableParams } = useTable({
    action: () => Promise.resolve({ page: 1, pageSize: 10, list: [] }),
  });
  return <Table {...tableParams} />;
};
```
