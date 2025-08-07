import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Download, Play, Pause, GripVertical } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface GemstoneGalleryProps {
  images: string[];
  videos: string[];
  name: string;
  onMediaReorder?: (reorderedMedia: { images: string[]; videos: string[] }) => void;
}

const ItemTypes = {
  THUMBNAIL: 'thumbnail',
};

interface DraggableThumbnailProps {
  item: MediaItem;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
  isActive: boolean;
}

const DraggableThumbnail: React.FC<DraggableThumbnailProps> = ({ item, index, moveItem, onClick, isActive }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.THUMBNAIL,
    hover(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.THUMBNAIL,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={preview}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`relative cursor-pointer ${isActive ? 'ring-2 ring-primary-500' : ''}`}
      onClick={onClick}
    >
      <div ref={ref} className="relative">
        {item.type === 'video' ? (
          <div className="w-16 h-16 rounded-md bg-neutral-200 flex items-center justify-center relative">
            <Play className="h-6 w-6 text-neutral-500" />
            <span className="absolute bottom-0 right-0 bg-primary-600 text-white text-xs px-1 rounded-tl-md">
              Video
            </span>
          </div>
        ) : (
          <img src={item.url} alt={`${name} thumbnail ${index + 1}`} className="gallery-thumbnail" />
        )}
        <div className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl-md cursor-grab">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

const GemstoneGallery: React.FC<GemstoneGalleryProps> = ({ images, videos, name, onMediaReorder }) => {
  const initialMedia: MediaItem[] = [
    ...images.map((url): MediaItem => ({ type: 'image', url })),
    ...videos.map((url): MediaItem => ({ type: 'video', url })),
  ];

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentItem = mediaItems[currentIndex];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  const handleThumbnailClick = (index: number) => setCurrentIndex(index);
  const toggleFullScreen = () => setShowFullScreen(!showFullScreen);

  const toggleVideoPlay = () => {
    const videoElement = document.getElementById(`gallery-video-${currentIndex}`) as HTMLVideoElement;
    if (videoElement) {
      if (isVideoPlaying) videoElement.pause();
      else videoElement.play();
    }
  };

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = mediaItems[dragIndex];
    const newMediaItems = [...mediaItems];
    newMediaItems.splice(dragIndex, 1);
    newMediaItems.splice(hoverIndex, 0, draggedItem);
    setMediaItems(newMediaItems);
    if (onMediaReorder) {
      const reorderedImages = newMediaItems.filter(item => item.type === 'image').map(item => item.url);
      const reorderedVideos = newMediaItems.filter(item => item.type === 'video').map(item => item.url);
      onMediaReorder({ images: reorderedImages, videos: reorderedVideos });
    }
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gallery-container">
        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[16/9] bg-neutral-100 overflow-hidden rounded-lg" onClick={toggleFullScreen}>
          {currentItem.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <video
                id={`gallery-video-${currentIndex}`}
                src={currentItem.url}
                controls={false}
                className="max-h-full max-w-full object-contain"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onClick={(e) => { e.stopPropagation(); toggleVideoPlay(); }}
              />
              {!isVideoPlaying && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVideoPlay(); }}
                  className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full text-white"
                >
                  <Play className="h-8 w-8" />
                </button>
              )}
            </div>
          ) : (
            <img src={currentItem.url} alt={`${name} - image ${currentIndex + 1}`} className="w-full h-full object-contain" />
          )}
        </div>

        {mediaItems.length > 1 && (
          <div className="gallery-thumbnails">
            {mediaItems.map((item, index) => (
              <DraggableThumbnail
                key={item.url}
                item={item}
                index={index}
                moveItem={moveItem}
                onClick={() => handleThumbnailClick(index)}
                isActive={currentIndex === index}
              />
            ))}
          </div>
        )}

        {showFullScreen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-8">
            <button onClick={toggleFullScreen} className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full">
              <X className="h-6 w-6" />
            </button>
            <div className="w-full max-w-6xl max-h-[90vh]">
              {currentItem.type === 'video' ? (
                <video src={currentItem.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={currentItem.url} alt={`${name} - fullscreen`} className="max-h-[80vh] max-w-full mx-auto object-contain" />
              )}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default GemstoneGallery;