import { useState } from "react";


type ProfileInputProps = {
  onChange: (url: string, blob: Blob) => void,
}

const ProfileInput = ({ onChange }: ProfileInputProps) => {
  const [imageURL, setImageURL] = useState<string>("");

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = true;
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      const imageSize = image.width < image.height ? image.width : image.height;
      const canvasSize = imageSize > 360 ? 360 : imageSize;

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      context.drawImage(image, (image.width - imageSize) / 2, (image.height - imageSize) / 2, imageSize, imageSize, 0, 0, canvasSize, canvasSize);
      const dataURL = canvas.toDataURL("image/jpeg");

      if (!dataURL) return;

      setImageURL(dataURL);

      canvas.toBlob((blob) => {
        if (blob) {
          onChange(dataURL, blob);
        }
      }, "image/jpeg");
    };
  }

  return (
    <div className="flex w-full justify-center">
      <label htmlFor='file'>
        <div className="w-[180px] h-[180px] bg-[#FAF9F9] rounded-[30px] cursor-pointer">
          <img className="absolute w-[180px] h-[180px] rounded-[30px]" src={imageURL === "" ? "/assets/icons/profile.svg" : imageURL} />
          <div className="relative top-[157px] left-[157px] flex justify-center items-center w-[46px] h-[46px] bg-[#FAF9F9] rounded-full shadow-md">
            <img src="/assets/icons/camera.svg" />
          </div>
        </div>
      </label>
      <input className="hidden" id="file" type="file" accept="image/*" onChange={handleChangeImage} />
    </div >
  );
};

export default ProfileInput;
