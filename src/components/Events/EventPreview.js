const EventPreview = ({ preview }) => {
    const defaultImage = "/images/default-event.jpg";

    return (
        <div className="preview-container">
            <h2>Live Preview</h2>

            {/* --- IMAGE PREVIEW --- */}
            <img
                src={preview.imagePreview || defaultImage}
                alt="Event Preview"
                className="preview-image"
            />

            <h3>{preview.title}</h3>
            <p>{preview.description}</p>

            <p><strong>Date:</strong> {preview.date}</p>
            <p><strong>Time:</strong> {preview.time}</p>
            <p><strong>Location:</strong> {preview.location}</p>
        </div>
    );
};

export default EventPreview;
