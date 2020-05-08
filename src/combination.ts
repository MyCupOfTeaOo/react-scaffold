import { loadDict } from './service/config';

/** 通用字典
 * example
 * export const loadCurrency = loadDict('xxxx');
 */

// 字典类型
export const loadDictType = loadDict('dictType');
// 级联字典类型
export const loadCascadeType = loadDict('cascadeType');

/** 级联字典
 * example
 * export const loadAdmdiv = loadChildDict('xxxx');
 */

/** 一次性加载的级联字典
 * example
 * eample export const loadAllContestProfession = loadAllDict('contestProfession');
 */
