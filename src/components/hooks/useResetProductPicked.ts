import { useCallback } from 'react';
import useStore from '../store';

const useResetProductPicked = () => {
  const { setProductInfoPicked } = useStore((state) => state);
  return useCallback(
    () =>
      setProductInfoPicked({
        productId: -1,
        isUpdate: false,
      }),
    [setProductInfoPicked]
  );
};
export default useResetProductPicked;
