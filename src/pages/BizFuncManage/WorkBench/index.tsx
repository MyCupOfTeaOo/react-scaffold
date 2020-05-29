import React, { useEffect } from 'react';
import {
  Workbench,
  ServiceContext,
  PageConfigContext,
  getReactEntityRenderText,
} from 'micro-page';
import { RouteProps } from '@/typings';
import stores from '@/stores';
import core from '../core';

export interface WorkBenchProps
  extends RouteProps<{
    projectId: string;
  }> {}

const WorkBench: React.FC<WorkBenchProps> = props => {
  useEffect(() => {
    stores.global.setCollapsed(true);
  }, []);
  return (
    <PageConfigContext.Provider
      value={{
        getReactPageRenderText(entityId, pageId) {
          return `component:BizPageRender({"projectId": "${props.match.params.projectId}","entityId" : "${entityId}","pageId": "${pageId}"})path=test`;
        },
        getReactEntityRenderText,
      }}
    >
      <ServiceContext.Provider
        value={{ projectId: props.match.params.projectId }}
      >
        <Workbench basePath={props.match.url} core={core} />
      </ServiceContext.Provider>
    </PageConfigContext.Provider>
  );
};

export default WorkBench;
