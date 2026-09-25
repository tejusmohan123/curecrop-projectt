import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';

interface ImageUploaderProps {
  imageSrc: string | null;
  onImageSelected: (base64: string, mimeType: string, filename?: string) => void;
  onClearImage: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageSrc,
  onImageSelected,
  onClearImage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(false);
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Paste from clipboard listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Cleanup camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access device camera. Please check camera permissions.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.92);
      onImageSelected(base64, 'image/jpeg', 'camera-capture.jpg');
      stopCamera();
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone / Preview Area */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {isCameraActive ? (
          <div className="relative bg-black flex flex-col items-center justify-center min-h-[380px] p-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-h-[420px] object-contain rounded-xl"
            />
            <div className="absolute bottom-6 flex items-center gap-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Capture Specimen
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs rounded-full font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : imageSrc ? (
          <div className="relative bg-stone-950 flex flex-col items-center justify-center overflow-hidden min-h-[360px] max-h-[460px]">
            {/* Specimen Inspection Canvas Container */}
            <div className="relative w-full h-[360px] flex items-center justify-center overflow-hidden select-none">
              <img
                src={imageSrc}
                alt="Selected crop specimen"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: highContrastMode ? 'contrast(1.4) saturate(1.3)' : 'none',
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out"
              />

              {/* Crosshair Inspection Grid Overlay */}
              {showCrosshairs && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-[1px] bg-emerald-400/40 border-t border-dashed border-emerald-400/60" />
                  <div className="h-full w-[1px] bg-emerald-400/40 border-l border-dashed border-emerald-400/60 absolute" />
                  <div className="w-32 h-32 border border-emerald-400/70 rounded-full absolute flex items-center justify-center">
                    <span className="text-[10px] font-mono text-emerald-300 bg-stone-900/80 px-1 py-0.5 rounded">
                      LESION FOCUS
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Specimen Inspection Toolbar */}
            <div className="w-full bg-stone-900/95 border-t border-stone-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-stone-300 gap-2 z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-400 font-mono">SPECIMEN INSPECTOR</span>
                <span className="text-stone-600">·</span>
                <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 rounded hover:bg-stone-800 text-stone-300 disabled:opacity-30 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  disabled={zoomLevel >= 3}
                  className="p-1.5 rounded hover:bg-stone-800 text-stone-300 disabled:opacity-30 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded hover:bg-stone-800 text-stone-300 cursor-pointer"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-stone-700 mx-1" />

                <button
                  type="button"
                  onClick={() => setShowCrosshairs(!showCrosshairs)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    showCrosshairs
                      ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/50'
                      : 'hover:bg-stone-800 text-stone-400'
                  }`}
                  title="Toggle target crosshair"
                >
                  Grid Focus
                </button>

                <button
                  type="button"
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    highContrastMode
                      ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/50'
                      : 'hover:bg-stone-800 text-stone-400'
                  }`}
                  title="Enhance lesion vein contrast"
                >
                  Vein Contrast
                </button>

                <div className="w-[1px] h-4 bg-stone-700 mx-1" />

                <button
                  type="button"
                  onClick={onClearImage}
                  className="p-1.5 rounded hover:bg-red-950/60 text-red-400 cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors border-2 border-dashed ${
              isDragging
                ? 'border-emerald-600 bg-emerald-50/50'
                : 'border-stone-300 hover:border-emerald-500 bg-stone-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-base font-semibold text-stone-900 mb-1">
              Upload Crop Specimen or Leaf Photo
            </h3>
            <p className="text-xs text-stone-500 max-w-md mb-4">
              Drag and drop high-resolution foliage imagery, paste from clipboard (<kbd className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px] font-mono">Ctrl+V</kbd>), or capture using your camera. The AI will automatically detect the crop species and diagnose any disease.
            </p>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Browse File
              </button>

              <button
                type="button"
                onClick={startCamera}
                className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                Use Camera
              </button>
            </div>

            {cameraError && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
                {cameraError}
              </p>
            )}

            <div className="mt-4 flex flex-col items-center gap-1.5 text-[11px] text-stone-400">
              <span>Supports JPEG, PNG, WEBP up to 25MB · Macroscopic foliage detail yields optimal diagnosis</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium text-[10px]">
                🛡️ AI Botanical Guard: Automatically differentiates plant foliage from random non-plant objects
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
