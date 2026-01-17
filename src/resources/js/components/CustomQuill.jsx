/**
 * CustomQuill Component
 *
 * This component requires quill and react-quill-new packages to be installed.
 * To use this component, run:
 *   npm install quill react-quill-new
 *
 * Currently disabled to prevent build errors when dependencies are not installed.
 */

const CustomQuill = (props) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-muted"
      style={{ minHeight: '200px', border: '1px dashed #ccc', borderRadius: '4px' }}
    >
      <span>Quill editor not configured. Install quill packages to enable.</span>
    </div>
  );
};

export default CustomQuill;
