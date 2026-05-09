import React,{useState} from "react";

type VideoPreviewProps = {
  url: string;
  title?: string;
  className?: string;
};

export const VideoPreview: React.FC<VideoPreviewProps> = ({ url, title = "Video", className = "" }) => {
    const [open, setOpen] = useState(false);

    const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|embed\/))([^?&]+)/i
    );
    return match ? match[1] : null;
  };
  
  const youtubeId = getYouTubeId(url);
  console.log("VIDEO URL:", url);
    console.log("VIDEO ID:", youtubeId);

  const thumbnail = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : "";

    return (
    <>
      {/* Thumbnail */}
        <div
            className={`relative cursor-pointer group ${className}`}
            onClick={() => setOpen(true)}>
            <img
            src={thumbnail}
            alt={title}
            className="w-full aspect-video object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 text-white rounded-full p-3 text-xl">
                ▶
            </div>
            </div>
        </div>

        {/* Modal */}
        {open && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setOpen(false)}>
                <div
                className="w-full max-w-4xl aspect-video"
                onClick={(e) => e.stopPropagation()}>
                {youtubeId && (
                <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                    title={title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
                )}
                </div>
            </div>
        )}
            
        
    </>
    )



}