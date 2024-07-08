import { useCallback } from 'react';
import appConfig from '../../app-config.json';
import { HeaderType } from '../models';
import useStore from '../store';

const useSetHeader = () => {
  const { setHeader } = useStore((state) => ({
    setHeader: state.setHeader,
  }));

  return useCallback(
    ({
      route = '',
      hasLeftIcon = true,
      rightIcon = null,
      title = appConfig.app.title,
      customTitle = null,
      type = 'primary',
    }: HeaderType) =>
      setHeader({
        route,
        hasLeftIcon,
        rightIcon,
        title,
        customTitle,
        type,
      }),
    [setHeader]
  );
};

export default useSetHeader;
