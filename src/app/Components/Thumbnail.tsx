"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ZoomIn } from "lucide-react";

interface ThumbnailProps {
  url: string | null | undefined;
  alt?: string;
  className?: string;
}

const Thumbnail = ({ url, alt = "", className = "" }: ThumbnailProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`relative group overflow-hidden rounded-lg  cursor-pointer transition-all  ${className}`}>
      
          {isLoading && (
            <Skeleton className="absolute inset-0 rounded-md" />
          )}
          
         
          <img 
            src={url}
            alt={alt}
            className={`object-cover max-w-[360px] rounded-md transition-opacity ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          
        
          
          {/* Zoom indicator
          <div className="absolute bottom-3 right-3 p-2 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <ZoomIn className="h-4 w-4 text-foreground" />
          </div> */}
        </div>
      </DialogTrigger>

      
      <DialogContent className="max-w-[800px]  p-0 bg-transparent border-none">
        
          <img 
            src={url}
            alt={alt}
            className="object-cover  size-full rounded-md"
          />
       
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;