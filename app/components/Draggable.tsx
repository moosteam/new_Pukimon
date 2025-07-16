import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function Draggable(props: {
  children: React.ReactNode;
  id: string;
  imgLink: string;
  isReversed?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      imgLink: props.imgLink
    },
  });

  // isReversed가 true면 x, y 좌표를 반전시킵니다.
  const adjustedX = transform ? (props.isReversed ? -transform.x : transform.x) : 0;
  const adjustedY = transform ? (props.isReversed ? -transform.y : transform.y) : 0;

  const style = transform
    ? {
      transform: `translate3d(${adjustedX}px, ${adjustedY}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-manipulation"
    >
      {props.children}
    </div>
  );
}
