"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "../ui/button";
import { QrCode } from "lucide-react";

const QrScannerModal = ({ onScanSuccess, onClose }) => {

  const qrScannerRef = useRef(null);
  const [error, setError] = useState("");
  const [scannerReady, setScannerReady] = useState(false);

  useEffect(() => {

    const qrScanner = new Html5Qrcode("qr-scanner-element");
    qrScannerRef.current = qrScanner;
    setScannerReady(true);

    return () => {
      stopScanner();
    };
  }, []);


  useEffect(() => {
    if (!scannerReady || !qrScannerRef.current) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    };


    Html5Qrcode.getCameras()
      .then(cameras => {
        const backCamera = cameras.find(camera =>
          camera.label.toLowerCase().includes('back') ||
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        );


        const cameraId = backCamera ? backCamera.id : (cameras.length > 0 ? cameras[0].id : null);

        if (!cameraId) {
          setError("No camera found on your device.");
          return;
        }

        return qrScannerRef.current.start(
          cameraId,
          config,
          (decodedText) => {

            console.log("QR code detected:", decodedText);

            stopScanner(() => {

              try {
                const parsedData = JSON.parse(decodedText);
                onScanSuccess(parsedData);
              } catch (error) {
                onScanSuccess(decodedText);
              }
            });
          },
          () => { }
        );
      })
      .catch(err => {
        setError(`Camera access error: ${err.message || err}`);
        console.error("Camera access error:", err);
      });
  }, [scannerReady]);

  const stopScanner = (callback) => {
    const scanner = qrScannerRef.current;
    if (scanner && scanner.isScanning) {
      scanner
        .stop()
        .then(() => {
          console.log("QR scanner stopped successfully");
          if (callback) callback();
        })
        .catch((err) => {
          console.error("Error stopping QR scanner:", err);
          if (callback) callback();
        });
    } else if (callback) {
      callback();
    }
  };

  const handleClose = () => {
    stopScanner(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Scan QR Code</h2>

        {error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : null}

        <p className="text-center text-sm text-gray-500 mb-4">
          Position the QR code within the frame
        </p>

        <div
          id="qr-scanner-element"
          className="w-full h-64 border border-gray-300 rounded overflow-hidden"
        ></div>
      </div>
    </div>
  );
};


const QrScannerButton = ({ onScanData }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScanSuccess = (data) => {
    setScannedData(data);
    setShowScanner(false);
    if (onScanData) onScanData(data);
  };

  return (
    <div className="flex flex-col items-center">


      <Button
        type="button"
        variant="outline"
        onClick={() => setShowScanner(true)}
        className="flex-1"
        suppressHydrationWarning
      >
        <QrCode className="mr-2 h-4 w-4" /> Scan QR
      </Button>

      {showScanner && (
        <QrScannerModal
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default QrScannerButton;