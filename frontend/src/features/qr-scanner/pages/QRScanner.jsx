import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';

const QRScanner = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [UNUSED_cameraId, setCameraId] = useState(null);

  const parseQRData = (qrText) => {
    try {
      // The QR data format from the image:
      // Name: Ashinifarmer
      // NIC: 200281600688
      // Contact: 0761602451
      // Location: Nuwara Eliya
      // Area: 2
      // Crops: Naadu (RED)

      const lines = qrText.split('\n');
      const data = {};

      lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        
        if (key && value) {
          const normalizedKey = key.trim().toLowerCase();
          data[normalizedKey] = value;
        }
      });

      // Map to expected format
      return {
        name: data.name || '',
        nic: data.nic || '',
        contact: data.contact || '',
        location: data.location || '',
        area: data.area || '',
        crops: data.crops || '',
        rawData: qrText
      };
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  };

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  }, [scanning]);

  const handleScanSuccess = useCallback(async (qrData) => {
    try {
      const farmerData = parseQRData(qrData);
      
      if (farmerData) {
        toast.success('✅ Farmer details scanned successfully!');
        await stopScanner();
        onScanSuccess(farmerData);
        onClose();
      } else {
        toast.error('Invalid QR code format');
      }
    } catch (error) {
      console.error('Error processing QR data:', error);
      toast.error('Failed to process QR code');
    }
  }, [stopScanner, onScanSuccess, onClose]);

  const startScanner = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      
      if (devices && devices.length > 0) {
        const cameraToUse = devices[devices.length - 1];
        setCameraId(cameraToUse.id);
        
        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          cameraToUse.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          () => {
            // Error callback - can be ignored
          }
        );
        
        setScanning(true);
      } else {
        toast.error('No cameras found on this device');
        onClose();
      }
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast.error('Failed to start camera. Please allow camera access.');
      onClose();
    }
  }, [handleScanSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen, startScanner, stopScanner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Scan Farmer QR Code</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Container */}
        <div className="p-6">
          <div className="relative">
            <div
              id="qr-reader"
              className="rounded-xl overflow-hidden border-4 border-emerald-200"
              style={{ width: '100%' }}
            />
            
            {scanning && (
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600">
                <div className="animate-pulse">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="font-medium">Scanning... Point camera at QR code</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📱 Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Allow camera access when prompted</li>
                <li>Hold the QR code steady within the frame</li>
                <li>Ensure good lighting conditions</li>
                <li>The scan will happen automatically</li>
              </ul>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
