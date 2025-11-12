import "./Controls.css";
import { useState, useCallback, useRef } from "react";
import { saveAs } from "file-saver";
import { generateThumbnailFile } from "./ImageScalar";
import { useDropzone } from "react-dropzone";
import { Modal, Button, buttonClasses } from "./DialogBoxes";

const DropZoneFileInput = ({ onChange, onDropRejected, maxFiles }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onChange,
    maxFiles,
    maxSize: 4e6,
    onDropRejected,
  });

  return (
    <div
      className={"dropzone " + (isDragActive ? "active" : "")}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div>Drop the files here ...</div>
      ) : (
        <div>Drag image, or click to select</div>
      )}
    </div>
  );
};

export const generateThumbAndAdd = async ({
  pointData,
  imageFiles,
  addNewPointHook,
  mainIndex,
}) => {
  console.log({ pointData, imageFiles, addNewPointHook, mainIndex });

  pointData.public === "true"
    ? (pointData.public = true)
    : (pointData.public = false);
  const thumbnail =
    imageFiles.length > 0 &&
    (await generateThumbnailFile(imageFiles[mainIndex], 150));
  addNewPointHook({ pointData, imageFiles, thumbnail });
  // reset things
};

const AddPointDialog = ({ addNewPointHook, closePointDialog, user }) => {
  const maxFiles = 5;

  const [errorMessge, setErrorMessage] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);

  const form = useRef(null);

  // Handles input change event and updates state
  async function fileChange(uploads) {
    if (!uploads || uploads.length < 1) return;
    const stagedImages = [];

    for (const upload of uploads) {
      stagedImages.push(upload);
    }
    // set the main file for upload
    setImageFiles(stagedImages);
  }

  const handleSubmit = async (e) => {
    console.log("submitting", e);
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const pointData = Object.fromEntries(formData.entries());
    await generateThumbAndAdd({
      pointData,
      imageFiles,
      addNewPointHook,
      mainIndex,
    });

    setImageFiles([]);
    closePointDialog();
  };

  const submitForm = useCallback(
    () =>
      form.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      ),
    [form]
  );

  const ImagePreview = (file, i) => {
    const src = URL.createObjectURL(file);

    return (
      <div className={`relative`}>
        {i == mainIndex ? (
          <div className="absolute bottom-1 left-1">⭐️</div>
        ) : null}
        <img
          onClick={() => setMainIndex(i)}
          className={`max-w-xs max-h-24`}
          src={src}
        ></img>
      </div>
    );
  };

  return (
    <Modal
      title={"Add location"}
      setShowModal={closePointDialog}
      customButtons={[
        <Button onClick={submitForm} addClasses={"text-blue-500"}>
          Submit
        </Button>,
      ]}
    >
      <h3 className="text-3xl font-semibold">
        This tool is a work in progress. In the future you will be able to add
        your own locations, but at the moment this is restricted to admins.
      </h3>
      <form className="w-96" ref={form} onSubmit={handleSubmit}>
        <label>
          Location name:
          <input
            className="border"
            ref={(input) => {
              input && input.focus();
            }}
            autoFocus
            name="name"
            type="text"
          />
        </label>

        <div className="p-5 flex-0 flex flex-wrap gap-1 justify-around">
          {imageFiles.map(ImagePreview)}
        </div>
        {/* {thumbnailPreview ? <img src={thumbnailPreview} alt="thumbnail" /> : null} */}
        {/* <input type="file" accept="image/*" onChange={fileChange} /> */}
        {imageFiles.length >= maxFiles ? null : (
          <DropZoneFileInput
            onChange={fileChange}
            onDropRejected={console.error}
            maxFiles={maxFiles}
          />
        )}

        {errorMessge ? <div>Error: {errorMessge}</div> : null}
        <label>
          Images by:
          <input
            className="border italic"
            name="credit"
            type="text"
            placeholder={user.displayName}
          />
        </label>
        <label>
          Share publically:
          <input name="public" data-val="false" value="false" type="checkbox" />
        </label>
        <div>
          <input hidden type="submit" value="💾" />
        </div>
      </form>
    </Modal>
  );
};

export const SearchBox = ({ locations = [], onSearch, onSelect, onClear }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      onSearch?.([]);
      return;
    }

    const filtered = locations
      .filter(
        (loc) =>
          loc.name.toLowerCase().includes(value.toLowerCase()) ||
          (loc.tags &&
            loc.tags.join(" ").toLowerCase().includes(value.toLowerCase()))
      )
      .slice(0, 10);

    setResults(filtered);
    onSearch?.(filtered);
  };

  const handleSelect = (value) => {
    setQuery(value.name);
    setResults([]);
    onSelect?.(value);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onClear?.();
    onSearch?.([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) handleSelect(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-gray-100 border-b border-gray-400 flex flex-col p-2 m-1"
    >
      <div className="flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type to search..."
          className="flex-grow bg-white border border-gray-400 p-1 text-gray-800 focus:outline-none focus:border-black"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 px-2 bg-stone-200 text-black text-sm hover:bg-stone-300 border border-slate-300 hover:border-slate-400"
          >
            Clear
          </button>
        )}
      </div>

      <ul className="absolute left-0 right-0 top-full bg-white border border-gray-400 border-t-0 z-10">
        {results.map((loc, i) => {
          const cityTag = loc.tags?.find((t) => t.includes("city:"));
          const city = cityTag ? cityTag.split(":")[1] : null;

          return (
            <li
              key={i}
              onClick={() => handleSelect(loc)}
              className="p-1 text-gray-800 hover:bg-stone-200 cursor-pointer text-sm flex items-center"
            >
              <span className="flex-grow">
                {loc.name || "Unnamed location"}
              </span>
              {city && (
                <span className="text-slate-600 text-xs ml-2 pl-2 border-l border-slate-300 italic">
                  {city}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </form>
  );
};

const PointInfoCard = ({
  point: {
    name,
    credit,
    coordinates,
    images,
    owned_by_user,
    id,
    tags,
    ...rest
  },
  removePointHook,
  close,
}) => {
  // add button states for feedback
  const downloadImage = (src, i) => saveAs(src, name + i + ".png");
  const copyLink = () => {
    let t = new URL(location.href);
    t.searchParams.set("id", id);
    navigator.clipboard.writeText(t);
  };

  return (
    <div className=" bg-gray-500 border flex-col flex p-2 m-1 ">
      <div className="absolute top-2 right-2 " onClick={close}>
        <button
          type="button"
          class="bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span class="sr-only">Close menu</span>
          <svg
            class="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className=" flex flex-row lg:flex-col gap-1 max-w-lg lg:max-h-128 overflow-scroll">
        {images &&
          images.map((src, i) => (
            <img
              key={i}
              onClick={() => downloadImage(src, i)}
              className=" object-contain loading-spinner rounded-lg h-52 md:h-96 w-auto"
              src={src}
            />
          ))}
      </div>
      <div className="name"> {name}</div>
      <div className="italic">By {credit || "Unknown"}</div>
      {tags && tags.length > 0 ? (
        <div>
          <b>Tagged: </b>
          {tags.join(", ")}
        </div>
      ) : (
        ""
      )}

      <div className="flex">
        {/* <button title="Download" onClick={downloadImage}>⏬</button> */}
        {rest.public ? (
          <button title="Share" onClick={copyLink}>
            🔗
          </button>
        ) : null}
        {owned_by_user ? (
          <button title="Delete" onClick={() => removePointHook(id)}>
            🗑️
          </button>
        ) : null}
      </div>
    </div>
  );
};

export const ControlPanel = ({
  selectedPoints,
  deselectPoint,
  addNewPointHook,
  addPointDialogOpen,
  closePointDialog,
  user,
  removePointHook,
}) => {
  return (
    <div className="flex flex-row  ">
      {user && addPointDialogOpen ? (
        <AddPointDialog
          addNewPointHook={addNewPointHook}
          closePointDialog={closePointDialog}
          user={user}
        />
      ) : null}
      {selectedPoints.length > 0 ? (
        <>
          {selectedPoints.map((p, i) => (
            <PointInfoCard
              removePointHook={removePointHook}
              key={p.coordinates.join()}
              point={p}
              close={() => deselectPoint(i)}
            />
          ))}
        </>
      ) : null}
    </div>
  );
};
