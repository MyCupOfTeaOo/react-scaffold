import { useValue } from 'teaness';
import { useEffect, RefObject } from 'react';

export function useSelectedPath(ref: RefObject<HTMLDivElement>) {
  const selectedPath = useValue<number[]>([]);
  const altPress = useValue(false);
  useEffect(() => {
    function mouseover(e: Event) {
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
    }
    function mouseleave() {
      selectedPath.setValue([]);
    }
    function keydown(e: KeyboardEvent) {
      if (e.key === 'Alt') {
        altPress.value = true;
      }
    }
    function keyup(e: KeyboardEvent) {
      if (e.key === 'Alt') {
        altPress.value = false;
      }
    }

    ref.current?.addEventListener('mouseover', mouseover);
    ref.current?.addEventListener('mouseleave', mouseleave);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    return () => {
      ref.current?.removeEventListener('mouseover', mouseover);
      ref.current?.removeEventListener('mouseleave', mouseleave);
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, []);
  return {
    selectedPath,
    altPress,
  };
}
