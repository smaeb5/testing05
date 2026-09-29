import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Image, Video, X, Sparkles, AlertCircle } from 'lucide-react';
import { MediaAttachment } from '../types';

interface VoiceAndMediaUploaderProps {
  onAppendText: (text: string) => void;
  attachment: MediaAttachment | null;
  onSetAttachment: (att: MediaAttachment | null) => void;
}

// Check speech recognition support
// declare webkitSpeechRecognition
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const VoiceAndMediaUploader: React.FC<VoiceAndMediaUploaderProps> = ({
  onAppendText,
  attachment,
  onSetAttachment,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isUrduMode, setIsUrduMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recog = new SpeechRecognitionConstructor();
      recog.continuous = true;
      recog.interimResults = false;
      recog.lang = isUrduMode ? 'ur-PK' : 'en-US';

      recog.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recog.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onAppendText(transcript.trim());
        }
      };

      recog.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        if (e.error === 'not-allowed') {
          setSpeechError('Microphone access was blocked. Please enable permissions.');
        } else if (e.error === 'no-speech') {
          // just idle
        } else {
          setSpeechError(`Voice input: ${e.error}`);
        }
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recog;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [isUrduMode, onAppendText]);

  const toggleVoiceInput = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      setSpeechError('Voice typing is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      try {
        recog.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      recog.lang = isUrduMode ? 'ur-PK' : 'en-US';
      try {
        recog.start();
      } catch (err) {
        console.warn('Failed to start voice recog:', err);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 20MB
    if (file.size > 20 * 1024 * 1024) {
      setSpeechError('File is too large. Please select an image or short clip under 20MB.');
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setSpeechError('Please upload an image (JPG/PNG) or short video clip (MP4/MOV).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      onSetAttachment({
        type: isVideo ? 'video' : 'image',
        url: dataUrl,
        fileName: file.name,
        fileSize: file.size,
      });
      setSpeechError(null);
    };
    reader.readAsDataURL(file);

    // reset input value so re-upload of same file triggers change
    e.target.value = '';
  };

  const removeAttachment = () => {
    onSetAttachment(null);
  };

  return (
    <div className="mt-2 space-y-2.5">
      {/* Controls Bar: Voice Typing Button + Media Upload Button + Language Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80">
        <div className="flex items-center gap-2">
          {/* Voice Typing Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                : 'bg-white dark:bg-stone-700 hover:bg-stone-50 dark:hover:bg-stone-650 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600'
            }`}
            title="Bol kar type karein (Voice typing)"
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-white animate-spin" />
                <span>Listening... (Bolain)</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-red-700 dark:text-amber-400" />
                <span>Voice Type (بولیں)</span>
              </>
            )}
          </button>

          {/* Language Toggle for Voice: Urdu vs English */}
          <button
            type="button"
            onClick={() => setIsUrduMode((prev) => !prev)}
            className="px-2 py-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 bg-stone-200/70 dark:bg-stone-750 rounded border border-stone-300 dark:border-stone-600 cursor-pointer"
            title="Switch speech language"
          >
            {isUrduMode ? 'Urdu (ur-PK)' : 'English (en-US)'}
          </button>
        </div>

        {/* Media Attach Button (Photo / Short Reel / Clip) */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-stone-700 hover:bg-stone-50 dark:hover:bg-stone-650 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Attach a photo, problem picture, or short video reel"
          >
            <Image className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <Video className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Attach Photo / Reel</span>
          </button>
        </div>
      </div>

      {/* Speech / File Notice or Error */}
      {speechError && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-900">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{speechError}</span>
        </p>
      )}

      {/* Attached Media Preview Box */}
      {attachment && (
        <div className="relative p-3 rounded-xl bg-amber-50/70 dark:bg-stone-800/90 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {attachment.type === 'image' ? (
              <img
                src={attachment.url}
                alt="Complaint Proof"
                className="w-12 h-12 object-cover rounded-lg border border-amber-400/80 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-red-900 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400 shadow-sm">
                <Video className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 block">
                Attached {attachment.type === 'image' ? 'Photograph' : 'Video Reel / Clip'}
              </span>
              <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate">
                {attachment.fileName}
              </p>
              <span className="text-[10px] text-stone-500 font-mono">
                {(attachment.fileSize / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={removeAttachment}
            className="p-1.5 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
