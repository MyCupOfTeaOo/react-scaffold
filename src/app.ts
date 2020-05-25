import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { Location, Route } from '@/typings';
import { UA, dsn } from '#/projectConfig';
import commit from './.commit';

if (dsn) {
  Sentry.init({
    dsn,
  });
}

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
  if (UA) {
    if (!action) {
      ReactGA.initialize(UA);
      ReactGA.pageview(location.pathname + location.search);
    } else {
      ReactGA.pageview(location.pathname + location.search);
    }
  }
}
