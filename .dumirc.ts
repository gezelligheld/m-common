import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'mcl',
    nav: {
      'zh-CN': [
        { title: 'guide', link: '/guide' },
        { title: 'components', link: '/components' },
        { title: 'hooks', link: '/hooks' },
        { title: 'utils', link: '/utils' },
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
