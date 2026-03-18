import os
import re
from youtube_transcript_api import YouTubeTranscriptApi

URLS = [
    "https://youtu.be/dPsfPb-MeP4",
    "https://www.youtube.com/watch?v=AI45oCqiS78",
    "https://www.youtube.com/watch?v=CGWj6mJfYRs",
    "https://www.youtube.com/watch?v=yA2T5Ow-NAw",
    "https://www.youtube.com/watch?v=ChgiqA63hiE",
    "https://www.youtube.com/watch?v=F2VbVqNlswk",
    "https://www.youtube.com/watch?v=K8rcj7fK9NM",
    "https://www.youtube.com/watch?v=zd3Y5IzSWRU",
    "https://www.youtube.com/watch?v=LoCtYsxuYoU",
    "https://www.youtube.com/watch?v=2QsrWOhFDsc",
    "https://www.youtube.com/watch?v=cjFDN3HkaV0",
    "https://www.youtube.com/watch?v=WHCSNZK9dUo",
    "https://www.youtube.com/watch?v=i2dFa1p9Sm0",
    "https://www.youtube.com/watch?v=-I6QPwylOfQ",
    "https://www.youtube.com/watch?v=FLWCyVSEjwM",
    "https://www.youtube.com/watch?v=eEomzqnJQgg",
]

def extract_video_id(url):
    patterns = [
        r"youtu\.be/([^?&]+)",
        r"youtube\.com/watch\?v=([^&]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def fetch_transcript(video_id):
    try:
        ytt = YouTubeTranscriptApi()
        fetched = ytt.fetch(video_id)
        snippets = []
        for snippet in fetched:
            if hasattr(snippet, "text"):
                snippets.append(snippet.text)
            elif isinstance(snippet, dict):
                snippets.append(snippet.get("text", ""))
        return " ".join(snippets)
    except Exception as e:
        return f"ERROR: {e}"

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "transcripts")
    os.makedirs(output_dir, exist_ok=True)

    seen = set()
    for url in URLS:
        video_id = extract_video_id(url)
        if not video_id:
            print(f"SKIP (could not parse URL): {url}")
            continue
        if video_id in seen:
            print(f"SKIP (duplicate): {video_id}")
            continue
        seen.add(video_id)

        print(f"Fetching: {video_id} ... ", end="", flush=True)
        text = fetch_transcript(video_id)

        output_path = os.path.join(output_dir, f"{video_id}.txt")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(f"VIDEO ID: {video_id}\n")
            f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
            f.write("=" * 60 + "\n\n")
            f.write(text)

        if text.startswith("ERROR"):
            print(f"FAILED — {text}")
        else:
            word_count = len(text.split())
            print(f"OK ({word_count} words) → transcripts/{video_id}.txt")

    print(f"\nDone. Transcripts saved to: {output_dir}")

if __name__ == "__main__":
    main()
