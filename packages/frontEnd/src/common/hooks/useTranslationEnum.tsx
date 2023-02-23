import { useTranslation } from 'react-i18next';

export default (keys: string) => {
  const { t } = useTranslation();
  return t(keys);
}