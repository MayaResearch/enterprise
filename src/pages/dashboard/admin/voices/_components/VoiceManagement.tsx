import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
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
        setDescription('Realistic male voice in the 20s age with a american accent. Low pitch, raspy timbre, slow pacing, neutral tone delivery at low intensity, commercial domain, ad_narrator role, casual delivery');
        setTestText('Wow, <excited> this place looks even better than I imagined! <curious> How did they set all this up so perfectly?');
        setGeneratedAudioUrl(null);
        setImageFile(null);
        setImagePreview(null);
        // Switch to manage tab to see the new voice
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
        // Update local state
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
      // Pause if already playing
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        setPreviewPlayingVoiceId(null);
      }
    } else {
      // Stop previous audio if any
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      
      // Play new audio
      const audio = new Audio(previewUrl);
      audio.play();
      audio.onended = () => setPreviewPlayingVoiceId(null);
      previewAudioRef.current = audio;
      setPreviewPlayingVoiceId(voiceId);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Tabs */}
        <div className="flex items-center gap-8 border-b border-gray-200 px-6 bg-white">
          <button
            onClick={() => setContentTab('generate')}
            className={`relative py-4 text-sm font-medium transition-colors ${
              contentTab === 'generate'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Generate Voice
            {contentTab === 'generate' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setContentTab('manage')}
            className={`relative py-4 text-sm font-medium transition-colors ${
              contentTab === 'manage'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Voices
            {contentTab === 'manage' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {contentTab === 'generate' ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* API Key */}
              <div className="space-y-2">
                <Label htmlFor="apiKey">Maya API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="maya_YOUR_API_KEY_HERE"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Voice Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the voice characteristics"
                  className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-gray-500">
                  Include: age, gender, accent, pitch, timbre, pacing, tone, intensity, domain, role, delivery style
                </p>
              </div>

              {/* Test Text */}
              <div className="space-y-2">
                <Label htmlFor="testText">Test Text</Label>
                <textarea
                  id="testText"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to test the voice"
                  className="w-full min-h-[120px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-gray-500">
                  Use emotion tags: &lt;excited&gt;, &lt;curious&gt;, &lt;gasp&gt;, &lt;giggle&gt;, &lt;sigh&gt;
                </p>
              </div>

              {/* Seed */}
              <div className="space-y-2">
                <Label htmlFor="seed">Seed</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 1000)}
                  min="0"
                />
                <p className="text-xs text-gray-500">
                  Same seed = same voice (reproducibility)
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateVoice}
                disabled={isGenerating || !description.trim() || !testText.trim() || !apiKey.trim()}
                className="w-full px-6 py-3 rounded-full text-white font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: isGenerating ? '#666' : '#262626' }}
              >
                {isGenerating ? 'Generating...' : 'Generate Voice'}
              </button>

              {/* Audio Player */}
              {generatedAudioUrl && (
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
                      className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-400"
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
                      className="px-6 py-2 rounded-full text-white font-medium"
                      style={{ backgroundColor: '#262626' }}
                    >
                      Save Voice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Manage Voices</h2>
                <p className="text-sm text-gray-600">Toggle visibility and manage your custom voices</p>
              </div>

              {isLoadingVoices ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              ) : voices.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">No voices created yet. Generate your first voice!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voices.map(voice => (
                    <div key={voice.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      {voice.imageUrl && (
                        <img src={voice.imageUrl} alt={voice.name} className="w-16 h-16 rounded-full object-cover" />
                      )}
                      <h3 className="font-semibold">{voice.name}</h3>
                      {voice.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{voice.description}</p>
                      )}
                      
                      {voice.previewUrl && (
                        <button
                          onClick={() => handlePreviewPlay(voice.id, voice.previewUrl!)}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          {previewPlayingVoiceId === voice.id ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                              Pause
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              Play
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                          {voice.isPublic ? 'Public' : 'Private'}
                        </span>
                        <button
                          onClick={() => handleTogglePublic(voice.id, voice.isPublic)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            voice.isPublic
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {voice.isPublic ? 'Hide from Public' : 'Show to Public'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Voice Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:rounded-3xl focus-visible:outline-0 max-w-lg">
          <DialogHeader>
            <DialogTitle>Save Custom Voice</DialogTitle>
            <DialogDescription>Provide a name and image for your voice</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voiceName">Voice Name</Label>
              <Input
                id="voiceName"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                placeholder="e.g., Professional Sarah"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voiceImage">Voice Avatar Image</Label>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2" />
              )}
              <input
                id="voiceImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 rounded-full border hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVoice}
              disabled={isSaving || !voiceName.trim() || !imageFile}
              className="px-6 py-2 rounded-full text-white disabled:opacity-50"
              style={{ backgroundColor: '#262626' }}
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

