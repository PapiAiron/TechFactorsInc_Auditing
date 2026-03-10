import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { Camera, RefreshCw, XCircle, Brain, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import styles from './CameraViewport.module.css';

interface CameraViewportProps {
  onScan: (result: string) => void;
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const CameraViewport: React.FC<CameraViewportProps> = ({ onScan, isActive, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [isActive, facingMode]);

  const startScanner = async () => {
    setError(null);
    try {
      codeReaderRef.current = new BrowserMultiFormatReader();
      const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        throw new Error("No camera found");
      }

      await codeReaderRef.current.decodeFromVideoDevice(
        undefined, 
        videoRef.current!, 
        (result: Result | null) => {
          if (result && !cooldown && !isAnalyzing) {
            handleScanSuccess(result.getText());
          }
        }
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Camera access denied");
      onToggle(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  const handleScanSuccess = (text: string) => {
    setCooldown(true);
    onScan(text);
    
    if (navigator.vibrate) navigator.vibrate(80);
    setTimeout(() => setCooldown(false), 2000);
  };

  const handleSmartScan = async () => {
    if (!videoRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // Capture frame
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0);

      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      // Call Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
            { text: "Extract the asset tag, serial number, or unique identifier from this image. Look for labels, stickers, or engraved text. Return ONLY the identified tag string. If multiple tags are present, return the most prominent one. If no tag is found, return 'NOT_FOUND'." }
          ]
        }
      });

      const resultText = response.text?.trim() || "NOT_FOUND";
      
      if (resultText !== "NOT_FOUND") {
        handleScanSuccess(resultText);
      } else {
        setError("No tag recognized in image. Try getting closer or improving lighting.");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Smart Scan failed:", err);
      setError("AI analysis failed. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        <video ref={videoRef} className={styles.video} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {isActive && (
          <div className={styles.overlay}>
            <div className={styles.corner} />
            <div className={styles.corner} />
            <div className={styles.corner} />
            <div className={styles.corner} />
            <div className={styles.scanLine} />
            {isAnalyzing && (
              <div className={styles.analyzingOverlay}>
                <Loader2 className={styles.spinner} size={48} />
                <p>AI Analyzing...</p>
              </div>
            )}
          </div>
        )}

        {!isActive && !error && (
          <div className={styles.placeholder}>
            <Camera size={48} className={styles.placeholderIcon} />
            <p>Camera is currently inactive</p>
            <button className={styles.startBtn} onClick={() => onToggle(true)}>
              Start Camera
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <XCircle size={48} color="var(--red)" />
            <p>{error}</p>
            <button className={styles.startBtn} onClick={() => onToggle(true)}>
              Retry
            </button>
          </div>
        )}
      </div>

      {isActive && (
        <div className={styles.controls}>
          <button 
            className={`${styles.controlBtn} ${styles.smartBtn}`} 
            onClick={handleSmartScan}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <Loader2 className={styles.spinner} size={18} /> : <Brain size={18} />}
            <span>Smart Scan (AI)</span>
          </button>
          <button className={styles.controlBtn} onClick={toggleFacingMode}>
            <RefreshCw size={18} />
            <span>Flip</span>
          </button>
          <button className={`${styles.controlBtn} ${styles.stopBtn}`} onClick={() => onToggle(false)}>
            <XCircle size={18} />
            <span>Stop</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraViewport;
