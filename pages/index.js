import AudioWrapper from "@/components/AudioWrapper";

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
          fontSize: "2rem",
          fontFamily: "sans-serif",
        }}
      >
        <AudioWrapper />
      </div>
    </>
  );
}
