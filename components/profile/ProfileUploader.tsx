import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@/components/providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getUserProfile } from "@/lib/profile";
import { Loader2, Upload, User } from "lucide-react";

interface ProfileUploaderProps {
  onImageChange: (file: File | null, preview: string | null) => void;
}

export function ProfileUploader({ onImageChange }: ProfileUploaderProps) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function loadProfilePicture() {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        if (mounted) {
          // Use full-size image from Firestore for display
          const photoURL = profile.photoURL || profile.thumbnailURL || null;
          setCurrentPhotoURL(photoURL);
          setPreviewURL(photoURL);
        }
      } catch (error) {
        console.error("Error loading profile picture:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile picture",
        });
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfilePicture();

    return () => {
      mounted = false;
    };
  }, [user, toast]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, or GIF)",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setPreviewURL(base64);
        onImageChange(file, base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleCancel = useCallback(() => {
    setPreviewURL(currentPhotoURL);
    onImageChange(null, null);
  }, [currentPhotoURL, onImageChange]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar className="h-32 w-32">
          {previewURL ? (
            <AvatarImage src={previewURL} alt="Profile" />
          ) : (
            <AvatarFallback>
              <User className="h-16 w-16" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG or GIF (max. 5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {previewURL !== currentPhotoURL && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}