"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { GripVertical } from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// Tipos
type Project = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

interface SortableProjectItemProps {
  project: Project;
  isDragOverlay?: boolean;
}

// Componente del proyecto sorteable
const SortableProjectItem = ({
  project,
  isDragOverlay = false,
}: SortableProjectItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? "opacity-50" : ""}
        ${isDragOverlay ? "opacity-100 rotate-3 scale-105" : ""}
      `}
    >
      <ProjectCard
        project={project}
        dragHandleProps={isDragOverlay ? {} : { ...attributes, ...listeners }}
        isDragOverlay={isDragOverlay}
      />
    </div>
  );
};

// Componente de la tarjeta del proyecto
interface ProjectCardProps {
  project: Project;
  dragHandleProps?: any;
  isDragOverlay?: boolean;
}

const ProjectCard = ({
  project,
  dragHandleProps = {},
  isDragOverlay = false,
}: ProjectCardProps) => {
  return (
    <Button
      variant="outline"
      className={`
        font-normal h-auto justify-start w-full text-start p-4 group
        hover:bg-gray-50 dark:hover:bg-gray-800
        ${isDragOverlay ? "shadow-lg border-2 border-blue-500" : ""}
      `}
      asChild
    >
      <Link href={`/projects/${project.id}`} className="relative">
        <div className="flex items-center gap-x-4 w-full">
          <div className="flex items-center gap-x-2">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 -m-1 touch-none"
              onClick={(e) => e.preventDefault()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <Image
              src="/logo.svg"
              alt="telos"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="truncate font-medium">{project.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(project.updatedAt, {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </Link>
    </Button>
  );
};

// Componente principal
export const ProjectList = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

  const [projectOrder, setProjectOrder] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Configuración de sensores optimizada
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoización del orden de proyectos
  const orderedProjects = useMemo(() => {
    if (!projects?.length) return [];

    if (projectOrder.length === 0) {
      return projects;
    }

    return projectOrder
      .map((id) => projects.find((p) => p.id === id))
      .filter((p): p is Project => p !== undefined);
  }, [projects, projectOrder]);

  // Proyecto activo para el drag overlay
  const activeProject = useMemo(() => {
    if (!activeId) return null;
    return orderedProjects.find((p) => p.id === activeId) || null;
  }, [activeId, orderedProjects]);

  // Handlers de drag optimizados
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const currentOrder =
          projectOrder.length > 0
            ? projectOrder
            : projects?.map((p) => p.id) || [];

        const oldIndex = currentOrder.indexOf(active.id as string);
        const newIndex = currentOrder.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
          setProjectOrder(newOrder);
        }
      }

      setActiveId(null);
    },
    [projects, projectOrder]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-2xl font-semibold">Old Vibes</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {orderedProjects.length === 0 && (
            <div className="col-span-full text-center">
              <p className="text-sm text-muted-foreground">No Projects Found</p>
            </div>
          )}

          <SortableContext
            items={orderedProjects.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            {orderedProjects.map((project) => (
              <SortableProjectItem key={project.id} project={project} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeProject && (
            <SortableProjectItem project={activeProject} isDragOverlay />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
