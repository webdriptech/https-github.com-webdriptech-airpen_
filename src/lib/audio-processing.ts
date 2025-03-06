// Real implementation using AssemblyAI for transcription

const ASSEMBLYAI_API_KEY = import.meta.env.VITE_ASSEMBLYAI_API_KEY;

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    console.log("Transcribing audio of size:", audioBlob.size);

    // Step 1: Upload the audio file to AssemblyAI
    const uploadUrl = await uploadToAssemblyAI(audioBlob);
    if (!uploadUrl) {
      throw new Error("Failed to upload audio to AssemblyAI");
    }

    // Step 2: Start the transcription process
    const transcriptId = await startTranscription(uploadUrl);
    if (!transcriptId) {
      throw new Error("Failed to start transcription");
    }

    // Step 3: Poll for the transcription result
    const transcription = await pollForTranscriptionResult(transcriptId);
    return transcription;
  } catch (error) {
    console.error("Error in transcription process:", error);
    // Return a fallback transcription if the real one fails
    return "This is a fallback transcription. The actual transcription service encountered an error. Please try recording again or check your internet connection.";
  }
}

async function uploadToAssemblyAI(audioBlob: Blob): Promise<string> {
  try {
    const response = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: await audioBlob.arrayBuffer(),
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.upload_url;
  } catch (error) {
    console.error("Error uploading to AssemblyAI:", error);
    return "";
  }
}

async function startTranscription(audioUrl: string): Promise<string> {
  try {
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        Authorization: ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        speaker_labels: true,
        entity_detection: true,
        summarization: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Transcription request failed with status: ${response.status}`,
      );
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error("Error starting transcription:", error);
    return "";
  }
}

async function pollForTranscriptionResult(
  transcriptId: string,
): Promise<string> {
  const maxAttempts = 60; // 5 minutes maximum (with 5-second intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          method: "GET",
          headers: {
            Authorization: ASSEMBLYAI_API_KEY,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Polling failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "completed") {
        return data.text;
      } else if (data.status === "error") {
        throw new Error(`Transcription error: ${data.error}`);
      }

      // Wait 5 seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    } catch (error) {
      console.error("Error polling for transcription:", error);
      throw error;
    }
  }

  throw new Error("Transcription timed out");
}

export async function uploadAudioToStorage(
  audioBlob: Blob,
  fileName: string,
): Promise<string> {
  // For now, we'll use a mock URL since we don't have a storage service set up
  // In a real implementation, you would upload to a service like Firebase Storage, AWS S3, etc.
  console.log("Uploading audio to storage:", fileName);

  // Create a mock URL that would represent where the audio is stored
  return `https://storage.example.com/recordings/${fileName}-${Date.now()}.wav`;
}
