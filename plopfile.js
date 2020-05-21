const path = require('path');

module.exports = function(plop) {
  // controller generator
  plop.setGenerator('List', {
    description: '生成列表页',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: '路径(root: src/pages)',
        default: '',
      },
      {
        type: 'input',
        name: 'name',
        message: '文件名',
      },
      {
        type: 'input',
        name: 'fetch',
        message: '列表请求地址',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.join(__dirname, 'src/pages', '{{path}}/{{name}}.tsx'),
        templateFile: 'template/List.hbs',
      },
    ],
  });
  plop.setGenerator('Info', {
    description: '生成详情页',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '文件名',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.join(__dirname, 'src/pages', '{{path}}/{{name}}.tsx'),
        templateFile: 'template/Info.hbs',
      },
    ],
  });
};
