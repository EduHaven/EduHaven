import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import './QRCode.css';

const QRCode = ({ url, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Simple QR code generation using Google Charts API
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(url)}`;

  const downloadQRCode = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wishlist-qr-code.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="qr-code-overlay" onClick={onClose}>
      <div className="qr-code-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-code-header">
          <h3>📱 Scan to Share</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="qr-code-content">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className="qr-code-image"
          />
          <p className="qr-code-description">
            Scan this QR code with your phone to open the shared wishlist
          </p>
          
          <div className="qr-code-actions">
            <button 
              className="download-btn"
              onClick={downloadQRCode}
              disabled={isDownloading}
            >
              <Download size={16} />
              {isDownloading ? 'Downloading...' : 'Download QR Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCode; 