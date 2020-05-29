import dynamic from 'umi/dynamic';
import numeral from 'numeral';
import moment from 'moment';
import lodash from 'lodash';
import Title from '@/components/Title';
import { GRoute, MenuId2Url, MenuResponse } from '@/typings';
import NotImplementPage from '@/pages/501';
import NotFoundPage from '@/pages/404';
import Loading from '@/components/Loading';
import { AuthRoutes } from '../components/Authority/decorator';
import { injectProps } from './decorators';

export const isInboundLink = /\S*:\/\/\S*/i;
export const isComponentUrl = /^component:(?<com>\S+)\((?<arg>.*)\)path=(?<path>.+)/;
/* eslint-disable prefer-destructuring,guard-for-in,no-restricted-syntax */

export function joinPath(...path: (string | undefined)[]) {
  return path
    .filter(p => p)
    .reduce((allPath, curPath) => {
      if (allPath?.charAt(allPath.length - 1) === '/') {
        return allPath + curPath;
      }
      if (curPath?.charAt(0) === '/') {
        return allPath + curPath;
      }
      return `${allPath}/${curPath}`;
    }, '');
}

export function safeParse(
  str: any,
  callback?: (err: any) => void,
): { [key: string]: any } | undefined {
  try {
    if (!str) {
      return undefined;
    }
    return JSON.parse(str);
  } catch (error) {
    if (callback) callback(error);
    console.error(error, str);
  }
  return undefined;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && value !== undefined;
}

export function parseUrl(
  path: string,
  component: any,
  rootPath = '',
): { path: string; component: any; isComponent: boolean } {
  let url = path;
  let com = component;
  let isComponent = false;
  // 支持compoent url
  const result = isComponentUrl.exec(path);

  if (result && result.groups) {
    isComponent = true;
    const arg = result.groups.arg;
    com = dynamic({
      loader: () =>
        import(`../blocks/${(result.groups as { com: string }).com}`).then(
          block => {
            return injectProps(safeParse(arg))(block.default);
          },
        ),
      loading: Loading,
    });
    url = rootPath + result.groups.path;
  } else if (isInboundLink.test(path)) {
    url = path;
  } else {
    url = rootPath + path;
  }
  return {
    path: url,
    component: com,
    isComponent,
  };
}

export function GenSubRoutes(
  routes: RouteConfig[],
  rootPath: string,
  menuId?: string,
  params?: { [key: string]: any },
): GRoute[] {
  return routes.map(item => {
    const mid = menuId || item.menuId;
    const p = params || item.params;
    const { path, component, isComponent } = parseUrl(
      item.path,
      item.component,
      rootPath,
    );
    let subRoutes: GRoute[] = [];
    if (Array.isArray(item.routes)) {
      subRoutes = GenSubRoutes(item.routes, path, mid, p);
    }
    if (subRoutes.length > 0) {
      subRoutes.push({
        path,
        exact: true,
        isMenu: false,
        redirect: subRoutes[0].path,
      });
      subRoutes.push({
        component: NotFoundPage,
        isMenu: false,
      });
      return {
        menuId: mid,
        component,
        path,
        exact: item.exact,
        title: item.title,
        routes: subRoutes,
        isMenu: item.isMenu,
        params: p,
      };
    }
    return {
      Routes: item.title ? [Title, AuthRoutes] : [AuthRoutes],
      component: component || NotImplementPage,
      path,
      exact: item.exact ?? !isComponent,
      title: item.title,
      menuId: mid,
      routes: subRoutes,
      isMenu: item.isMenu,
      params: p,
    };
  });
}

export function GenRoutes(
  menus: MenuResponse[],
  menuConfig: PageConfig[],
  rootPath = '',
): [GRoute[], MenuId2Url] {
  const menuId2Url: MenuId2Url = {};
  return [
    menus.map(item => {
      const target = menuConfig.find(item2 => item.menuId === item2.menuId);
      const { path, component, isComponent } = parseUrl(
        item.menuUrl.slice(1),
        target ? target.component : undefined,
        `${rootPath}/`,
      );
      menuId2Url[item.menuId] = path;
      const params = safeParse(item.params);
      if (component || target) {
        let routes: GRoute[] = [];
        if (Array.isArray(item.menus)) {
          const t = GenRoutes(item.menus, menuConfig, path);
          routes = t[0];
          for (const key in t[1]) {
            menuId2Url[key] = t[1][key];
          }
        }
        let subRoutes = [];
        if (target && Array.isArray(target.routes)) {
          subRoutes = GenSubRoutes(target.routes, path, item.menuId, params);
          routes.push(...subRoutes);
        }
        // 有子菜单
        if (routes.length > 0) {
          routes.push({
            path,
            exact: true,
            redirect: routes[0].path,
            isMenu: false,
          });
          routes.push({
            component: NotFoundPage,
            isMenu: false,
          });

          return {
            isMenu: item.isMenu ?? target?.isMenu ?? true,
            exact: target?.exact,
            Routes:
              // 全部都是子路由才展示title
              routes.length === subRoutes.length + 2
                ? [Title, AuthRoutes]
                : undefined,
            component,
            path,
            menuId: item.menuId,
            params,
            title: item.menuName,
            routes,
          };
        } else {
          return {
            isMenu: item.isMenu ?? target?.isMenu ?? true,
            Routes: [Title, AuthRoutes],
            component,
            path,
            menuId: item.menuId,
            exact: target?.exact ?? !isComponent,
            params,
            title: item.menuName,
            routes,
          };
        }
      } else {
        let routes: GRoute[] = [];
        if (Array.isArray(item.menus)) {
          const t = GenRoutes(item.menus, menuConfig, path);
          routes = t[0];
          for (const key in t[1]) {
            menuId2Url[key] = t[1][key];
          }
        }
        if (routes.length > 0) {
          routes.push({
            path,
            exact: true,
            redirect: routes[0].path,
            isMenu: false,
          });
          routes.push({
            component: NotFoundPage,
            isMenu: false,
          });
          return {
            isMenu: item.isMenu ?? true,
            path,
            menuId: item.menuId,
            params,
            title: item.menuName,
            routes,
          };
        } else {
          return {
            isMenu: item.isMenu ?? true,
            Routes: [Title, AuthRoutes],
            component: NotImplementPage,
            path,
            menuId: item.menuId,
            exact: true,
            params,
            title: item.menuName,
            routes,
          };
        }
      }
    }),
    menuId2Url,
  ];
}

export function minFormat(minutes?: number): string {
  if (!minutes) {
    return `0分`;
  }
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  return (
    (hour ? `${hour}小时` : '') + (min ? `${numeral(min).format('00')}分` : '')
  );
}

export function secFormat(second?: number): string {
  if (!second) {
    return `0秒`;
  }
  const min = Math.floor((second % 3600) / 60);
  const hour = Math.floor(second / 3600);
  const sec = second % 60;
  return (
    (hour ? `${hour}小时` : '') +
    (min ? `${numeral(min).format('00')}分` : '') +
    (sec ? `${numeral(sec).format('00')}秒` : '')
  );
}

export enum DateMode {
  sec = 'YYYY-MM-DD HH:mm:ss',
  min = 'YYYY-MM-DD HH:mm',
  hour = 'YYYY-MM-DD HH',
  day = 'YYYY-MM-DD',
  month = 'YYYY-MM',
  year = 'YYYY',
}

export function momentFormat(mode: DateMode) {
  return (value?: moment.Moment) => {
    return value ? value.format(mode) : value;
  };
}

export function toMoment(value?: string): moment.Moment | undefined {
  if (value) return moment(value);
  return undefined;
}

export const emailSuffix = [
  'qq.com',
  '163.com',
  'sina.com.cn',
  '126.com',
  'gamil.com',
  'hotmail.com',
  'outlook.com',
];

export function autoCompleEmail(searchText?: string) {
  if (searchText) {
    if (searchText[searchText.length - 1] === '@') return emailSuffix.map(suffix => searchText + suffix);
    else {
      return emailSuffix
        .filter(suffix => {
          return suffix.indexOf(searchText.split('@')[1]) === 0;
        })
        .map(suffix => {
          return `${searchText.split('@')[0]}@${suffix}`;
        });
    }
  }
}

export const forbidBlank = {
  pattern: /^\S.*\S$|^\S$|^$/,
  message: '首尾不允许为空格',
};

export function emptyString2Null(
  data?: string | Record<string, any> | any[],
): any {
  if (lodash.isString(data) && data === '') {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(emptyString2Null);
  }
  if (lodash.isObject(data)) {
    return lodash.mapValues(data, emptyString2Null);
  }
  return data;
}

export const entities: { [key: string]: string } = {
  // grave accented letters
  '&Agrave;': 'À',
  '&Egrave;': 'È',
  '&Igrave;': 'Ì',
  '&Ograve;': 'Ò',
  '&Ugrave;': 'Ù',
  '&agrave;': 'à',
  '&egrave;': 'è',
  '&igrave;': 'ì',
  '&ograve;': 'ò',
  '&ugrave;': 'ù',
  // acute accented letters
  '&Aacute;': 'Á',
  '&Eacute;': 'É',
  '&Iacute;': 'Í',
  '&Oacute;': 'Ó',
  '&Uacute;': 'Ú',
  '&Yacute;': 'Ý',
  '&aacute;': 'á',
  '&eacute;': 'é',
  '&iacute;': 'í',
  '&oacute;': 'ó',
  '&uacute;': 'ú',
  '&yacute;': 'ý',
  // circumflex accented letters
  '&Acirc;': 'Â',
  '&Ecirc;': 'Ê',
  '&Icirc;': 'Î',
  '&Ocirc;': 'Ô',
  '&Ucirc;': 'Û',
  '&acirc;': 'â',
  '&ecirc;': 'ê',
  '&icirc;': 'î',
  '&ocirc;': 'ô',
  '&ucirc;': 'û',
  // tilde accented letters
  '&Atilde;': 'Ã',
  '&Ntilde;': 'Ñ',
  '&Otilde;': 'Õ',
  '&atilde;': 'ã',
  '&ntilde;': 'ñ',
  '&otilde;': 'õ',
  // umlaut accented letters
  '&Auml;': 'Ä',
  '&Euml;': 'Ë',
  '&Iuml;': 'Ï',
  '&Ouml;': 'Ö',
  '&Uuml;': 'Ü',
  '&Yuml;': 'Ÿ',
  '&auml;': 'ä',
  '&euml;': 'ë',
  '&iuml;': 'ï',
  '&ouml;': 'ö',
  '&uuml;': 'ü',
  '&yuml;': 'ÿ',
  // other foreign characters
  '&iexcl;': '¡',
  '&iquest;': '¿',
  '&Ccedil;': 'Ç',
  '&ccedil;': 'ç',
  '&OElig;': 'Œ',
  '&oelig;': 'œ',
  '&ordm;': 'º',
  '&ordf;': 'ª',
  '&szlig;': 'ß',
  '&Oslash;': 'Ø',
  '&oslash;': 'ø',
  '&Aring;': 'Å',
  '&aring;': 'å',
  '&AElig;': 'Æ',
  '&aelig;': 'æ',
  '&THORN;': 'Þ',
  '&thorn;': 'þ',
  '&ETH;': 'Ð',
  '&eth;': 'ð',
  // currency units
  '&cent;': '¢',
  '&pound;': '£',
  '&yen;': '¥',
  '&euro;': '€',
  '&curren;': '¤',
  '&fnof;': 'ƒ',
  // math symbols
  '&gt;': '>',
  '&lt;': '<',
  '&divide;': '÷',
  '&deg;': '°',
  '&not;': '¬',
  '&plusmn;': '±',
  '&micro;': 'µ',
  '&there4;': '∴',
  '&ne;': '≠',
  '&ge;': '≥',
  '&le;': '≤',
  '&asymp;': '≈',
  '&radic;': '√',
  '&infin;': '∞',
  '&int;': '∫',
  '&part;': '∂',
  '&prime;': '′',
  '&Prime;': '″',
  '&sum;': '∑',
  '&prod;': '∏',
  '&permil;': '‰',
  '&equiv;': '≡',
  '&oline;': '‾',
  '&frasl;': '⁄',
  '&weierp;': '℘',
  '&image;': 'ℑ',
  '&real;': 'ℜ',
  '&alefsym;': 'ℵ',
  '&forall;': '∀',
  '&exist;': '∃',
  '&empty;': '∅',
  '&nabla;': '∇',
  '&isin;': '∈',
  '&notin;': '∉',
  '&ni;': '∋',
  '&minus;': '−',
  '&lowast;': '∗',
  '&prop;': '∝',
  '&ang;': '∠',
  '&and;': '∧',
  '&or;': '∨',
  '&cap;': '∩',
  '&cup;': '∪',
  '&sim;': '∼',
  '&cong;': '≅',
  '&sub;': '⊂',
  '&sup;': '⊃',
  '&nsub;': '⊄',
  '&sube;': '⊆',
  '&supe;': '⊇',
  '&oplus;': '⊕',
  '&otimes;': '⊗',
  '&perp;': '⊥',
  '&sdot;': '⋅',
  '&lceil;': '⌈',
  '&rceil;': '⌉',
  '&lfloor;': '⌊',
  '&rfloor;': '⌋',
  '&lang;': '〈',
  '&rang;': '〉',
  // punctuations and others
  '&nbsp;': ' ',
  '&amp;': '&',
  '&apos;': "'",
  '&quot;': '"',
  '&laquo;': '«',
  '&raquo;': '»',
  '&lsaquo;': '‹',
  '&rsaquo;': '›',
  '&sbquo;': '‚',
  '&bdquo;': '„',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&lsquo;': '‘',
  '&rsquo;': '’',
  '&hellip;': '…',
  '&reg;': '®',
  '&copy;': '©',
  '&trade;': '™',
  '&para;': '¶',
  '&bull;': '•',
  '&middot;': '·',
  '&sect;': '§',
  '&ndash;': '–',
  '&mdash;': '—',
  '&dagger;': '†',
  '&Dagger;': '‡',
  '&loz;': '◊',
  '&uarr;': '↑',
  '&darr;': '↓',
  '&larr;': '←',
  '&rarr;': '→',
  '&harr;': '↔',
  '&crarr;': '↵',
  '&lArr;': '⇐',
  '&uArr;': '⇑',
  '&rArr;': '⇒',
  '&dArr;': '⇓',
  '&hArr;': '⇔',
  '&spades;': '♠',
  '&clubs;': '♣',
  '&hearts;': '♥',
  '&diams;': '♦',
  // Greek letters
  '&Alpha;': 'Α',
  '&Beta;': 'Β',
  '&Gamma;': 'Γ',
  '&Delta;': 'Δ',
  '&Epsilon;': 'Ε',
  '&Zeta;': 'Ζ',
  '&Eta;': 'Η',
  '&Theta;': 'Θ',
  '&Iota;': 'Ι',
  '&Kappa;': 'Κ',
  '&Lambda;': 'Λ',
  '&Mu;': 'Μ',
  '&Nu;': 'Ν',
  '&Xi;': 'Ξ',
  '&Omicron;': 'Ο',
  '&Pi;': 'Π',
  '&Rho;': 'Ρ',
  '&Sigma;': 'Σ',
  '&Tau;': 'Τ',
  '&Upsilon;': 'Υ',
  '&Phi;': 'Φ',
  '&Chi;': 'Χ',
  '&Psi;': 'Ψ',
  '&Omega;': 'Ω',
  '&alpha;': 'α',
  '&beta;': 'β',
  '&gamma;': 'γ',
  '&delta;': 'δ',
  '&epsilon;': 'ε',
  '&zeta;': 'ζ',
  '&eta;': 'η',
  '&theta;': 'θ',
  '&iota;': 'ι',
  '&kappa;': 'κ',
  '&lambda;': 'λ',
  '&mu;': 'μ',
  '&nu;': 'ν',
  '&xi;': 'ξ',
  '&omicron;': 'ο',
  '&pi;': 'π',
  '&rho;': 'ρ',
  '&sigmaf;': 'ς',
  '&sigma;': 'σ',
  '&tau;': 'τ',
  '&upsilon;': 'υ',
  '&phi;': 'φ',
  '&chi;': 'χ',
  '&psi;': 'ψ',
  '&omega;': 'ω',
  '&thetasym;': 'ϑ',
  '&upsih;': 'ϒ',
  '&piv;': 'ϖ',
};

export function enumLVToOptions(enumObj: { [key: string]: string }) {
  return Object.keys(enumObj).map(key => ({
    label: key,
    value: enumObj[key],
  }));
}

export function enumVLToOptions(enumObj: { [key: string]: string }) {
  return Object.keys(enumObj).map(key => ({
    label: enumObj[key],
    value: key,
  }));
}

export function enumReflect<
  T extends { [key: string]: string } = { [key: string]: string }
>(enumObj: T) {
  return Object.keys(enumObj).reduce(
    (map, cur: keyof T) => {
      // eslint-disable-next-line
      map[enumObj[cur]] = cur;
      return map;
    },
    {} as {
      [key: string]: keyof T;
    },
  );
}

export function arrayReplace<T extends any = any>(
  array: T[],
  index: number,
  value: T,
): T[] {
  const prevArray = array.slice(0, index);
  const afterArray = array.slice(index + 1, array.length);
  return [...prevArray, value, ...afterArray];
}

export function arrayIterSlice<T extends any[]>(target: T) {
  return [...Array(target.length)].map((_, i) => target.slice(0, i + 1));
}

export function genPattrenByArea(area?: string) {
  if (!area) return undefined;
  const areaSlice = arrayIterSlice(area.split('-'));
  const pattern = areaSlice.reduce((total, cur, i) => {
    let p = total;
    if (total) {
      p += '|';
    }
    p += `^${cur.join('-')}`;
    if (i === areaSlice.length - 1) {
      p += '.*';
    } else {
      p += '$';
    }
    return p;
  }, '');
  return RegExp(pattern);
}
