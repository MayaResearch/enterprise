"use client"

import * as React from "react"
import { Check, Volume2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface Voice {
  voiceId: string
  name: string
  category?: string
  labels?: {
    accent?: string
    descriptive?: string
    age?: string
    gender?: string
    language?: string
    use_case?: string
  }
  description?: string
  previewUrl?: string
}

interface VoicePickerProps {
  voices: Voice[]
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
}

export function VoicePicker({
  voices,
  value,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  placeholder = "Select a voice...",
}: VoicePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const selectedVoice = voices.find((voice) => voice.voiceId === value)

  const handlePlayPreview = (e: React.MouseEvent, previewUrl: string, voiceId: string) => {
    e.stopPropagation()
    
    if (currentlyPlaying === voiceId) {
      // Stop playing
      audioRef.current?.pause()
      setCurrentlyPlaying(null)
    } else {
      // Play new audio
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(previewUrl)
      audioRef.current.play()
      setCurrentlyPlaying(voiceId)
      
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null)
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="flex min-w-0 shrink grow p-1 border border-input rounded-md w-full justify-between items-center bg-transparent hover:bg-gray-50 transition-colors"
        >
          <span className="min-w-0 flex-auto shrink grow text-left p-1 text-sm">
            {selectedVoice ? selectedVoice.name : <span className="text-muted-foreground">{placeholder}</span>}
          </span>
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
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search voices..." />
          <CommandEmpty>No voice found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {voices.map((voice) => (
                <CommandItem
                  key={voice.voiceId}
                  value={voice.name}
                  onSelect={() => {
                    onValueChange?.(voice.voiceId)
                  }}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === voice.voiceId ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{voice.name}</span>
                        {voice.labels && (
                          <div className="flex gap-1 flex-wrap">
                            {voice.labels.gender && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {voice.labels.gender}
                              </span>
                            )}
                            {voice.labels.accent && (
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {voice.labels.accent}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {voice.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {voice.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {voice.previewUrl && (
                    <button
                      onClick={(e) => handlePlayPreview(e, voice.previewUrl!, voice.voiceId)}
                      className={cn(
                        "ml-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0",
                        currentlyPlaying === voice.voiceId && "bg-blue-100 text-blue-600"
                      )}
                      title="Play preview"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

