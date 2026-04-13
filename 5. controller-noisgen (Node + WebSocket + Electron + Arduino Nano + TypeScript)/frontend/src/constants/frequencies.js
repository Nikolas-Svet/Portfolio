// @ts-check

/**
 * @typedef {import('../types/config.js').FrequencyPreset} FrequencyPreset
 */

/** @type {ReadonlyArray<FrequencyPreset>} */
export const VERTICAL_FREQUENCIES = [
  { id: '0', label: '433 МГц', group: 'vertical' },
  { id: '1', label: '5,8 ГГц', group: 'vertical' },
  { id: '2', label: '700 МГц', group: 'vertical' },
  { id: '3', label: '1,2 ГГц', group: 'vertical' },
  { id: '4', label: '2,4 ГГц', group: 'vertical' },
  { id: '5', label: '5,2 ГГц', group: 'vertical' },
  { id: '6', label: '1,5 ГГц', group: 'vertical' },
  { id: '7', label: '900 МГц', group: 'vertical' },
];

/** @type {ReadonlyArray<FrequencyPreset>} */
export const HORIZONTAL_FREQUENCIES = [
  { id: '8', label: '433 МГц', group: 'horizontal' },
  { id: '9', label: '5,8 ГГц', group: 'horizontal' },
  { id: '10', label: '700 МГц', group: 'horizontal' },
  { id: '11', label: '1,2 ГГц', group: 'horizontal' },
  { id: '12', label: '2,4 ГГц', group: 'horizontal' },
  { id: '13', label: '5,2 ГГц', group: 'horizontal' },
  { id: '14', label: '1,5 ГГц', group: 'horizontal' },
  { id: '15', label: '900 МГц', group: 'horizontal' },
];

/** @type {ReadonlyArray<FrequencyPreset>} */
export const FREQUENCY_PRESETS = [...VERTICAL_FREQUENCIES, ...HORIZONTAL_FREQUENCIES];

/** @type {ReadonlyArray<FrequencyPreset>} */
export const COMBINED_FREQUENCIES = [...VERTICAL_FREQUENCIES];
