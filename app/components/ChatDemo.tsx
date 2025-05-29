"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Send, Bot, User } from "lucide-react"

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!input.trim() && !files?.length) {
      return
    }

    handleSubmit(event, {
      experimental_attachments: files,
    })

    // Reset files after submission
    setFiles(undefined)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setFiles(event.target.files)

      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setFiles(undefined)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bot className="w-6 h-6" />
            ChatBot con Google Gemini
          </CardTitle>
          <p className="text-blue-100 text-sm">
            Envía texto e imágenes para obtener respuestas inteligentes con Gemini AI
          </p>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">¡Hola! Soy tu asistente AI</p>
                  <p className="text-sm">Puedes enviarme texto e imágenes para ayudarte</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`rounded-lg p-4 ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

                      {message?.experimental_attachments
                        ?.filter((attachment) => attachment?.contentType?.startsWith("image/"))
                        .map((attachment, index) => (
                          <div key={`${message.id}-${index}`} className="mt-2">
                            <Image
                              src={attachment.url || "/placeholder.svg"}
                              width={300}
                              height={200}
                              alt={attachment.name ?? `attachment-${index}`}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t bg-gray-50 p-4">
          <form onSubmit={onSubmit} className="w-full space-y-3">
            {/* Preview de archivo seleccionado */}
            {files && files.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {imagePreview && (
                  <div className="relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={60}
                      height={60}
                      className="rounded-md object-cover border border-blue-300"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 font-medium">{files[0].name}</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              {/* Input para archivo */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>

              {/* Input para texto */}
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe tu mensaje aquí..."
                className="flex-1"
                disabled={isLoading}
              />

              {/* Botón enviar */}
              <Button
                type="submit"
                disabled={isLoading || (!input.trim() && !files?.length)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
