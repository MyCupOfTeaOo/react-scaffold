import { useValue } from 'teaness';
import { useEffect, RefObject } from 'react';

export function useSelectedPath(ref: RefObject<HTMLDivElement>) {
  const selectedPath = useValue<number[]>([]);
  useEffect(() => {
    ref.current?.addEventListener('mouseover', e => {
      const path = (e.target as HTMLDivElement).dataset?.path;
      if (path) {
        const [depthStr, indexStr] = path.split('-');
        const depth = parseInt(depthStr, 10);
        const index = parseInt(indexStr, 10);
        const tp = [...selectedPath.value];
        tp.splice(depth, tp.length - depth);
        tp.push(index);
        selectedPath.setValue(tp);
      }
    });
    ref.current?.addEventListener('mouseleave', () => {
      selectedPath.setValue([]);
    });
  }, []);
  return selectedPath.value;
}
