import React, { useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ContentTab = 'generate' | 'manage';

interface Voice {
  id: string;
  voiceId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  previewUrl: string | null;
  isPublic: boolean;
  createdAt: string | Date;
}

const VoiceManagement: React.FC = () => {
  const [contentTab, setContentTab] = useState<ContentTab>('generate');
  const [docTab, setDocTab] = useState<'python' | 'javascript' | 'curl'>('python');

  // Generate tab states
  const [description, setDescription] = useState<string>('Realistic male voice in the 20s age with a american accent. Low pitch, raspy timbre, slow pacing, neutral tone delivery at low intensity, commercial domain, ad_narrator role, casual delivery');
  const [testText, setTestText] = useState<string>('Wow, <excited> this place looks even better than I imagined! <curious> How did they set all this up so perfectly?');
  const [seed, setSeed] = useState<number>(1000);
  const [apiKey, setApiKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/mpeg');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Save voice dialog
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [voiceName, setVoiceName] = useState<string>('');
  const [voiceDescription, setVoiceDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Manage tab states
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState<boolean>(false);
  const [previewPlayingVoiceId, setPreviewPlayingVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch voices when switching to manage tab
  React.useEffect(() => {
    if (contentTab === 'manage') {
      fetchVoices();
    }
  }, [contentTab]);

  // Cleanup audio URL on unmount
  React.useEffect(() => {
    return () => {
      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, [generatedAudioUrl]);

  const fetchVoices = async (): Promise<void> => {
    setIsLoadingVoices(true);
    try {
      const response = await fetch('/api/admin/voices');
      if (response.ok) {
        const data = await response.json();
        setVoices(data);
      }
    } catch (error) {
      console.error('Error fetching voices:', error);
    } finally {
      setIsLoadingVoices(false);
    }
  };

  const handleGenerateVoice = async (): Promise<void> => {
    if (!description.trim() || !testText.trim()) {
      alert('Please provide both description and test text');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please provide an API key');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('https://v3.mayaresearch.ai/v1/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          description: description.trim(),
          text: testText.trim(),
          stream: false,
          verbose: true,
          seed: seed,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const blob = await response.blob();
      const mimeType = response.headers.get('content-type') || 'audio/mpeg';
      const url = URL.createObjectURL(blob);
      
      setAudioBlob(blob);
      setAudioMimeType(mimeType);
      setGeneratedAudioUrl(url);
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.log('Auto-play prevented:', err);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating voice:', error);
      alert('Failed to generate voice. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current || !generatedAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVoice = async (): Promise<void> => {
    if (!voiceName.trim()) {
      alert('Please provide a voice name');
      return;
    }

    if (!imageFile) {
      alert('Please upload an image');
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', voiceName);
      if (voiceDescription) {
        formData.append('description', voiceDescription);
      }
      // Save the voice generation parameters
      formData.append('voiceDescription', description);
      formData.append('voiceText', testText);
      formData.append('image', imageFile);
      if (audioBlob) {
        const extension = audioMimeType.includes('mp3') ? 'mp3' : 
                          audioMimeType.includes('wav') ? 'wav' : 'mp3';
        formData.append('audio', audioBlob, `preview.${extension}`);
      }

      const response = await fetch('/api/admin/voices', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Voice saved successfully!');
        setShowSaveDialog(false);
        setVoiceName('');
        setVoiceDescription('');
        setGeneratedAudioUrl(null);
        setImageFile(null);
        setImagePreview(null);
        // Switch to manage tab
        setContentTab('manage');
      } else {
        const errorData = await response.json();
        alert(`Failed to save voice: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving voice:', error);
      alert('Failed to save voice');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublic = async (voiceId: string, currentState: boolean): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/voices/${voiceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: !currentState,
        }),
      });

      if (response.ok) {
        setVoices(prev => prev.map(v => 
          v.id === voiceId ? { ...v, isPublic: !currentState } : v
        ));
      } else {
        alert('Failed to update voice');
      }
    } catch (error) {
      console.error('Error updating voice:', error);
      alert('Failed to update voice');
    }
  };

  const handlePreviewPlay = (voiceId: string, previewUrl: string): void => {
    if (previewPlayingVoiceId === voiceId) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        setPreviewPlayingVoiceId(null);
      }
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      
      const audio = new Audio(previewUrl);
      audio.play();
      audio.onended = () => setPreviewPlayingVoiceId(null);
      previewAudioRef.current = audio;
      setPreviewPlayingVoiceId(voiceId);
    }
  };

  // Helper functions for code examples
  const getPythonCodeExample = (): string => {
    return `pip install maya-py

from maya_py import Maya

maya = Maya(api_key = "${apiKey || 'YOUR_API_KEY'}")

result = maya.create_voice(
  description="${description.substring(0, 45) || 'Young female voice...'}...",
  test_text="${testText.substring(0, 45) || 'Hello world...'}...",
  seed=${seed || 1000}
)
print(result)`;
  };

  const getJavaScriptCodeExample = (): string => {
    return `npm install maya-js

import { Maya } from 'maya-js';

const maya = new Maya({
  apiKey: '${apiKey || 'YOUR_API_KEY'}'
});

const result = await maya.createVoice({
  description: "${description.substring(0, 45) || 'Young female voice...'}...",
  testText: "${testText.substring(0, 45) || 'Hello world...'}...",
  seed: ${seed || 1000}
});`;
  };

  const getCurlCommandExample = (): string => {
    return `curl --location 'https://v3.mayaresearch.ai/v1/tts/generate' \\
--header 'Content-Type: application/json' \\
--header 'X-API-Key: ${apiKey || 'YOUR_API_KEY'}' \\
--data '{
  "description": "${description || 'Young female voice with american accent'}",
  "text": "${testText || 'Hello, how are you today?'}",
  "stream": true,
  "verbose": true,
  "seed": ${seed || 1000}
}'`;
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Side - Voice Generation & Management */}
      <div className="flex-1 flex flex-col overflow-hidden lg:border-r">
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                Voice Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Create and manage custom voices for your platform
              </p>
            </div>

            {/* Tabs */}
            <div className="flex shrink-0 flex-row items-center justify-between mb-4 sm:mb-6">
              <div className="flex w-full justify-start gap-2 sm:gap-3 overflow-x-auto scrollbar-none md:scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setContentTab('generate')}
                  className={`relative isolate flex items-center gap-1 text-sm sm:text-base font-medium pb-2 border-b-2 shrink-0 ${
                    contentTab === 'generate' 
                      ? 'border-current opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="leading-none">Generate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab('manage')}
                  className={`relative isolate flex items-center gap-1 text-sm sm:text-base font-medium pb-2 border-b-2 shrink-0 whitespace-nowrap ${
                    contentTab === 'manage' 
                      ? 'border-current opacity-100' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="leading-none">Manage Voices</span>
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {contentTab === 'generate' ? (
              <>
                {/* Description Input Box */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Voice Description
                  </label>
                  <div 
                    className="flex flex-col gap-2 w-full rounded-[12px] p-[10px] transition-all duration-100 border border-gray-300 bg-white"
                    style={{
                      boxShadow: 'rgba(32, 36, 61, 0.02) 0px 7px 9px 0px, rgba(32, 36, 61, 0.03) 0px 3px 7px 0px, rgba(32, 36, 61, 0.03) 0px 1px 4px 0px',
                      minHeight: '120px'
                    }}
                  >
                    <textarea
                      id="description"
                      placeholder="Describe voice characteristics (age, gender, accent, pitch, timbre, pacing...)"
                      rows={3}
                      className="flex-1 w-full resize-none outline-none border-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
                      style={{ 
                        marginBottom: 0,
                        minHeight: '80px',
                        fontFamily: 'inherit'
                      }}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.max(80, e.target.scrollHeight) + 'px';
                      }}
                    />
                  </div>
                </div>

                {/* Test Text Input Box */}
                <div className="space-y-2">
                  <label htmlFor="testText" className="text-sm font-medium">
                    Test Text
                  </label>
                  <div 
                    className="flex flex-col gap-2 w-full rounded-[12px] p-[10px] transition-all duration-100 border border-gray-300 bg-white"
                    style={{
                      boxShadow: 'rgba(32, 36, 61, 0.02) 0px 7px 9px 0px, rgba(32, 36, 61, 0.03) 0px 3px 7px 0px, rgba(32, 36, 61, 0.03) 0px 1px 4px 0px',
                      minHeight: '120px'
                    }}
                  >
                    <textarea
                      id="testText"
                      placeholder="Enter text to test. Use emotion tags like <excited>, <curious>, <sigh>"
                      rows={3}
                      className="flex-1 w-full resize-none outline-none border-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
                      style={{ 
                        marginBottom: 0,
                        minHeight: '80px',
                        fontFamily: 'inherit'
                      }}
                      value={testText}
                      onChange={(e) => {
                        setTestText(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.max(80, e.target.scrollHeight) + 'px';
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const words = testText.split(' ');
                            const shuffled = words.sort(() => Math.random() - 0.5).join(' ');
                            setTestText(shuffled);
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
                          onClick={() => setTestText('')}
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
                          onClick={handleGenerateVoice}
                          disabled={isGenerating}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white disabled:bg-gray-400 transition-colors rounded-full"
                          style={{ backgroundColor: isGenerating ? undefined : '#262626' }}
                          onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                          onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#262626')}
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
                          {isGenerating ? 'Generating...' : 'Run'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Key Input - Side by Side */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 sm:items-center">
                  <div className="flex-shrink-0 sm:w-[280px]">
                    <label htmlFor="api-key" className="text-sm sm:text-base font-semibold block">
                      API Key
                    </label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Your Maya API key
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex min-w-0 shrink grow p-1 border border-input rounded-md">
                      <input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="maya_YOUR_API_KEY_HERE"
                        className="flex-1 px-2 py-1 text-sm bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Seed Input - Side by Side */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 sm:items-center">
                  <div className="flex-shrink-0 sm:w-[280px]">
                    <label htmlFor="seed" className="text-sm sm:text-base font-semibold block">
                      Seed
                    </label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      For reproducible results
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex min-w-0 shrink grow p-1 border border-input rounded-md">
                      <input
                        id="seed"
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(parseInt(e.target.value) || 1000)}
                        min="0"
                        className="flex-1 px-2 py-1 text-sm bg-transparent border-none outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Audio Player */}
                {generatedAudioUrl && (
                  <>
                    {isGenerating && !generatedAudioUrl ? (
                      <Skeleton className="h-24 rounded-lg" />
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold">Generated Voice Preview</h3>
                        
                        <audio
                          ref={audioRef}
                          src={generatedAudioUrl}
                          onEnded={() => setIsPlaying(false)}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />

                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={handlePlayPause}
                            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          >
                            {isPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => setShowSaveDialog(true)}
                            className="px-4 py-2 sm:px-6 sm:py-2 rounded-full text-white text-sm sm:text-base font-medium transition-colors"
                            style={{ backgroundColor: '#262626' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
                          >
                            Save Voice
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {/* Manage Voices Content */}
                <div className="space-y-4 sm:space-y-6">
                  {isLoadingVoices ? (
                    <div className="grid grid-cols-1 gap-3">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                      ))}
                    </div>
                  ) : voices.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-sm sm:text-base text-gray-500 mb-2">No voices created yet</p>
                      <button
                        onClick={() => setContentTab('generate')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Generate your first voice →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {voices.map((voice, index) => (
                        <div key={voice.id} className="group/octave-voice-card flex min-h-24 flex-row gap-0 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                          {/* Avatar Section */}
                          <div className="flex h-full shrink-0 items-center py-2.5 pl-2 pr-4">
                            <div
                              className="group/voice-card relative aspect-square shrink-0 rounded size-20 grid place-content-center overflow-hidden bg-gradient-to-b from-blue-300 to-blue-300"
                              data-index={index % 6}
                            >
                              {voice.imageUrl && (
                                <img 
                                  src={voice.imageUrl} 
                                  alt={voice.name} 
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 grid place-content-center">
                                <button 
                                  className="relative grid size-8 place-content-center rounded-full bg-white/80 text-gray-800 outline-none hover:bg-white/100"
                                  onClick={() => voice.previewUrl && handlePreviewPlay(voice.id, voice.previewUrl)}
                                >
                                  {previewPlayingVoiceId === voice.id ? (
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
                            </div>
                          </div>

                          {/* Voice Info */}
                          <div className="flex min-w-0 shrink grow flex-col items-start justify-center gap-1 py-4 pl-0">
                            <div className="flex w-full items-center gap-0">
                              <span className="min-w-0 flex-1 truncate text-base/5 font-medium">
                                {voice.name} <span className="text-gray-400 font-normal">({voice.voiceId})</span>
                              </span>
                            </div>
                            <div className="flex w-full items-center gap-0">
                              <span className="min-w-0 flex-1 truncate text-sm/4 font-normal text-gray-600">
                                {voice.description || 'No description'}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex shrink-0 flex-row items-center justify-end gap-2 px-4 py-2">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white">
                              <span className="text-xs text-gray-600 whitespace-nowrap">Public</span>
                              <Switch
                                checked={voice.isPublic}
                                onCheckedChange={() => handleTogglePublic(voice.id, voice.isPublic)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Code Examples */}
      <div className="hidden lg:flex w-[32rem] flex-col overflow-hidden bg-[#1e1e1e]">
        <div className="flex-1 overflow-auto">
          {/* Tabs */}
          <div className="flex items-center border-b border-gray-800 bg-[#1e1e1e]">
            <button
              onClick={() => setDocTab('python')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                docTab === 'python'
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
              onClick={() => setDocTab('javascript')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                docTab === 'javascript'
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
              onClick={() => setDocTab('curl')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                docTab === 'curl'
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
                let code = '';
                if (docTab === 'python') code = getPythonCodeExample();
                else if (docTab === 'javascript') code = getJavaScriptCodeExample();
                else code = getCurlCommandExample();
                navigator.clipboard.writeText(code);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded"
              title="Copy code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>

            {docTab === 'python' && (
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
                        <div>10</div>
                      </span>
                      {/* Code content */}
                      <span style={{ flex: 1 }}>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>from</span> maya_py <span style={{ color: 'rgb(86, 156, 214)' }}>import</span> Maya</div>
                        <div>&nbsp;</div>
                        <div>maya <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> Maya(api_key <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(206, 145, 120)' }}>"{apiKey || 'YOUR_API_KEY'}"</span>)</div>
                        <div>&nbsp;</div>
                        <div>result <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> maya.create_voice(</div>
                        <div>  description<span style={{ color: 'rgb(212, 212, 212)' }}>=</span><span style={{ color: 'rgb(206, 145, 120)' }}>"{description.substring(0, 45) || 'Young female voice...'}..."</span>,</div>
                        <div>  test_text<span style={{ color: 'rgb(212, 212, 212)' }}>=</span><span style={{ color: 'rgb(206, 145, 120)' }}>"{testText.substring(0, 45) || 'Hello world...'}..."</span>,</div>
                        <div>  seed<span style={{ color: 'rgb(212, 212, 212)' }}>=</span><span style={{ color: 'rgb(181, 206, 168)' }}>{seed || 1000}</span></div>
                        <div>)</div>
                        <div><span style={{ color: 'rgb(78, 201, 176)' }}>print</span>(result)</div>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {docTab === 'javascript' && (
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
                        <div>10</div>
                        <div>11</div>
                      </span>
                      {/* Code content */}
                      <span style={{ flex: 1 }}>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>import</span> {'{'} Maya {'}'} <span style={{ color: 'rgb(86, 156, 214)' }}>from</span> <span style={{ color: 'rgb(206, 145, 120)' }}>'maya-js'</span>;</div>
                        <div>&nbsp;</div>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>const</span> maya <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(86, 156, 214)' }}>new</span> <span style={{ color: 'rgb(78, 201, 176)' }}>Maya</span>({'{'}</div>
                        <div>  apiKey: <span style={{ color: 'rgb(206, 145, 120)' }}>'{apiKey || 'YOUR_API_KEY'}'</span></div>
                        <div>{'}'});</div>
                        <div>&nbsp;</div>
                        <div><span style={{ color: 'rgb(86, 156, 214)' }}>const</span> result <span style={{ color: 'rgb(212, 212, 212)' }}>=</span> <span style={{ color: 'rgb(86, 156, 214)' }}>await</span> maya.<span style={{ color: 'rgb(220, 220, 170)' }}>createVoice</span>({'{'}</div>
                        <div>  description: <span style={{ color: 'rgb(206, 145, 120)' }}>"{description.substring(0, 45) || 'Young female voice...'}..."</span>,</div>
                        <div>  testText: <span style={{ color: 'rgb(206, 145, 120)' }}>"{testText.substring(0, 45) || 'Hello world...'}..."</span>,</div>
                        <div>  seed: <span style={{ color: 'rgb(181, 206, 168)' }}>{seed || 1000}</span></div>
                        <div>{'}'});</div>
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            )}

            {docTab === 'curl' && (
              <div className="pb-4">
                <div className="px-4 pt-4">
                  <pre className="m-0 p-4 overflow-auto" style={{
                    background: 'rgb(30, 30, 30)',
                    fontSize: '13px',
                    fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
                    color: 'rgb(212, 212, 212)',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    <code>
                      <span style={{ color: 'rgb(220, 220, 170)' }}>curl</span> --location <span style={{ color: 'rgb(206, 145, 120)' }}>'https://v3.mayaresearch.ai/v1/tts/generate'</span> \{'\n'}
                      --header <span style={{ color: 'rgb(206, 145, 120)' }}>'Content-Type: application/json'</span> \{'\n'}
                      --header <span style={{ color: 'rgb(206, 145, 120)' }}>'X-API-Key: {apiKey || 'YOUR_API_KEY'}'</span> \{'\n'}
                      --data <span style={{ color: 'rgb(206, 145, 120)' }}>'{'{'}{'\n'}
  "description": "{description || 'Young female voice with american accent'}",{'\n'}
  "text": "{testText || 'Hello, how are you today?'}",{'\n'}
  "stream": true,{'\n'}
  "verbose": true,{'\n'}
  "seed": {seed || 1000}{'\n'}
{'}'}'</span>
                    </code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Voice Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold leading-6 tracking-tight">
              Save Custom Voice
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Provide a name, description (subtitle), and image for your voice
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="voiceName" className="text-sm font-medium">Voice Name (Tag Name)</label>
              <input
                id="voiceName"
                type="text"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="e.g., Professional Sarah"
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="voiceDescription" className="text-sm font-medium">Description (Subtitle)</label>
              <textarea
                id="voiceDescription"
                value={voiceDescription}
                onChange={(e) => setVoiceDescription(e.target.value)}
                placeholder="e.g., Warm, friendly voice perfect for customer service"
                rows={2}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="voiceImage" className="text-sm font-medium">Voice Avatar Image</label>
              {imagePreview && (
                <div className="mb-2">
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                </div>
              )}
              <input
                id="voiceImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVoice}
              disabled={isSaving || !voiceName.trim() || !imageFile}
              className="px-6 py-2 rounded-full text-white font-medium transition-colors disabled:opacity-50 text-sm"
              style={{ backgroundColor: isSaving ? '#666' : '#262626' }}
              onMouseEnter={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => !isSaving && (e.currentTarget.style.backgroundColor = '#262626')}
            >
              {isSaving ? 'Saving...' : 'Save Voice'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceManagement;
