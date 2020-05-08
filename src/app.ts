import ReactGA from 'react-ga';
import { Location, Route } from '@/typings';
import { UA } from '#/projectConfig';
import commit from './.commit';

/* eslint-disable no-console */

export function render(oldRender: Function) {
  console.group('版本信息');
  console.log(`版本hash: ${commit.hash}`);
  console.log(`更新内容: ${commit.msg}`);
  console.groupEnd();
  oldRender();
  window.oldRender = oldRender;
}

export function onRouteChange({
  action,
  location,
}: {
  action: string;
  location: Location;
  routes: Route[];
}) {
  if (!action) {
    ReactGA.initialize(UA);
    ReactGA.pageview(location.pathname + location.search);
  } else {
    ReactGA.pageview(location.pathname + location.search);
  }
}
