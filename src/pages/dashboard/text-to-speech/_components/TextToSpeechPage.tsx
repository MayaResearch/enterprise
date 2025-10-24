import React, { useState, useEffect, useRef } from 'react';
import { VoicePicker, type Voice } from '@/components/ui/voice-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type CodeTab = 'python' | 'javascript' | 'curl';
type ContentTab = 'generate' | 'similar';

interface PublicVoice {
  id: string;
  voiceId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  previewUrl: string | null;
  isPublic: boolean;
  voiceDescription: string | null;
  voiceText: string | null;
  createdAt: string | Date;
}

const voices: Voice[] = [
  {
    voiceId: "Ava",
    name: "Ava",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "casual",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "conversational",
    },
    description: "Matter-of-fact, personable woman. Great for conversational use cases.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/b4928a68-c03b-411f-8533-3d5c299fd451.mp3",
  },
  {
    voiceId: "Emma",
    name: "Emma",
    category: "premade",
    labels: {
      accent: "british",
      descriptive: "clear",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "narration",
    },
    description: "Clear, articulate voice perfect for narration and audiobooks.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/29vD33N1CtxCmqQRPOHJ/b99fc51d-12d3-4312-b480-a8a45a7d51ef.mp3",
  },
  {
    voiceId: "James",
    name: "James",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "intense",
      age: "middle_aged",
      gender: "male",
      language: "en",
      use_case: "characters_animation",
    },
    description: "Intense, energetic male voice. Great for character use-cases.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3",
  },
  {
    voiceId: "Oliver",
    name: "Oliver",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "professional",
      age: "middle_aged",
      gender: "male",
      language: "en",
      use_case: "news",
    },
    description: "Professional, authoritative voice for news and announcements.",
  },
  {
    voiceId: "Sophia",
    name: "Sophia",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "warm",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "conversational",
    },
    description: "Warm, friendly voice perfect for customer service.",
  },
  {
    voiceId: "Liam",
    name: "Liam",
    category: "premade",
    labels: {
      accent: "british",
      descriptive: "sophisticated",
      age: "middle_aged",
      gender: "male",
      language: "en",
      use_case: "narration",
    },
    description: "Sophisticated British accent for premium content.",
  },
  {
    voiceId: "Isabella",
    name: "Isabella",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "energetic",
      age: "young",
      gender: "female",
      language: "en",
      use_case: "advertisement",
    },
    description: "Energetic and enthusiastic for advertisements.",
  },
  {
    voiceId: "Noah",
    name: "Noah",
    category: "premade",
    labels: {
      accent: "american",
      descriptive: "calm",
      age: "young",
      gender: "male",
      language: "en",
      use_case: "meditation",
    },
    description: "Calm, soothing voice for meditation and relaxation.",
  },
];

const TextToSpeechPage: React.FC = () => {
  const { permissionGranted } = useAuth();
  const hasPermission = permissionGranted;
  
  const [voiceId, setVoiceId] = useState<string>('Ava');
  const [text, setText] = useState<string>('Welcome back to another episode of our podcast! Today we are diving into an absolutely fascinating topic.');
  const [stream, setStream] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('maya_YOUR_API_KEY_HERE');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<CodeTab>('python');
  const [contentTab, setContentTab] = useState<ContentTab>('generate');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/mpeg');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [permissionDeniedOpen, setPermissionDeniedOpen] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [previewPlayingVoiceId, setPreviewPlayingVoiceId] = useState<string | null>(null);
  const previewAudioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Public voices from database
  const [publicVoices, setPublicVoices] = useState<PublicVoice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState<boolean>(false);
  const previewVoiceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch public voices when Voice Library tab is opened
  useEffect(() => {
    if (contentTab === 'similar' && publicVoices.length === 0) {
      fetchPublicVoices();
    }
  }, [contentTab]);

  const fetchPublicVoices = async (): Promise<void> => {
    setIsLoadingVoices(true);
    try {
      const response = await fetch('/api/voices/public');
      if (response.ok) {
        const data = await response.json();
        setPublicVoices(data);
      }
    } catch (error) {
      console.error('Error fetching public voices:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleGenerate = async (): Promise<void> => {
    if (!hasPermission) {
      setPermissionDeniedOpen(true);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOutput('');
    
    // Clean up previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {
        // Ignore errors when pausing
      }
      audioRef.current = null;
    }
    setIsPlaying(false);
    
    try {
      const response = await fetch('https://v3.mayaresearch.ai/v1/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text: text,
          stream: stream,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is audio
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('audio')) {
        // Handle audio response
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        setAudioMimeType(contentType || 'audio/mpeg');
        setOutput('Audio generated successfully! Click play to listen.');
        
        // Create and setup audio
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = () => {
          setError('Error playing audio. Please try again.');
          setIsPlaying(false);
        };
        
        // Auto-play the audio with proper error handling
        try {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.error('Auto-play failed:', error);
                setIsPlaying(false);
                // Audio is ready but didn't auto-play (browser policy)
              });
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        }
      } else {
        // Handle JSON response (for debugging or error messages)
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setAudioUrl(null);
      setAudioBlob(null);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      try {
        audioRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing audio:', error);
      }
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleDownload = (): void => {
    if (!audioBlob) return;
    
    // Determine file extension based on MIME type
    let extension = 'mp3';
    if (audioMimeType.includes('wav')) {
      extension = 'wav';
    } else if (audioMimeType.includes('ogg')) {
      extension = 'ogg';
    } else if (audioMimeType.includes('webm')) {
      extension = 'webm';
    } else if (audioMimeType.includes('aac')) {
      extension = 'aac';
    } else if (audioMimeType.includes('flac')) {
      extension = 'flac';
    }
    
    // Create a new blob with explicit type to ensure proper download
    const blob = new Blob([audioBlob], { type: audioMimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tts-${voiceId}-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the temporary URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Handle preview audio playback
  const handlePreviewPlay = (voice: Voice): void => {
    if (!voice.previewUrl) return;

    // If this voice is already playing, pause it
    if (previewPlayingVoiceId === voice.voiceId) {
      if (previewAudioRef.current) {
        try {
          previewAudioRef.current.pause();
          setPreviewPlayingVoiceId(null);
        } catch (error) {
          console.error('Error pausing preview:', error);
        }
      }
      return;
    }

    // Stop any currently playing preview
    if (previewAudioRef.current) {
      try {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = '';
      } catch (error) {
        console.error('Error stopping previous preview:', error);
      }
    }

    // Create and play new audio
    const audio = new Audio(voice.previewUrl);
    previewAudioRef.current = audio;

    audio.onended = () => {
      setPreviewPlayingVoiceId(null);
    };

    audio.onerror = () => {
      console.error('Error playing preview audio');
      setPreviewPlayingVoiceId(null);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPreviewPlayingVoiceId(voice.voiceId);
        })
        .catch((error) => {
          console.error('Error playing preview:', error);
          setPreviewPlayingVoiceId(null);
        });
    }
  };

  // Handle preview audio playback for PublicVoice
  const handlePublicVoicePreviewPlay = (voice: PublicVoice): void => {
    if (!voice.previewUrl) return;

    if (previewPlayingVoiceId === voice.voiceId) {
      if (previewVoiceAudioRef.current) {
        try {
          previewVoiceAudioRef.current.pause();
          setPreviewPlayingVoiceId(null);
        } catch (error) {
          console.error('Error pausing preview:', error);
        }
      }
      return;
    }

    if (previewVoiceAudioRef.current) {
      try {
        previewVoiceAudioRef.current.pause();
        previewVoiceAudioRef.current.src = '';
      } catch (error) {
        console.error('Error stopping previous preview:', error);
      }
    }

    const audio = new Audio(voice.previewUrl);
    previewVoiceAudioRef.current = audio;

    audio.onended = () => {
      setPreviewPlayingVoiceId(null);
    };

    audio.onerror = () => {
      console.error('Error playing preview audio');
      setPreviewPlayingVoiceId(null);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPreviewPlayingVoiceId(voice.voiceId);
        })
        .catch((error) => {
          console.error('Error playing preview:', error);
          setPreviewPlayingVoiceId(null);
        });
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      if (previewAudioRef.current) {
        try {
          previewAudioRef.current.pause();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [audioUrl]);

  const copyToClipboard = (content: string): void => {
    navigator.clipboard.writeText(content);
  };

  const getPythonCode = (): string => {
    return `from maya_py import Maya

maya = Maya(api_key="${apiKey}")

result = maya.tts_generate(
  voice_id="${voiceId}",
  text="${text}",
  stream=${stream}
)`;
  };

  const getJavaScriptCode = (): string => {
    return `const Maya = require('maya-js');

const maya = new Maya("${apiKey}");

const result = await maya.ttsGenerate({
  voiceId: "${voiceId}",
  text: "${text}",
  stream: ${stream}
});`;
  };

  const getCurlCommand = (): string => {
    return `curl --location 'https://v3.mayaresearch.ai/v1/tts/generate' \\
--header 'Content-Type: application/json' \\
--header 'X-API-Key: ${apiKey}' \\
--data '{
  "voice_id": "${voiceId}",
  "text": "${text}",
  "stream": ${stream}
}'`;
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Side - API Testing */}
      <div className="flex-1 flex flex-col overflow-hidden border-r">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Text to Speech API
              </h1>
              <p className="text-sm text-muted-foreground">
                Convert text to natural-sounding speech using our API
              </p>
            </div>

            {/* Tabs */}
            <div className="flex shrink-0 flex-row items-center justify-between mb-6">
              <div className="flex w-full justify-start gap-3 overflow-x-auto scrollbar-none md:scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setContentTab('generate')}
                  className={`relative isolate flex items-center gap-1 text-base font-medium pb-2 border-b-2 shrink-0 ${
                    contentTab === 'generate' 
                      ? 'border-current opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="leading-none">Generate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab('similar')}
                  className={`relative isolate flex items-center gap-1 text-base font-medium pb-2 border-b-2 shrink-0 ${
                    contentTab === 'similar' 
                      ? 'border-current opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="leading-none">Voice Library</span>
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {contentTab === 'generate' && (
              <>
            {/* Text Input Box */}
            <div className="space-y-2">
              <label htmlFor="text" className="text-sm font-medium">
                Text
              </label>
              <div 
                className="flex flex-col gap-2 w-full rounded-[12px] p-[10px] transition-all duration-100 border border-gray-300 bg-white"
                style={{
                  boxShadow: 'rgba(32, 36, 61, 0.02) 0px 7px 9px 0px, rgba(32, 36, 61, 0.03) 0px 3px 7px 0px, rgba(32, 36, 61, 0.03) 0px 1px 4px 0px',
                  minHeight: '120px'
                }}
              >
                <textarea
                  id="text"
                  placeholder="Enter text to convert to speech"
                  rows={3}
                  className="flex-1 w-full resize-none outline-none border-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
                  style={{ 
                    marginBottom: 0,
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.max(80, e.target.scrollHeight) + 'px';
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // Shuffle/randomize the text (you can implement your shuffle logic here)
                        const words = text.split(' ');
                        const shuffled = words.sort(() => Math.random() - 0.5).join(' ');
                        setText(shuffled);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                        <polyline points="18 2 22 6 18 10" />
                        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                        <polyline points="22 18 18 22 14 18" />
                      </svg>
                      Shuffle
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setText('');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                      >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                      </svg>
                      Clear
                    </button>
                      <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white disabled:bg-gray-400 transition-colors rounded-full"
                        style={{ backgroundColor: isLoading ? undefined : '#262626' }}
                        onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                        onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#262626')}
                      >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                        <path d="M5 3v4"></path>
                        <path d="M19 17v4"></path>
                        <path d="M3 5h4"></path>
                        <path d="M17 19h4"></path>
                      </svg>
                      {isLoading ? 'Running...' : 'Run'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Input - Side by Side */}
            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0" style={{ width: '280px' }}>
                <label htmlFor="api-key" className="text-base font-semibold block">
                  API Key
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Maya API key for authentication
                </p>
              </div>
              <div className="flex-1">
                <div className="flex min-w-0 shrink grow p-1 border border-input rounded-md">
                  <input
                    id="api-key"
                    type="text"
                    placeholder="maya_YOUR_API_KEY_HERE"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="min-w-0 flex-auto shrink grow bg-transparent p-1 text-inherit placeholder:text-muted-foreground focus:outline-none disabled:pointer-events-none font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Voice ID Select - Side by Side */}
            <div className="flex gap-8 items-center">
              <div className="flex-shrink-0" style={{ width: '280px' }}>
                <label htmlFor="voice-id" className="text-base font-semibold block">
                  Voice ID
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a voice for speech synthesis
                </p>
              </div>
              <div className="flex-1">
                <VoicePicker
                  voices={voices}
                  value={voiceId}
                  onValueChange={setVoiceId}
                  placeholder="Select a voice..."
                />
              </div>
            </div>

            {/* Loading State - Circle Loader */}
            {isLoading && (
              <div className="flex items-center justify-center p-12 border border-gray-200 rounded-lg bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Error State - Centered Error Message */}
            {error && !isLoading && (
              <div className="flex items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-red-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Audio Player - Only show when audio is ready */}
            {audioUrl && !isLoading && !error && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Generated Audio</label>
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={handlePlayPause}
                      className="flex items-center justify-center w-12 h-12 rounded-full transition-colors"
                      style={{ backgroundColor: '#262626' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="white"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      title="Download"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                    </button>

                    <div className="flex-1 ml-2">
                      <div className="text-sm text-gray-600">
                        {isPlaying ? 'Playing...' : 'Ready to play'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Voice: {voices.find(v => v.voiceId === voiceId)?.name || voiceId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Output (for non-audio responses - debug only) */}
            {output && !audioUrl && !isLoading && !error && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Debug Output</label>
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 bg-gray-50 border rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                  <code>{output}</code>
                </pre>
              </div>
            )}
              </>
            )}

            {/* Voice Library Tab Content */}
            {contentTab === 'similar' && (
              <div className="grid grid-cols-1 gap-3 pt-4">
                {isLoadingVoices ? (
                  // Loading skeletons
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex min-h-24 flex-row gap-0 rounded-lg border border-gray-200 bg-white p-2">
                      <Skeleton className="size-20 rounded shrink-0 mr-4" />
                      <div className="flex-1 flex flex-col justify-center gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-16 rounded-full" />
                        <Skeleton className="h-9 w-24 rounded-full" />
                      </div>
                    </div>
                  ))
                ) : publicVoices.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">No public voices available yet</p>
                  </div>
                ) : (
                  // Voice cards
                  publicVoices.map((voice) => (
                    <div key={voice.id} className="group/octave-voice-card flex min-h-24 flex-row gap-0 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                      {/* Avatar Section */}
                      <div className="flex h-full shrink-0 items-center py-2.5 pl-2 pr-4">
                        <div className="group/voice-card relative aspect-square shrink-0 rounded size-20 grid place-content-center overflow-hidden bg-gradient-to-b from-blue-300 to-blue-300">
                          {voice.imageUrl && (
                            <img 
                              src={voice.imageUrl} 
                              alt={voice.name} 
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          {voice.previewUrl && (
                            <div className="absolute inset-0 grid place-content-center">
                              <button 
                                className="relative grid size-8 place-content-center rounded-full bg-white/80 text-gray-800 outline-none hover:bg-white/100"
                                onClick={() => handlePublicVoicePreviewPlay(voice)}
                              >
                                {previewPlayingVoiceId === voice.voiceId ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-4"
                                  >
                                    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                                    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="size-4 [&_path]:fill-current"
                                  >
                                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Voice Info */}
                      <div className="flex min-w-0 shrink grow flex-col items-start justify-center gap-1 py-4 pl-0">
                        <div className="flex w-full items-center gap-0">
                          <span className="min-w-0 flex-1 truncate text-base/5 font-medium">
                            {voice.name}
                          </span>
                        </div>
                        <div className="flex w-full items-center gap-0">
                          <span className="min-w-0 flex-1 truncate text-sm/4 font-normal text-gray-600">
                            {voice.description || 'No description'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex shrink-0 flex-row items-center justify-end gap-1 px-4 py-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="box-border inline-flex items-center justify-center gap-1.5 border font-medium cursor-pointer focus:outline-none focus-visible:ring rounded-full grow-0 no-underline h-9 px-4 text-sm leading-4 border-gray-200 bg-transparent hover:bg-gray-100"
                              type="button"
                            >
                              Info
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96" align="end">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-base mb-1">{voice.name}</h4>
                                {voice.description && (
                                  <p className="text-sm text-gray-600 italic">
                                    {voice.description}
                                  </p>
                                )}
                              </div>
                              {voice.voiceDescription && (
                                <div className="pt-2 border-t border-gray-200">
                                  <p className="text-xs font-medium text-gray-700 mb-1.5">
                                    Voice Description
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {voice.voiceDescription}
                                  </p>
                                </div>
                              )}
                              {!voice.voiceDescription && !voice.description && (
                                <p className="text-sm text-muted-foreground">
                                  No description available
                                </p>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <button
                          onClick={() => {
                            setVoiceId(voice.voiceId);
                            setContentTab('generate');
                          }}
                          className="box-border inline-flex items-center justify-center gap-1.5 border font-medium cursor-pointer focus:outline-none focus-visible:ring rounded-full grow-0 no-underline h-9 px-4 text-sm leading-4 border-gray-200 bg-transparent hover:bg-gray-100 shrink-0"
                        >
                          Use Voice
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Code Examples */}
      <div className="w-[32rem] flex flex-col overflow-hidden bg-[#1e1e1e]">
        <div className="flex-1 overflow-auto">
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-800 bg-[#1e1e1e]">
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'python'
                  ? 'text-blue-400 border-blue-400 bg-[#252526]'
                  : 'text-gray-400 hover:text-gray-300 border-transparent'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
              </svg>
              Python
            </button>
            <button
              onClick={() => setActiveTab('javascript')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'javascript'
                  ? 'text-blue-400 border-blue-400 bg-[#252526]'
                  : 'text-gray-400 hover:text-gray-300 border-transparent'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
              </svg>
              Javascript
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'curl'
                  ? 'text-blue-400 border-blue-400 bg-[#252526]'
                  : 'text-gray-400 hover:text-gray-300 border-transparent'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              curl
            </button>
          </div>

          {/* Code Content */}
          <div className="relative bg-[#1e1e1e]">
            {/* Copy button */}
            <button
              onClick={() => {
                if (activeTab === 'python') copyToClipboard(getPythonCode());
                else if (activeTab === 'javascript') copyToClipboard(getJavaScriptCode());
                else copyToClipboard(getCurlCommand());
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded"
              title="Copy code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {activeTab === 'python' && (
              <div className="pb-4">
                {/* Install command */}
                <div className="px-4 pt-4 pb-4">
                  <pre className="m-0 p-4 overflow-auto" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                  }}>
                    <code>pip <span style={{ color: 'rgb(220, 220, 170)' }}>install</span> maya-py</code>
                  </pre>
                </div>

                {/* Code with line numbers */}
                <div className="px-4">
                  <pre className="m-0 p-4 overflow-auto flex" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                    lineHeight: '1.5',
                  }}>
                    <code className="flex">
                      {/* Line numbers */}
                      <span style={{ 
                        minWidth: '2.25em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                        color: 'rgb(106, 153, 85)',
                        display: 'inline-block'
                      }}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                        <div>9</div>
                      </span>
                      {/* Code content */}
                      <span style={{ flex: 1 }}>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>from</span> maya_py <span style={{ color: 'rgb(86, 156, 214)' }}>import</span> Maya</div>
                        <div>&nbsp;</div>
                        <div>maya <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> Maya(api_key <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(206, 145, 120)' }}>"{apiKey}"</span>)</div>
                        <div>&nbsp;</div>
                        <div>result <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> maya.tts_generate(</div>
                        <div>  <span style={{ color: 'rgb(206, 145, 120)' }}>"{text.length > 45 ? text.substring(0, 45) + '...' : text}"</span>,</div>
                        <div>  voice_id<span style={{ color: 'rgb(212, 212, 212)' }}>=</span><span style={{ color: 'rgb(206, 145, 120)' }}>"{voiceId}"</span>,</div>
                        <div>  stream<span style={{ color: 'rgb(212, 212, 212)' }}>=</span><span style={{ color: 'rgb(86, 156, 214)' }}>{stream ? 'True' : 'False'}</span></div>
                        <div>)</div>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'javascript' && (
              <div className="pb-4">
                {/* Install command */}
                <div className="px-4 pt-4 pb-4">
                  <pre className="m-0 p-4 overflow-auto" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                  }}>
                    <code>npm <span style={{ color: 'rgb(220, 220, 170)' }}>install</span> maya-js</code>
                  </pre>
                </div>

                {/* Code with line numbers */}
                <div className="px-4">
                  <pre className="m-0 p-4 overflow-auto flex" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                    lineHeight: '1.5',
                  }}>
                    <code className="flex">
                      {/* Line numbers */}
                      <span style={{ 
                        minWidth: '2.25em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                        color: 'rgb(106, 153, 85)',
                        display: 'inline-block'
                      }}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                        <div>9</div>
                      </span>
                      {/* Code content */}
                      <span style={{ flex: 1 }}>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>const</span> Maya <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(220, 220, 170)' }}>require</span>(<span style={{ color: 'rgb(206, 145, 120)' }}>'maya-js'</span>);</div>
                        <div>&nbsp;</div>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>const</span> maya <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(86, 156, 214)' }}>new</span> Maya(<span style={{ color: 'rgb(206, 145, 120)' }}>"{apiKey}"</span>);</div>
                        <div>&nbsp;</div>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>const</span> result <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(86, 156, 214)' }}>await</span> maya.ttsGenerate({"{"}</div>
                        <div>  text: <span style={{ color: 'rgb(206, 145, 120)' }}>"{text.length > 40 ? text.substring(0, 40) + '...' : text}"</span>,</div>
                        <div>  voiceId: <span style={{ color: 'rgb(206, 145, 120)' }}>"{voiceId}"</span>,</div>
                        <div>  stream: <span style={{ color: 'rgb(86, 156, 214)' }}>{stream.toString()}</span></div>
                        <div>{"}"});</div>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'curl' && (
              <div className="pb-4">
                {/* Code */}
                <div className="px-4 pt-4">
                  <pre className="m-0 p-4 overflow-auto flex" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                    lineHeight: '1.5',
                  }}>
                    <code className="flex">
                      {/* Line numbers */}
                      <span style={{ 
                        minWidth: '2.25em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                        color: 'rgb(106, 153, 85)',
                        display: 'inline-block'
                      }}>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div>8</div>
                      </span>
                      {/* Code content */}
                      <span style={{ flex: 1 }}>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>curl</span> <span style={{ color: 'rgb(220, 220, 170)' }}>--location</span> <span style={{ color: 'rgb(206, 145, 120)' }}>'https://v3.mayaresearch.ai/v1/tts/generate'</span> \</div>
                        <div><span style={{ color: 'rgb(220, 220, 170)' }}>--header</span> <span style={{ color: 'rgb(206, 145, 120)' }}>'Content-Type: application/json'</span> \</div>
                        <div><span style={{ color: 'rgb(220, 220, 170)' }}>--header</span> <span style={{ color: 'rgb(206, 145, 120)' }}>'X-API-Key: {apiKey}'</span> \</div>
                        <div><span style={{ color: 'rgb(220, 220, 170)' }}>--data</span> <span style={{ color: 'rgb(206, 145, 120)' }}>'{"{"}</span></div>
                        <div><span style={{ color: 'rgb(206, 145, 120)' }}>  "voice_id": "{voiceId}",</span></div>
                        <div><span style={{ color: 'rgb(206, 145, 120)' }}>  "text": "{text.length > 35 ? text.substring(0, 35) + '...' : text}",</span></div>
                        <div><span style={{ color: 'rgb(206, 145, 120)' }}>  "stream": {stream.toString()}</span></div>
                        <div><span style={{ color: 'rgb(206, 145, 120)' }}>{"}'}"}</span></div>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permission Denied Dialog */}
      <Dialog open={permissionDeniedOpen} onOpenChange={setPermissionDeniedOpen}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
              Permission Required
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You don't have permission to access this platform feature.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Access Restricted
                  </p>
                  <p className="text-sm text-amber-800">
                    Please contact the Maya team to request platform access. Once granted, you'll be able to generate speech and use all platform features.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setPermissionDeniedOpen(false)}
              className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 h-9 px-4 rounded-full inline-flex border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href="mailto:support@mayaresearch.ai?subject=Platform Access Request"
              className="relative items-center justify-center whitespace-nowrap text-sm font-medium transition-colors duration-75 text-white h-9 px-4 rounded-full inline-flex"
              style={{ backgroundColor: '#262626' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
            >
              Contact Maya Team
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextToSpeechPage;

