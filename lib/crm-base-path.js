/**
 * Базовый путь CRM: на основном сайте — /crm, на car-service-nikol-crm.vercel.app — ''.
 * В Vercel для проекта car-service-nikol-crm задайте: NEXT_PUBLIC_CRM_BASE_PATH = (пустое значение)
 */
export const CRM_BASE_PATH =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CRM_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_CRM_BASE_PATH
    : '/crm';
