import AudioDropzone from "@/components/AudioDropzone";

export default function Home() {
  return (
    <>
      <div
        style={{
          // center everything
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // make it pretty
          height: "100vh",
          width: "100vw",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontSize: "1rem",
          fontFamily: "sans-serif",
        }}
      >
        <AudioDropzone />
      </div>
    </>
  );
}
