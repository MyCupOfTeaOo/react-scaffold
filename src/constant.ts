import { LabelRowProps } from 'teaness/es/Label/typings';

export enum respCode {
  success = 200,
  cancel = 0,
}

export const enableOptions = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '停用',
    value: 0,
  },
];

export const horizontalColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 3 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      lg: { span: 6 },
      xl: { span: 5 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const oneColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      xl: { span: 5 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 19 },
      xl: { span: 15 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  type: 'flex',
  align: 'middle',
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  gutter: [6, 0],
};

export const twoColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      xl: { span: 5 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      xl: { span: 5 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const oneColProps2: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 3 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 19 },
      xl: { span: 15 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  type: 'flex',
  align: 'middle',
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  gutter: [6, 0],
};

export const expertHorizontalColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 4 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      lg: { span: 6 },
      xl: { span: 4 },
    },
  },
  labelFloat: {
    xs: 'left',
    md: 'left',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const expertOneColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 3 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 19 },
      xl: { span: 15 },
    },
  },
  labelFloat: {
    xs: 'left',
    md: 'left',
  },
  type: 'flex',
  align: 'middle',
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  gutter: [6, 0],
};

export const expertTwoColProps: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 4 },
    },
    children: {
      xs: { span: 8 },
      md: { span: 9 },
      lg: { span: 11 },
      xl: { span: 12 },
    },
  },
  labelFloat: {
    xs: 'left',
    md: 'left',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const expertTwoColProps2: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 4 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      xl: { span: 7 },
    },
  },
  labelFloat: {
    xs: 'left',
    md: 'left',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const twoColProps2: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 4 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      xl: { span: 7 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const twoColProps3: LabelRowProps = {
  colProps: {
    label: {
      xs: { span: 7 },
      md: { span: 5 },
      lg: { span: 2 },
      xl: { span: 5 },
    },
    children: {
      xs: { span: 15 },
      md: { span: 7 },
      xl: { span: 8 },
    },
  },
  labelFloat: {
    xs: 'right',
    md: 'right',
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export const verticalColProps: LabelRowProps = {
  colProps: {
    label: {
      span: 24,
    },
    children: {
      span: 24,
      style: {
        marginBottom: 16,
      },
    },
  },
  style: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0,
  },
  labelFloat: 'left',
  type: 'flex',
  align: 'middle',
  gutter: [6, 0],
};

export enum enableState {
  enable = 1,
  disabled = 0,
}

export enum EnumUserStatus {
  /**
   * 已注册
   */
  registered = '5',
  /**
   * 资料填写中
   */
  filling = '10',
  /**
   * 待确认
   */
  submitted = '15',
  /**
   * 确认不通过
   */
  rejected = '20',
  /**
   * 返回修改
   */
  returnForRevision = '25',
  /**
   * 资格确认通过
   */
  approved = '30',
  /**
   * 未推荐晋级行业赛
   */
  notRecommendSemifinal = '40',
  /**
   * 推荐晋级行业赛
   */
  recommendSemifinal = '45',
  /**
   * 未晋级行业赛
   */
  notSemifinal = '50',
  /**
   * 晋级行业赛
   */
  semifinal = '55',
  /**
   * 行业赛回执已上传
   */
  semifinalReceiptUploaded = '59',

  /**
   * 未晋级总决赛
   */
  notFinal = '60',
  /**
   * 晋级总决赛
   */
  final = '65',
  /**
   * 总决赛回执已上传
   */
  finalReceiptUploaded = '70',
}

export function UserStatusFormat(code?: EnumUserStatus) {
  switch (code) {
    case EnumUserStatus.registered:
      return '已注册';
    case EnumUserStatus.filling:
      return '资料填写中';
    case EnumUserStatus.submitted:
      return '待确认';
    case EnumUserStatus.rejected:
      return '确认不通过';
    case EnumUserStatus.returnForRevision:
      return '返回修改';
    case EnumUserStatus.approved:
      return '资格确认通过';
    case EnumUserStatus.notRecommendSemifinal:
      return '未推荐晋级行业赛';
    case EnumUserStatus.recommendSemifinal:
      return '推荐晋级行业赛';
    case EnumUserStatus.semifinal:
      return '晋级行业赛';
    case EnumUserStatus.notSemifinal:
      return '未晋级行业赛';
    case EnumUserStatus.semifinalReceiptUploaded:
      return '行业赛回执已上传';
    case EnumUserStatus.final:
      return '晋级总决赛';
    case EnumUserStatus.notFinal:
      return '未晋级总决赛';
    case EnumUserStatus.finalReceiptUploaded:
      return '总决赛回执已上传';
    default:
      return '';
  }
}

export const GroupOptions = [
  {
    value: 'startup',
    label: '初创企业组',
  },
  {
    value: 'grow_up',
    label: '成长企业组',
  },
];

export function GroupFormat(code?: 'startup' | 'grow_up' | 'team') {
  switch (code) {
    case 'startup':
      return '初创企业组';
    case 'grow_up':
      return '成长企业组';
    case 'team':
      return '团队组';
    default:
      return '';
  }
}

export function ExportStatusFormat(code?: 'TO_BE_CONFIRMED' | 'CONFIRMED') {
  switch (code) {
    case 'TO_BE_CONFIRMED':
      return '待确认';
    case 'CONFIRMED':
      return '已确认';
    default:
      return '';
  }
}

export const ExportStatusOptions = [
  {
    label: '待确认',
    value: 'TO_BE_CONFIRMED',
  },
  {
    label: '已确认',
    value: 'CONFIRMED',
  },
];

export const YesOrNoOptions = [
  {
    label: '是',
    value: true,
  },
  {
    label: '否',
    value: false,
  },
];

export const EnrtyStatusOptions = [
  { label: '资料填写中', value: '10' },
  { label: '待确认', value: '15' },
  { label: '确认不通过', value: '20' },
  { label: '返回修改', value: '25' },
  { label: '资格确认通过', value: '30' },
  { label: '未推荐晋级行业赛', value: '40' },
  { label: '推荐晋级行业赛', value: '45' },
  { label: '未晋级行业赛', value: '50' },
  { label: '晋级行业赛', value: '55' },
  { label: '行业赛回执已上传', value: '59' },
  { label: '未晋级总决赛', value: '60' },
  { label: '晋级总决赛', value: '65' },
  { label: '总决赛回执已上传', value: '70' },
];

export const StatisEnrtyStatusOptions = [
  { label: '已注册', value: '5' },
  { label: '资料填写中', value: '10' },
  { label: '待确认', value: '15' },
  { label: '确认不通过', value: '20' },
  { label: '返回修改', value: '25' },
  { label: '资格确认通过', value: '30' },
  { label: '未推荐晋级行业赛', value: '40' },
  { label: '推荐晋级行业赛', value: '45' },
  { label: '未晋级行业赛', value: '50' },
  { label: '晋级行业赛', value: '55' },
  { label: '行业赛回执已上传', value: '59' },
  { label: '未晋级总决赛', value: '60' },
  { label: '晋级总决赛', value: '65' },
  { label: '总决赛回执已上传', value: '70' },
];

export const sysUserTypeOptions = [
  { value: 'OC', label: '大赛组委会' },
  { value: 'TB', label: '地方科技局' },
  { value: 'OVERSEAS_ADMIN', label: '海外赛区管理员' },
  { value: 'COUNTY', label: '区县管理员' },
  { value: 'HIGH_TECH_ZONE', label: '高新区管理员' },
  { value: 'ELECT_DEV_ZONE', label: '经济开发区管理员' },
  { value: 'INCUBATOR', label: '孵化器管理员' },
  { value: 'UNIVERSITY_ST_PARK', label: '大学科技园管理员' },
  { value: 'MAKER_SPACE', label: '众创空间管理员' },
  { value: 'startup', label: '初创企业组' },
  { value: 'grow_up', label: '成长企业组' },
  { value: 'team', label: '团队' },
];

export enum EnumSysUserType {
  大赛组委会 = 'OC',
  地方科技局 = 'TB',
  海外赛区管理员 = 'OVERSEAS_ADMIN',
  区县管理员 = 'COUNTY',
  高新区管理员 = 'HIGH_TECH_ZONE',
  经济开发区管理员 = 'ELECT_DEV_ZONE',
  孵化器管理员 = 'INCUBATOR',
  大学科技园管理员 = 'UNIVERSITY_ST_PARK',
  众创空间管理员 = 'MAKER_SPACE',
  团队 = 'team',
  企业 = 'enterprise',
  专家 = 'expert',
}

export enum EnumSysUserTypeOnlyAdmin {
  大赛组委会 = 'OC',
  地方科技局 = 'TB',
  海外赛区管理员 = 'OVERSEAS_ADMIN',
  区县管理员 = 'COUNTY',
  高新区管理员 = 'HIGH_TECH_ZONE',
  经济开发区管理员 = 'ELECT_DEV_ZONE',
  孵化器管理员 = 'INCUBATOR',
  大学科技园管理员 = 'UNIVERSITY_ST_PARK',
  众创空间管理员 = 'MAKER_SPACE',
}

export const sysUserTypeOptionsOnlyAdmin = [
  { value: 'OC', label: '大赛组委会' },
  { value: 'TB', label: '地方科技局' },
  { value: 'OVERSEAS_ADMIN', label: '海外赛区管理员' },
  { value: 'COUNTY', label: '区县管理员' },
  { value: 'HIGH_TECH_ZONE', label: '高新区管理员' },
  { value: 'ELECT_DEV_ZONE', label: '经济开发区管理员' },
  { value: 'INCUBATOR', label: '孵化器管理员' },
  { value: 'UNIVERSITY_ST_PARK', label: '大学科技园管理员' },
  { value: 'MAKER_SPACE', label: '众创空间管理员' },
];

export function userTypeFormat(code?: string) {
  switch (code) {
    case 'OC':
      return '大赛组委会';
    case 'TB':
      return '地方科技局';
    case 'OVERSEAS_ADMIN':
      return '海外赛区管理员';
    case 'COUNTY':
      return '区县管理员';
    case 'HIGH_TECH_ZONE':
      return '高新区管理员';
    case 'ELECT_DEV_ZONE':
      return '经济开发区管理员';
    case 'INCUBATOR':
      return '孵化器管理员';
    case 'UNIVERSITY_ST_PARK':
      return '大学科技园管理员';
    case 'MAKER_SPACE':
      return '众创空间管理员';
    case 'enterprise':
      return '企业';
    case 'team':
      return '团队';
    case 'startup':
      return '初创企业组';
    case 'grow_up':
      return '成长企业组';
    case 'expert':
      return '专家';
    default:
      return '';
  }
}

export function isOverseas(code?: string) {
  switch (code) {
    case '32-35':
    case '32-34':
    case '32-33':
      return true;
    default:
      return false;
  }
}

export enum EnumProcessStatus {
  '02' = '地方赛',
  '03' = '海外赛',
  '04' = '行业赛',
  '05' = '总决赛',
}

export enum EnumProcess2Index {
  '02',
  '03',
  '04',
  '05',
}

export enum EnumNoticePublishStatus {
  未发布 = 'not_published',
  已发布 = 'published',
}

export enum EnumStatStatus {
  TO_BE_GRADED = '已分配',
  GRADED = '已评分',
  COLLECTED = '已汇总',
}
