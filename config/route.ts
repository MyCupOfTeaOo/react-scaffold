import { IRoute } from 'umi-types';
import * as fs from 'fs';
import glob from 'glob';
import path from 'path';
import pages from './pages';

const routes: IRoute[] = [
  {
    path: '/',
    component: '../layouts/index',
    routes: [
      {
        path: 'sign',
        component: '../layouts/SignLayout',
        routes: [
          { path: 'signIn', component: './Sign/SignIn', title: '登录' },
          {
            path: '.',
            redirect: 'signIn',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [{ path: '/', component: '.' }],
      },
    ],
  },
];
function push404(elements: IRoute[]): void {
  elements.forEach((element: IRoute) => {
    if (element.routes && element.routes.length > 0) {
      element.routes.push({ component: './404', title: '404' });
      push404(element.routes);
    }
  });
}
push404(routes);

function subPagesGen(routes?: RouteConfig[]): string {
  if (Array.isArray(routes)) {
    const temp1 = routes.reduce((memo, item) => {
      const subPageStr = subPagesGen(item.routes);
      const temp2 = `{
      component: ${
        item.component
          ? `__IS_BROWSER
        ? dynamic({
          loader: () => import('${item.component}'),
          loading: Loading
        })
        : require('${item.component}').default`
          : undefined
      },
        path: '${item.path}',
        isMenu: ${item.isMenu},
        exact: ${item.exact},
        title: '${item.title || ''}',
        routes: ${subPageStr}      
      }`;
      return memo.concat(temp2, ',\n');
    }, '');
    return `[${temp1}]`;
  } else {
    return `[]`;
  }
}
// 自动查找区块配置
const blockConfigPaths = glob.sync('src/pages/**/config.page.json');
pages.push(
  ...blockConfigPaths.map(item => {
    delete require.cache[path.resolve(item)];
    return require(path.resolve(item)).default;
  }),
);
const pagesStr: string = pages.reduce((memo, page) => {
  const subPageStr = subPagesGen(page.routes);
  const componentStr = `
  __IS_BROWSER
  ? dynamic({
    loader: () => import('${page.component}'),
    loading: Loading
  })
  : require('${page.component}').default
  `;
  const temp = `{
    component: ${page.component ? componentStr : undefined},
    menuId: '${page.menuId}',
    isMenu: ${page.isMenu},
    exact: ${page.exact},
    routes: ${subPageStr}
  }`;
  return memo.concat(temp, ',\n');
}, '');

fs.writeFileSync(
  'src/pages/.pages.ts',
  `import dynamic from 'umi/dynamic';
import Loading from '@/components/Loading';
declare const __IS_BROWSER: string;\n\nconst pages: PageConfig[] = [${pagesStr}];\nexport default pages;`,
  'utf-8',
);

export default routes;
