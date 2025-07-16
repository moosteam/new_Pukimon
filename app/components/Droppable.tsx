import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props: {
  children: React.ReactNode;
  id?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id || 'droppable',
  });

  return (
    <div
      ref={setNodeRef}
      className={
        `rounded-lg m-2 transition-all duration-300 ease-in-out ${isOver && `droppable-glow`}`
      }
    >
      {props.children}
    </div>
  );
}
