export default function PreviewPane({ html }) {
  return (
    <div className="preview">
      {html ? (
        <iframe
          srcDoc={html}
          style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
        />
      ) : (
        <p>No preview yet.</p>
      )}
    </div>
  );
}
