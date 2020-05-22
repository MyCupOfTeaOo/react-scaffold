import { IRoute } from 'umi-types';
import * as fs from 'fs';
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

function subPagesGen(subPage?: SubPageConfig[]): string {
  if (Array.isArray(subPage)) {
    const temp1 = subPage.reduce((memo, item) => {
      const subPageStr = subPagesGen(item.subPage);
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
        url: '${item.url}',
        isMenu: ${item.isMenu},
        exact: ${item.exact},
        title: '${item.title || ''}',
        subPage: ${subPageStr}      
      }`;
      return memo.concat(temp2, ',\n');
    }, '');
    return `[${temp1}]`;
  } else {
    return `[]`;
  }
}

const pagesStr: string = pages.reduce((memo, page) => {
  const subPageStr = subPagesGen(page.subPage);
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
    subPage: ${subPageStr}
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
