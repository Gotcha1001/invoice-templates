export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url, { mode: "cors" }); // Explicitly enable CORS in fetch
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return ""; // Fallback to no image
  }
}
