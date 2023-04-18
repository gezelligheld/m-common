import { useInterval, useUpdateEffect } from 'ahooks';
import { TableProps } from 'antd/es/table';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';

interface TableList<T> {
  page: number;
  pageSize: number;
  total: number;
  list: T[];
  [k: string]: any;
}

interface UseTableProps<T> {
  action: (...args: any) => Promise<TableList<T>>;
  // 是否自动发起请求，默认自动
  manual?: boolean;
  // 依赖项，变化时自动请求
  deps?: any[];
  // 无感知定时轮询
  interval?: number;
  dataSourceKey?: string;
  onSuccess?: (data: TableList<T>) => void;
  onError?: (e: any) => void;
}

const useTable = <T = object>(props: UseTableProps<T>) => {
  const {
    action,
    deps = [],
    manual,
    interval,
    dataSourceKey = 'list',
    onError,
    onSuccess,
  } = props;

  const [data, setData] = useState<TableList<T>>();
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<{ [k: string]: any }>({});

  const loadList = async (params?: { [k: string]: any }) => {
    try {
      if (!params?.USETABLE_HIDDEN_LOADING) {
        setLoading(true);
      }
      cacheRef.current = {
        ...cacheRef.current,
        ...(_.omit(params, 'USETABLE_HIDDEN_LOADING') || {}),
      };
      const data = await action(cacheRef.current);
      onSuccess?.(data);
      setData(data);
      setLoading(false);
    } catch (e) {
      onError?.(e);
      setLoading(false);
    }
  };

  const loadListRef = useRef<typeof loadList | null>(null);
  loadListRef.current = loadList;

  const loadFistList = () => {
    loadList({ page: 1 });
  };

  const loadListWhenDelete = () => {
    loadList({
      // 最后一页只有一条数据时删除后，跳到上一页
      page:
        data?.[dataSourceKey].length === 1 &&
        cacheRef.current.page &&
        cacheRef.current.page !== 1
          ? cacheRef.current.page - 1
          : cacheRef.current.page,
    });
  };

  const handleTableChange: TableProps<T>['onChange'] = (
    pagination,
    filters,
    sorter,
  ) => {
    const params: { [k: string]: any } = {};
    if (Array.isArray(sorter)) {
      params.sorter = sorter.map(({ field, order }) => ({
        [field as string]:
          order === undefined ? undefined : order === 'ascend' ? 0 : 1,
      }));
    } else {
      params.sorter = [
        {
          [sorter.field as string]:
            sorter.order === undefined
              ? undefined
              : sorter.order === 'ascend'
              ? 0
              : 1,
        },
      ];
    }
    loadList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...(Object.keys(filters).length ? { filters } : {}),
      ...(Object.keys(sorter).length ? params : {}),
    });
  };

  useEffect(() => {
    if (!manual) {
      loadListRef.current?.();
    }
  }, [manual]);

  useUpdateEffect(() => {
    loadListRef.current?.({ page: 1 });
  }, [...deps]);

  useInterval(
    () => {
      loadListRef.current?.({ USETABLE_HIDDEN_LOADING: true });
    },
    interval,
    { immediate: interval !== undefined },
  );

  return {
    loadList,
    loadFistList,
    loadListWhenDelete,
    data,
    params: cacheRef.current,
    tableParams: {
      loading,
      dataSource: data?.[dataSourceKey],
      onChange: handleTableChange,
      pagination: {
        total: data?.total,
        current: data?.page,
        pageSize: data?.pageSize,
      },
    } as TableProps<T>,
  };
};

export default useTable;
