import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BiwHnAGj.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_AcODx6TE.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useState } from 'react';
import { SearchIcon, Check, Volume2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Command as Command$1 } from 'cmdk';
import * as PopoverPrimitive from '@radix-ui/react-popover';
export { renderers } from '../../renderers.mjs';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Command({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1,
    {
      "data-slot": "command",
      className: cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props
    }
  );
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border-b px-3",
      children: [
        /* @__PURE__ */ jsx(SearchIcon, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsx(
          Command$1.Input,
          {
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            ),
            ...props
          }
        )
      ]
    }
  );
}
function CommandList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.List,
    {
      "data-slot": "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      ),
      ...props
    }
  );
}
function CommandEmpty({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Command$1.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}

function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}

function VoicePicker({
  voices,
  value,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  placeholder = "Select a voice..."
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = React.useState(null);
  const audioRef = React.useRef(null);
  const open = controlledOpen !== void 0 ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const selectedVoice = voices.find((voice) => voice.voiceId === value);
  const handlePlayPreview = (e, previewUrl, voiceId) => {
    e.stopPropagation();
    if (currentlyPlaying === voiceId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(previewUrl);
      audioRef.current.play();
      setCurrentlyPlaying(voiceId);
      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      "button",
      {
        role: "combobox",
        "aria-expanded": open,
        className: "flex min-w-0 shrink grow p-1 border border-input rounded-md w-full justify-between items-center bg-transparent hover:bg-gray-50 transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-auto shrink grow text-left p-1 text-sm", children: selectedVoice ? selectedVoice.name : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: placeholder }) }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "ml-2 h-4 w-4 shrink-0 opacity-50",
              children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-[400px] p-0", align: "start", children: /* @__PURE__ */ jsxs(Command, { children: [
      /* @__PURE__ */ jsx(CommandInput, { placeholder: "Search voices..." }),
      /* @__PURE__ */ jsx(CommandEmpty, { children: "No voice found." }),
      /* @__PURE__ */ jsx(CommandList, { children: /* @__PURE__ */ jsx(CommandGroup, { children: voices.map((voice) => /* @__PURE__ */ jsxs(
        CommandItem,
        {
          value: voice.name,
          onSelect: () => {
            onValueChange?.(voice.voiceId);
          },
          className: "flex items-center justify-between py-3 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx(
                Check,
                {
                  className: cn(
                    "mr-2 h-4 w-4 shrink-0",
                    value === voice.voiceId ? "opacity-100" : "opacity-0"
                  )
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: voice.name }),
                  voice.labels && /* @__PURE__ */ jsxs("div", { className: "flex gap-1 flex-wrap", children: [
                    voice.labels.gender && /* @__PURE__ */ jsx("span", { className: "text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded", children: voice.labels.gender }),
                    voice.labels.accent && /* @__PURE__ */ jsx("span", { className: "text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded", children: voice.labels.accent })
                  ] })
                ] }),
                voice.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: voice.description })
              ] })
            ] }),
            voice.previewUrl && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => handlePlayPreview(e, voice.previewUrl, voice.voiceId),
                className: cn(
                  "ml-2 p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0",
                  currentlyPlaying === voice.voiceId && "bg-blue-100 text-blue-600"
                ),
                title: "Play preview",
                children: /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" })
              }
            )
          ]
        },
        voice.voiceId
      )) }) })
    ] }) })
  ] });
}

function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-gray-200/60", className),
      ...props
    }
  );
}

const voices = [
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
      use_case: "conversational"
    },
    description: "Matter-of-fact, personable woman. Great for conversational use cases.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/b4928a68-c03b-411f-8533-3d5c299fd451.mp3"
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
      use_case: "narration"
    },
    description: "Clear, articulate voice perfect for narration and audiobooks.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/29vD33N1CtxCmqQRPOHJ/b99fc51d-12d3-4312-b480-a8a45a7d51ef.mp3"
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
      use_case: "characters_animation"
    },
    description: "Intense, energetic male voice. Great for character use-cases.",
    previewUrl: "https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3"
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
      use_case: "news"
    },
    description: "Professional, authoritative voice for news and announcements."
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
      use_case: "conversational"
    },
    description: "Warm, friendly voice perfect for customer service."
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
      use_case: "narration"
    },
    description: "Sophisticated British accent for premium content."
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
      use_case: "advertisement"
    },
    description: "Energetic and enthusiastic for advertisements."
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
      use_case: "meditation"
    },
    description: "Calm, soothing voice for meditation and relaxation."
  }
];
const TextToSpeechPage = () => {
  const [voiceId, setVoiceId] = useState("Ava");
  const [text, setText] = useState("Welcome back to another episode of our podcast! Today we are diving into an absolutely fascinating topic.");
  const [stream, setStream] = useState(false);
  const [apiKey, setApiKey] = useState("maya_YOUR_API_KEY_HERE");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("python");
  const [contentTab, setContentTab] = useState("generate");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioMimeType, setAudioMimeType] = useState("audio/mpeg");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React__default.useRef(null);
  const [previewPlayingVoiceId, setPreviewPlayingVoiceId] = useState(null);
  const previewAudioRef = React__default.useRef(null);
  const handleGenerate = async () => {
    setIsLoading(true);
    setOutput("Generating speech...");
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {
      }
      audioRef.current = null;
    }
    setIsPlaying(false);
    try {
      const response = await fetch("https://v3.mayaresearch.ai/v1/tts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify({
          voice_id: voiceId,
          text,
          stream
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("audio")) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        setAudioMimeType(contentType || "audio/mpeg");
        setOutput("Audio generated successfully! Click play to listen.");
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
        };
        audio.onerror = () => {
          setOutput("Error playing audio. Please try again.");
          setIsPlaying(false);
        };
        try {
          const playPromise = audio.play();
          if (playPromise !== void 0) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch((error) => {
              console.error("Auto-play failed:", error);
              setIsPlaying(false);
            });
          }
        } catch (error) {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        }
      } else {
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setAudioUrl(null);
      setAudioBlob(null);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      try {
        audioRef.current.pause();
        setIsPlaying(false);
      } catch (error) {
        console.error("Error pausing audio:", error);
      }
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== void 0) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }
  };
  const handleDownload = () => {
    if (!audioBlob) return;
    let extension = "mp3";
    if (audioMimeType.includes("wav")) {
      extension = "wav";
    } else if (audioMimeType.includes("ogg")) {
      extension = "ogg";
    } else if (audioMimeType.includes("webm")) {
      extension = "webm";
    } else if (audioMimeType.includes("aac")) {
      extension = "aac";
    } else if (audioMimeType.includes("flac")) {
      extension = "flac";
    }
    const blob = new Blob([audioBlob], { type: audioMimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tts-${voiceId}-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
  const handlePreviewPlay = (voice) => {
    if (!voice.previewUrl) return;
    if (previewPlayingVoiceId === voice.voiceId) {
      if (previewAudioRef.current) {
        try {
          previewAudioRef.current.pause();
          setPreviewPlayingVoiceId(null);
        } catch (error) {
          console.error("Error pausing preview:", error);
        }
      }
      return;
    }
    if (previewAudioRef.current) {
      try {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = "";
      } catch (error) {
        console.error("Error stopping previous preview:", error);
      }
    }
    const audio = new Audio(voice.previewUrl);
    previewAudioRef.current = audio;
    audio.onended = () => {
      setPreviewPlayingVoiceId(null);
    };
    audio.onerror = () => {
      console.error("Error playing preview audio");
      setPreviewPlayingVoiceId(null);
    };
    const playPromise = audio.play();
    if (playPromise !== void 0) {
      playPromise.then(() => {
        setPreviewPlayingVoiceId(voice.voiceId);
      }).catch((error) => {
        console.error("Error playing preview:", error);
        setPreviewPlayingVoiceId(null);
      });
    }
  };
  React__default.useEffect(() => {
    return () => {
      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch (e) {
        }
      }
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {
        }
      }
      if (previewAudioRef.current) {
        try {
          previewAudioRef.current.pause();
        } catch (e) {
        }
      }
    };
  }, [audioUrl]);
  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
  };
  const getPythonCode = () => {
    return `from maya_py import Maya

maya = Maya(api_key="${apiKey}")

result = maya.tts_generate(
  voice_id="${voiceId}",
  text="${text}",
  stream=${stream}
)`;
  };
  const getJavaScriptCode = () => {
    return `const Maya = require('maya-js');

const maya = new Maya("${apiKey}");

const result = await maya.ttsGenerate({
  voiceId: "${voiceId}",
  text: "${text}",
  stream: ${stream}
});`;
  };
  const getCurlCommand = () => {
    return `curl --location 'https://v3.mayaresearch.ai/v1/tts/generate' \\
--header 'Content-Type: application/json' \\
--header 'X-API-Key: ${apiKey}' \\
--data '{
  "voice_id": "${voiceId}",
  "text": "${text}",
  "stream": ${stream}
}'`;
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex flex-col overflow-hidden border-r", children: /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto p-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-foreground mb-2", children: "Text to Speech API" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Convert text to natural-sounding speech using our API" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex shrink-0 flex-row items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full justify-start gap-3 overflow-x-auto scrollbar-none md:scrollbar-thin", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setContentTab("generate"),
            className: `relative isolate flex items-center gap-1 text-base font-medium pb-2 border-b-2 shrink-0 ${contentTab === "generate" ? "border-current opacity-100" : "border-transparent opacity-50 hover:opacity-100"}`,
            children: /* @__PURE__ */ jsx("span", { className: "leading-none", children: "Generate" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setContentTab("similar"),
            className: `relative isolate flex items-center gap-1 text-base font-medium pb-2 border-b-2 shrink-0 ${contentTab === "similar" ? "border-current opacity-100" : "border-transparent opacity-50 hover:opacity-100"}`,
            children: /* @__PURE__ */ jsx("span", { className: "leading-none", children: "Voice Library" })
          }
        )
      ] }) }),
      contentTab === "generate" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "text", className: "text-sm font-medium", children: "Text" }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex flex-col gap-2 w-full rounded-[12px] p-[10px] transition-all duration-100 border border-gray-300 bg-white",
              style: {
                boxShadow: "rgba(32, 36, 61, 0.02) 0px 7px 9px 0px, rgba(32, 36, 61, 0.03) 0px 3px 7px 0px, rgba(32, 36, 61, 0.03) 0px 1px 4px 0px",
                minHeight: "120px"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "text",
                    placeholder: "Enter text to convert to speech",
                    rows: 3,
                    className: "flex-1 w-full resize-none outline-none border-none bg-transparent text-sm placeholder:text-gray-400 focus:outline-none",
                    style: {
                      marginBottom: 0,
                      minHeight: "80px",
                      fontFamily: "inherit"
                    },
                    value: text,
                    onChange: (e) => {
                      setText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.max(80, e.target.scrollHeight) + "px";
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => {
                        const words = text.split(" ");
                        const shuffled = words.sort(() => Math.random() - 0.5).join(" ");
                        setText(shuffled);
                      },
                      className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100",
                      children: [
                        /* @__PURE__ */ jsxs(
                          "svg",
                          {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "16",
                            height: "16",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                              /* @__PURE__ */ jsx("path", { d: "M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" }),
                              /* @__PURE__ */ jsx("polyline", { points: "18 2 22 6 18 10" }),
                              /* @__PURE__ */ jsx("path", { d: "M2 6h1.9c1.5 0 2.9.9 3.6 2.2" }),
                              /* @__PURE__ */ jsx("polyline", { points: "22 18 18 22 14 18" })
                            ]
                          }
                        ),
                        "Shuffle"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => {
                          setText("");
                        },
                        className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsxs(
                            "svg",
                            {
                              xmlns: "http://www.w3.org/2000/svg",
                              width: "16",
                              height: "16",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              children: [
                                /* @__PURE__ */ jsx("path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }),
                                /* @__PURE__ */ jsx("path", { d: "M3 3v5h5" })
                              ]
                            }
                          ),
                          "Clear"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: handleGenerate,
                        disabled: isLoading,
                        className: "flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white disabled:bg-gray-400 transition-colors rounded-full",
                        style: { backgroundColor: isLoading ? void 0 : "#262626" },
                        onMouseEnter: (e) => !isLoading && (e.currentTarget.style.backgroundColor = "#3a3a3a"),
                        onMouseLeave: (e) => !isLoading && (e.currentTarget.style.backgroundColor = "#262626"),
                        children: [
                          /* @__PURE__ */ jsxs(
                            "svg",
                            {
                              xmlns: "http://www.w3.org/2000/svg",
                              width: "16",
                              height: "16",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "white",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              children: [
                                /* @__PURE__ */ jsx("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }),
                                /* @__PURE__ */ jsx("path", { d: "M5 3v4" }),
                                /* @__PURE__ */ jsx("path", { d: "M19 17v4" }),
                                /* @__PURE__ */ jsx("path", { d: "M3 5h4" }),
                                /* @__PURE__ */ jsx("path", { d: "M17 19h4" })
                              ]
                            }
                          ),
                          isLoading ? "Running..." : "Run"
                        ]
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-8 items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", style: { width: "280px" }, children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "api-key", className: "text-base font-semibold block", children: "API Key" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Your Maya API key for authentication" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "flex min-w-0 shrink grow p-1 border border-input rounded-md", children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "api-key",
              type: "text",
              placeholder: "maya_YOUR_API_KEY_HERE",
              value: apiKey,
              onChange: (e) => setApiKey(e.target.value),
              className: "min-w-0 flex-auto shrink grow bg-transparent p-1 text-inherit placeholder:text-muted-foreground focus:outline-none disabled:pointer-events-none font-mono text-sm"
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-8 items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", style: { width: "280px" }, children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "voice-id", className: "text-base font-semibold block", children: "Voice ID" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Choose a voice for speech synthesis" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
            VoicePicker,
            {
              voices,
              value: voiceId,
              onValueChange: setVoiceId,
              placeholder: "Select a voice..."
            }
          ) })
        ] }),
        isLoading && !audioUrl && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-32" }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-gray-50 border rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-12 w-12 rounded-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-2/3" })
            ] }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10 rounded-full" })
          ] }) })
        ] }),
        audioUrl && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Generated Audio" }),
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-gray-50 border rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handlePlayPause,
                className: "flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                style: { backgroundColor: "#262626" },
                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#3a3a3a",
                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "#262626",
                title: isPlaying ? "Pause" : "Play",
                children: isPlaying ? /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "white",
                    stroke: "white",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsx("rect", { x: "6", y: "4", width: "4", height: "16" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "4", width: "4", height: "16" })
                    ]
                  }
                ) : /* @__PURE__ */ jsx(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 24 24",
                    fill: "white",
                    stroke: "white",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: /* @__PURE__ */ jsx("polygon", { points: "5 3 19 12 5 21 5 3" })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleDownload,
                className: "flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors",
                title: "Download",
                children: /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    children: [
                      /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                      /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
                      /* @__PURE__ */ jsx("line", { x1: "12", x2: "12", y1: "15", y2: "3" })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 ml-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: isPlaying ? "Playing..." : "Ready to play" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-400 mt-1", children: [
                "Voice: ",
                voices.find((v) => v.voiceId === voiceId)?.name || voiceId
              ] })
            ] })
          ] }) })
        ] }),
        output && !audioUrl && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm font-medium", children: "Output" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => copyToClipboard(output),
                className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
                children: "Copy"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("pre", { className: "p-4 bg-gray-50 border rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto", children: /* @__PURE__ */ jsx("code", { children: output }) })
        ] })
      ] }),
      contentTab === "similar" && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-3 pt-4", children: voices.map((voice, index) => /* @__PURE__ */ jsxs("div", { className: "group/octave-voice-card flex min-h-24 flex-row gap-0 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-full shrink-0 items-center py-2.5 pl-2 pr-4", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group/voice-card relative aspect-square shrink-0 rounded size-20 grid place-content-center overflow-hidden bg-gradient-to-b from-blue-300 to-blue-300",
            "data-index": index % 6,
            children: [
              voice.previewUrl && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gray-200" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid place-content-center", children: /* @__PURE__ */ jsx(
                "button",
                {
                  className: "relative grid size-8 place-content-center rounded-full bg-white/80 text-gray-800 outline-none hover:bg-white/100",
                  onClick: () => handlePreviewPlay(voice),
                  children: previewPlayingVoiceId === voice.voiceId ? /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: 24,
                      height: 24,
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: 2,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      className: "size-4",
                      children: [
                        /* @__PURE__ */ jsx("rect", { x: "6", y: "4", width: "4", height: "16", fill: "currentColor" }),
                        /* @__PURE__ */ jsx("rect", { x: "14", y: "4", width: "4", height: "16", fill: "currentColor" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: 24,
                      height: 24,
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: 2,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      className: "size-4 [&_path]:fill-current",
                      children: /* @__PURE__ */ jsx("path", { d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" })
                    }
                  )
                }
              ) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 shrink grow flex-col items-start justify-center gap-1 py-4 pl-0", children: [
          /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-0", children: /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-base/5 font-medium", children: voice.name }) }),
          /* @__PURE__ */ jsx("div", { className: "flex w-full items-center gap-0", children: /* @__PURE__ */ jsx("span", { className: "min-w-0 flex-1 truncate text-sm/4 font-normal text-gray-600", children: voice.description }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-row items-center justify-end gap-1 px-4 py-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "box-border inline-flex items-center justify-center gap-1.5 border font-medium cursor-pointer focus:outline-none focus-visible:ring rounded-full grow-0 no-underline h-9 px-4 text-sm leading-4 border-gray-200 bg-transparent hover:bg-gray-100",
              type: "button",
              children: "Info"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setVoiceId(voice.voiceId);
                setContentTab("generate");
              },
              className: "box-border inline-flex items-center justify-center gap-1.5 border font-medium cursor-pointer focus:outline-none focus-visible:ring rounded-full grow-0 no-underline h-9 px-4 text-sm leading-4 border-gray-200 bg-transparent hover:bg-gray-100 shrink-0",
              children: "Use Voice"
            }
          )
        ] })
      ] }, voice.voiceId)) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-[32rem] flex flex-col overflow-hidden bg-[#1e1e1e]", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b border-gray-800 bg-[#1e1e1e]", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("python"),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "python" ? "text-blue-400 border-blue-400 bg-[#252526]" : "text-gray-400 hover:text-gray-300 border-transparent"}`,
            children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" }) }),
              "Python"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("javascript"),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "javascript" ? "text-blue-400 border-blue-400 bg-[#252526]" : "text-gray-400 hover:text-gray-300 border-transparent"}`,
            children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" }) }),
              "Javascript"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveTab("curl"),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "curl" ? "text-blue-400 border-blue-400 bg-[#252526]" : "text-gray-400 hover:text-gray-300 border-transparent"}`,
            children: [
              /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "w-4 h-4", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("polyline", { points: "16 18 22 12 16 6" }),
                /* @__PURE__ */ jsx("polyline", { points: "8 6 2 12 8 18" })
              ] }),
              "curl"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-[#1e1e1e]", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (activeTab === "python") copyToClipboard(getPythonCode());
              else if (activeTab === "javascript") copyToClipboard(getJavaScriptCode());
              else copyToClipboard(getCurlCommand());
            },
            className: "absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded",
            title: "Copy code",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) })
          }
        ),
        activeTab === "python" && /* @__PURE__ */ jsxs("div", { className: "pb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4 pt-4 pb-4", children: /* @__PURE__ */ jsx("pre", { className: "m-0 p-4 overflow-auto", style: {
            background: "rgb(30, 30, 30)",
            fontSize: "13px",
            fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
            color: "rgb(212, 212, 212)"
          }, children: /* @__PURE__ */ jsxs("code", { children: [
            "pip ",
            /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "install" }),
            " maya-py"
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsx("pre", { className: "m-0 p-4 overflow-auto flex", style: {
            background: "rgb(30, 30, 30)",
            fontSize: "13px",
            fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
            color: "rgb(212, 212, 212)",
            lineHeight: "1.5"
          }, children: /* @__PURE__ */ jsxs("code", { className: "flex", children: [
            /* @__PURE__ */ jsxs("span", { style: {
              minWidth: "2.25em",
              paddingRight: "1em",
              textAlign: "right",
              userSelect: "none",
              color: "rgb(106, 153, 85)",
              display: "inline-block"
            }, children: [
              /* @__PURE__ */ jsx("div", { children: "1" }),
              /* @__PURE__ */ jsx("div", { children: "2" }),
              /* @__PURE__ */ jsx("div", { children: "3" }),
              /* @__PURE__ */ jsx("div", { children: "4" }),
              /* @__PURE__ */ jsx("div", { children: "5" }),
              /* @__PURE__ */ jsx("div", { children: "6" }),
              /* @__PURE__ */ jsx("div", { children: "7" }),
              /* @__PURE__ */ jsx("div", { children: "8" }),
              /* @__PURE__ */ jsx("div", { children: "9" })
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "from" }),
                " maya_py ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "import" }),
                " Maya"
              ] }),
              /* @__PURE__ */ jsx("div", { children: " " }),
              /* @__PURE__ */ jsxs("div", { children: [
                "maya ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " Maya(api_key ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " ",
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  apiKey,
                  '"'
                ] }),
                ")"
              ] }),
              /* @__PURE__ */ jsx("div", { children: " " }),
              /* @__PURE__ */ jsxs("div", { children: [
                "result ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " maya.tts_generate("
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  ",
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  text.length > 45 ? text.substring(0, 45) + "..." : text,
                  '"'
                ] }),
                ","
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  voice_id",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  voiceId,
                  '"'
                ] }),
                ","
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  stream",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: stream ? "True" : "False" })
              ] }),
              /* @__PURE__ */ jsx("div", { children: ")" })
            ] })
          ] }) }) })
        ] }),
        activeTab === "javascript" && /* @__PURE__ */ jsxs("div", { className: "pb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4 pt-4 pb-4", children: /* @__PURE__ */ jsx("pre", { className: "m-0 p-4 overflow-auto", style: {
            background: "rgb(30, 30, 30)",
            fontSize: "13px",
            fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
            color: "rgb(212, 212, 212)"
          }, children: /* @__PURE__ */ jsxs("code", { children: [
            "npm ",
            /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "install" }),
            " maya-js"
          ] }) }) }),
          /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsx("pre", { className: "m-0 p-4 overflow-auto flex", style: {
            background: "rgb(30, 30, 30)",
            fontSize: "13px",
            fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
            color: "rgb(212, 212, 212)",
            lineHeight: "1.5"
          }, children: /* @__PURE__ */ jsxs("code", { className: "flex", children: [
            /* @__PURE__ */ jsxs("span", { style: {
              minWidth: "2.25em",
              paddingRight: "1em",
              textAlign: "right",
              userSelect: "none",
              color: "rgb(106, 153, 85)",
              display: "inline-block"
            }, children: [
              /* @__PURE__ */ jsx("div", { children: "1" }),
              /* @__PURE__ */ jsx("div", { children: "2" }),
              /* @__PURE__ */ jsx("div", { children: "3" }),
              /* @__PURE__ */ jsx("div", { children: "4" }),
              /* @__PURE__ */ jsx("div", { children: "5" }),
              /* @__PURE__ */ jsx("div", { children: "6" }),
              /* @__PURE__ */ jsx("div", { children: "7" }),
              /* @__PURE__ */ jsx("div", { children: "8" }),
              /* @__PURE__ */ jsx("div", { children: "9" })
            ] }),
            /* @__PURE__ */ jsxs("span", { style: { flex: 1 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "const" }),
                " Maya ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "require" }),
                "(",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(206, 145, 120)" }, children: "'maya-js'" }),
                ");"
              ] }),
              /* @__PURE__ */ jsx("div", { children: " " }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "const" }),
                " maya ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "new" }),
                " Maya(",
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  apiKey,
                  '"'
                ] }),
                ");"
              ] }),
              /* @__PURE__ */ jsx("div", { children: " " }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "const" }),
                " result ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(212, 212, 212)" }, children: "=" }),
                " ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "await" }),
                " maya.ttsGenerate(",
                "{"
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  text: ",
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  text.length > 40 ? text.substring(0, 40) + "..." : text,
                  '"'
                ] }),
                ","
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  voiceId: ",
                /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                  '"',
                  voiceId,
                  '"'
                ] }),
                ","
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "  stream: ",
                /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: stream.toString() })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                "}",
                ");"
              ] })
            ] })
          ] }) }) })
        ] }),
        activeTab === "curl" && /* @__PURE__ */ jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsx("div", { className: "px-4 pt-4", children: /* @__PURE__ */ jsx("pre", { className: "m-0 p-4 overflow-auto flex", style: {
          background: "rgb(30, 30, 30)",
          fontSize: "13px",
          fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
          color: "rgb(212, 212, 212)",
          lineHeight: "1.5"
        }, children: /* @__PURE__ */ jsxs("code", { className: "flex", children: [
          /* @__PURE__ */ jsxs("span", { style: {
            minWidth: "2.25em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
            color: "rgb(106, 153, 85)",
            display: "inline-block"
          }, children: [
            /* @__PURE__ */ jsx("div", { children: "1" }),
            /* @__PURE__ */ jsx("div", { children: "2" }),
            /* @__PURE__ */ jsx("div", { children: "3" }),
            /* @__PURE__ */ jsx("div", { children: "4" }),
            /* @__PURE__ */ jsx("div", { children: "5" }),
            /* @__PURE__ */ jsx("div", { children: "6" }),
            /* @__PURE__ */ jsx("div", { children: "7" }),
            /* @__PURE__ */ jsx("div", { children: "8" })
          ] }),
          /* @__PURE__ */ jsxs("span", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(86, 156, 214)" }, children: "curl" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "--location" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(206, 145, 120)" }, children: "'https://v3.mayaresearch.ai/v1/tts/generate'" }),
              " \\"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "--header" }),
              " ",
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(206, 145, 120)" }, children: "'Content-Type: application/json'" }),
              " \\"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "--header" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                "'X-API-Key: ",
                apiKey,
                "'"
              ] }),
              " \\"
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { color: "rgb(220, 220, 170)" }, children: "--data" }),
              " ",
              /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
                "'",
                "{"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
              '  "voice_id": "',
              voiceId,
              '",'
            ] }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
              '  "text": "',
              text.length > 35 ? text.substring(0, 35) + "..." : text,
              '",'
            ] }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("span", { style: { color: "rgb(206, 145, 120)" }, children: [
              '  "stream": ',
              stream.toString()
            ] }) }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { style: { color: "rgb(206, 145, 120)" }, children: "}'}" }) })
          ] })
        ] }) }) }) })
      ] })
    ] }) })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Text to Speech - Maya Research" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TextToSpeechPage", TextToSpeechPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/text-to-speech/_components/TextToSpeechPage", "client:component-export": "default" })} ` })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/text-to-speech/index.astro", void 0);

const $$file = "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/text-to-speech/index.astro";
const $$url = "/dashboard/text-to-speech";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
