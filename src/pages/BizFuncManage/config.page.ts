const config: PageConfig = {
  menuId: 'noticeAndFeedback',
  component: './BizFuncManage/index',
  isMenu: true,
  exact: false,
  routes: [
    {
      path: '/:projectId',
      exact: false,
      title: '配置工作台',
      component: './BizFuncManage/WorkBench',
    },
    {
      path: '/',
      title: '项目列表',
      isMenu: true,
      component: './BizFuncManage/Project/ProjectList',
    },
  ],
};
export default config;
