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
      formData.append('description', description);
      formData.append('testText', testText);
      formData.append('seed', seed.toString());
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
        setGeneratedAudioUrl(null);
        setImageFile(null);
        setImagePreview(null);
        // Switch to manage tab
        setContentTab('manage');
      } else {
        alert('Failed to save voice');
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

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Side - Voice Generation & Management */}
      <div className="flex-1 flex flex-col overflow-hidden border-r">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Voice Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Create and manage custom voices for your platform
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
                  onClick={() => setContentTab('manage')}
                  className={`relative isolate flex items-center gap-1 text-base font-medium pb-2 border-b-2 shrink-0 ${
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
                <div className="flex gap-8 items-center">
                  <div className="flex-shrink-0" style={{ width: '280px' }}>
                    <label htmlFor="api-key" className="text-base font-semibold block">
                      API Key
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
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
                <div className="flex gap-8 items-center">
                  <div className="flex-shrink-0" style={{ width: '280px' }}>
                    <label htmlFor="seed" className="text-base font-semibold block">
                      Seed
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
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
                    {isGenerating && !audioUrl ? (
                      <Skeleton className="h-24 rounded-lg" />
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Generated Voice Preview</h3>
                        
                        <audio
                          ref={audioRef}
                          src={generatedAudioUrl}
                          onEnded={() => setIsPlaying(false)}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />

                        <div className="flex items-center gap-3">
                          <button
                            onClick={handlePlayPause}
                            className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          >
                            {isPlaying ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => setShowSaveDialog(true)}
                            className="px-6 py-2 rounded-full text-white font-medium transition-colors"
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
                <div className="space-y-6">
                  {isLoadingVoices ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
                      ))}
                    </div>
                  ) : voices.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-gray-500 mb-2">No voices created yet</p>
                      <button
                        onClick={() => setContentTab('generate')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Generate your first voice →
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {voices.map(voice => (
                        <div key={voice.id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:border-gray-300 transition-colors">
                          <div className="flex items-start gap-3">
                            {voice.imageUrl ? (
                              <img src={voice.imageUrl} alt={voice.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                  <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base truncate">{voice.name}</h3>
                              {voice.description && (
                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">{voice.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {voice.previewUrl && (
                            <button
                              onClick={() => handlePreviewPlay(voice.id, voice.previewUrl!)}
                              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              {previewPlayingVoiceId === voice.id ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                  </svg>
                                  Pause Preview
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                  Play Preview
                                </>
                              )}
                            </button>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Show to Public</span>
                              <Switch
                                checked={voice.isPublic}
                                onCheckedChange={() => handleTogglePublic(voice.id, voice.isPublic)}
                              />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              voice.isPublic 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {voice.isPublic ? 'Public' : 'Private'}
                            </span>
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

      {/* Right Side - Documentation (Optional) */}
      <div className="hidden lg:block w-[32rem] overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Voice Generation Guide</h2>
            <p className="text-sm text-gray-600">Learn how to create custom voices for your platform</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Voice Description</h3>
              <p className="text-sm text-gray-600 mb-2">
                Provide detailed characteristics:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Age: young, middle_aged, old</li>
                <li>Gender: male, female, neutral</li>
                <li>Accent: american, british, etc.</li>
                <li>Pitch: low, medium, high</li>
                <li>Timbre: raspy, smooth, etc.</li>
                <li>Pacing: slow, medium, fast</li>
                <li>Tone: neutral, warm, professional</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Emotion Tags</h3>
              <p className="text-sm text-gray-600 mb-2">
                Use emotion tags in your test text:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>&lt;excited&gt; - Excited tone</li>
                <li>&lt;curious&gt; - Curious tone</li>
                <li>&lt;gasp&gt; - Gasping sound</li>
                <li>&lt;giggle&gt; - Laughing sound</li>
                <li>&lt;sigh&gt; - Sighing sound</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Seed Value</h3>
              <p className="text-sm text-gray-600">
                Using the same seed with identical inputs will generate the exact same voice. This is useful for reproducibility and consistency.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">Public Visibility</h3>
              <p className="text-sm text-gray-600">
                Toggle "Show to Public" in the Manage tab to make voices available in the playground for all users. Private voices are only visible to admins.
              </p>
            </div>
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
              Provide a name and image for your voice
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="voiceName" className="text-sm font-medium">Voice Name</label>
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
