import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import './index.less';

interface NavSideBarProps<T>
  extends React.HtmlHTMLAttributes<HTMLUListElement> {
  // 数据
  options: { label: string; value: T }[];
  // 参照
  reference: 'top' | 'bottom';
  // 相对于滚动容器顶部/底部的偏移量
  offset: number;
  // 需要导航的标题类名
  targetClassName: string;
  // 滚动容器
  getContainer: () => HTMLElement;
}

function getOffsetTop(element: HTMLElement, container: HTMLElement | Window) {
  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      return rect.top - element.ownerDocument?.documentElement.clientTop;
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top;
  }

  return rect.top;
}

const NavSideBar = <T extends string | number>({
  options,
  getContainer,
  targetClassName,
  offset = 5,
  reference = 'top',
  className,
  ...rest
}: Partial<NavSideBarProps<T>>) => {
  const [navIndex, setNavIndex] = useState<T>(options?.[0]?.value as T);

  const containerRef = useRef<(() => HTMLElement) | null>(null);
  containerRef.current = getContainer || null;

  const handleScroll = useCallback(() => {
    const els = document.getElementsByClassName(targetClassName || '');
    if (!els.length) {
      return;
    }
    const links = Array.from(els)
      .map((item, index) => {
        const top = getOffsetTop(
          item as HTMLElement,
          containerRef.current?.() || window,
        );
        const clientHeight = containerRef.current?.()
          ? containerRef.current?.().clientHeight
          : document.body.clientHeight;
        if (
          (reference === 'top' && top < offset) ||
          (reference === 'bottom' && clientHeight - top > offset)
        ) {
          return { link: options?.[index]?.value, top };
        }
        return null;
      })
      .filter(Boolean);
    if (links.length) {
      setNavIndex(
        links.reduce((prev, curr) => (curr!.top > prev!.top ? curr : prev))
          ?.link || ('' as T),
      );
    }
  }, [offset, options, reference, targetClassName]);

  useEffect(() => {
    const container = containerRef.current?.() || window;
    container?.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <ul className={classNames('nav-sider', className)} {...rest}>
      {options?.map((item) => (
        <li
          key={item.value}
          className={`${navIndex === item.value ? 'active' : ''}`}
        >
          <i></i>
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default NavSideBar;
