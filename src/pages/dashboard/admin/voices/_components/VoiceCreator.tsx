import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const VoiceCreator: React.FC = () => {
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

  // Cleanup audio URL on unmount
  React.useEffect(() => {
    return () => {
      if (generatedAudioUrl) {
        URL.revokeObjectURL(generatedAudioUrl);
      }
    };
  }, [generatedAudioUrl]);

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
      // Call Maya Research TTS API
      const response = await fetch('https://v3.mayaresearch.ai/v1/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          description: description.trim(),
          text: testText.trim(),
          stream: false, // Non-streaming for easier handling
          verbose: true,
          seed: seed,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get the audio blob
      const blob = await response.blob();
      const mimeType = response.headers.get('content-type') || 'audio/mpeg';
      
      // Create object URL for playback
      const url = URL.createObjectURL(blob);
      
      setAudioBlob(blob);
      setAudioMimeType(mimeType);
      setGeneratedAudioUrl(url);
      
      // Auto-play the generated audio
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
      // TODO: Upload image and save voice to database
      // 1. Upload image to storage
      // 2. Upload audio to storage
      // 3. Create voice record in database

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
        // Reset form
        setShowSaveDialog(false);
        setVoiceName('');
        setDescription('');
        setTestText('Welcome to Maya Research. This is a test of the custom voice.');
        setGeneratedAudioUrl(null);
        setImageFile(null);
        setImagePreview(null);
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

  return (
    <div className="flex justify-center min-h-screen w-full px-4 py-8">
      <div className="w-full max-w-3xl">
        <header className="mb-8">
          <h1 className="text-2xl text-foreground font-semibold mb-2">
            Create Custom Voice
          </h1>
          <p className="text-sm text-subtle font-medium">
            Generate and test custom voices for your platform
          </p>
        </header>

        <main className="space-y-6">
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
              placeholder="Describe the voice characteristics (e.g., Realistic male voice in the 20s age with a american accent)"
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
              placeholder="Enter text to test the voice. You can use tags like <excited>, <curious>, etc."
              className="w-full min-h-[120px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-gray-500">
              Tip: Use emotion tags like &lt;excited&gt;, &lt;curious&gt;, &lt;gasp&gt;, &lt;giggle&gt;, &lt;sigh&gt; for expressive speech
            </p>
          </div>

          {/* Seed */}
          <div className="space-y-2">
            <Label htmlFor="seed">Seed (for reproducibility)</Label>
            <Input
              id="seed"
              type="number"
              value={seed}
              onChange={(e) => setSeed(parseInt(e.target.value) || 1000)}
              placeholder="1000"
              min="0"
            />
            <p className="text-xs text-gray-500">
              Same seed with same inputs will generate the same voice
            </p>
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={handleGenerateVoice}
              disabled={isGenerating || !description.trim() || !testText.trim() || !apiKey.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isGenerating ? '#666' : '#262626' }}
              onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#3a3a3a')}
              onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.backgroundColor = '#262626')}
            >
              {isGenerating ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    height={20}
                    width={20}
                    className="animate-spin"
                  >
                    <path d="M146.498 47C146.498 56.9411 138.439 65 128.498 65C118.557 65 110.498 56.9411 110.498 47C110.498 37.0589 118.557 29 128.498 29C138.439 29 146.498 37.0589 146.498 47Z" />
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Voice'
              )}
            </button>
          </div>

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

                <div className="flex-1">
                  <p className="text-sm text-gray-600">Preview audio</p>
                </div>

                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="px-6 py-2 rounded-full text-white font-medium transition-colors duration-200"
                  style={{ backgroundColor: '#262626' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3a3a3a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#262626')}
                >
                  Save Voice
                </button>
              </div>
            </div>
          )}
        </main>

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
              {/* Voice Name */}
              <div className="space-y-2">
                <Label htmlFor="voiceName">Voice Name</Label>
                <Input
                  id="voiceName"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="e.g., Professional Sarah"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="voiceImage">Voice Avatar Image</Label>
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVoice}
                disabled={isSaving || !voiceName.trim() || !imageFile}
                className="px-6 py-2 rounded-full text-white font-medium transition-colors duration-200 disabled:opacity-50"
                style={{ backgroundColor: isSaving ? '#666' : '#262626' }}
              >
                {isSaving ? 'Saving...' : 'Save Voice'}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VoiceCreator;

