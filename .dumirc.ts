import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'mcl',
    nav: {
      'zh-CN': [
        { title: 'guide', link: '/guide' },
        { title: 'components', link: '/components/foo' },
        { title: 'hooks', link: '/hooks/use-unmount' },
        { title: 'utils', link: '/utils/array-buffer-to-base64' },
      ],
    },
  },
  resolve: {
    atomDirs: [
      { type: 'components', dir: 'src/components' },
      { type: 'hooks', dir: 'src/hooks' },
      { type: 'utils', dir: 'src/utils' },
    ],
  },
});
