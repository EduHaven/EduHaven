import { useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog } from "@headlessui/react";
import { X, RotateCw, Check } from "lucide-react";
import { getCroppedWebpFile } from "@/utils/imageUtils";
import { Button } from "@/components/ui/button";

export const CropModal = ({ isOpen, onClose, imageSrc, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImageFile = await getCroppedWebpFile(
      imageSrc,
      croppedAreaPixels,
      rotation
    );
    onCropDone(croppedImageFile);
    onClose();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-[var(--bg-primary)] rounded-xl shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <Dialog.Title className="text-lg font-medium text-[var(--txt)]">
              Crop Image
            </Dialog.Title>
            <Button
              onClick={onClose}
              variant="transparent"
              size="icon"
              className="hover:bg-[var(--bg-sec)]"
            >
              <X className="w-5 h-5 text-[var(--txt-dim)]" />
            </Button>
          </div>

          <div className="relative h-80 bg-[var(--bg-sec)]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>

          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--txt-dim)]">Zoom:</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 accent-[var(--btn)]"
                />
                <span className="text-sm text-[var(--txt)] w-10">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <Button
                onClick={handleRotate}
                variant="secondary"
                size="icon"
                className="hover:bg-[var(--btn)] hover:text-white"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="transparent"
                className="flex-1 py-2 px-4 rounded-md bg-[var(--bg-sec)] hover:bg-[var(--bg-sec)] font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="default"
                className="flex-1 py-2 px-4 rounded-md font-medium flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" />
                Apply
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
