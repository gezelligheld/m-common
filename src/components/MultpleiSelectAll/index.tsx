import { Select, SelectProps } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';

export const ALL_VALUE = 'ALL';

const tagRender: SelectProps['tagRender'] = ({ value, label, onClose }) => (
  <span className="ant-select-selection-item">
    <span className="ant-select-selection-item-content">
      {value === ALL_VALUE ? '全部' : label}
    </span>
    <span className="ant-select-selection-item-remove" onClick={onClose}>
      x
    </span>
  </span>
);

const CustomSelectAll: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  ...rest
}) => {
  const [data, setData] = useState<string[]>([]);

  const isAllRef = useRef(false);

  const realOptions = useMemo(() => {
    if (options?.length) {
      return [{ label: '全部', value: ALL_VALUE }, ...options];
    }
    return [];
  }, [options]);

  const handleChange: SelectProps['onChange'] = (value, option) => {
    if (!value && !value.length) {
      setData([]);
      onChange?.([], option);
      return;
    }

    let data = [];
    if (value.includes(ALL_VALUE)) {
      // 点击全选项导致的全选
      if (value[value.length - 1] === ALL_VALUE) {
        data = [ALL_VALUE, ...(options || []).map(({ value }) => value)];
        isAllRef.current = true;
        // 取消选中某一项导致取消全选
      } else {
        data = value.filter((v: string) => v !== ALL_VALUE);
        isAllRef.current = false;
      }
    } else if (value.length === options?.length) {
      // 再次点击全选项导致取消全选
      if (isAllRef.current) {
        data = [];
        isAllRef.current = false;
        // 全部选择导致的全选
      } else {
        data = [ALL_VALUE, ...(options || []).map(({ value }) => value)];
        isAllRef.current = true;
      }
    } else {
      data = value;
    }
    setData(data);
    onChange?.(data, option);
  };

  useEffect(() => {
    if (value?.includes(ALL_VALUE)) {
      isAllRef.current = true;
    }
    setData(value);
  }, [value]);

  return (
    <Select
      value={data}
      mode="multiple"
      className={classNames({ ['items-rest']: data.includes(ALL_VALUE) })}
      tagRender={tagRender}
      options={realOptions}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default CustomSelectAll;
