/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  useEffect,
  useRef,
} from 'react';
import {
  isEmpty, map, indexOf,
} from 'lodash';
import classNames from 'classnames';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  linkList: Array<string>,
  currentImage: string,
  onImageSelection: (index: number) => void,
};

function ImageSelection (props: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(-1);

  const oldSelectedImageIndex = indexOf(props.linkList, props.currentImage);

  const parentRef = useRef(null);
  const selectedImageRef = useRef(null);

  // custom image
  const customImageRef = useRef(null);
  const [customImageUrl, setCustomImageUrl] = React.useState(null);

  useEffect(() => {
    if (selectedImageRef.current) {
      // console.log('selectedImageRef.current', selectedImageRef.current);
    }
  }, [selectedImageRef]);

  const uploadCustomImage = () => {
    customImageRef.current?.click();
  };

  const handleNewImageSelection = (newIndex) => {
    if (selectedImageIndex === newIndex) {
      setSelectedImageIndex(-1);
    } else {
      setSelectedImageIndex(newIndex);
    }
  };

  const linkList = [
    ...props.linkList,
  ];

  // eslint-disable-next-line no-unused-vars
  const addNewImage = (e) => {
    if (!e.target.files) {
      return;
    }

    setCustomImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  // eslint-disable-next-line no-unused-vars
  const uploadNewImage = (e) => {
    if (!e.target.files) {
      return;
    }

    const file: File = e.target.files[0];

    console.log(e.target.files[0]);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '');
    data.append('cloud_name', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '');

    return fetch(`${process.env.REACT_APP_CLOUDINARY_UPLOAD_URL || ''}${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || ''}/image/upload`, {
      method: 'post',
      body: data,
    }).then((res) => res.json())
      .then((d) => {
        console.log(d);
        // updateUser(get(user, 'id'), { profile_img: d.url });
        setCustomImageUrl(d.url);
        props.onImageSelection(d.url);
      }).catch((err) => console.log(err));
  };

  return (
    <div className='editor-wrapper-image-selection-wrapper'>
      {!isEmpty(props.linkList) && (
      <>
        <div
          onClick={() => {
            parentRef.current.scrollTo({
              left: 0,
              behavior: 'smooth',
            });
          }}
          className='editor-wrapper-image-selection-arrow-left'
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
        <div
          onClick={() => {
            parentRef.current.scrollTo({
              left: 5000,
              behavior: 'smooth',
            });
          }}
          className='editor-wrapper-image-selection-arrow-right'
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </>
      )}
      <div
        ref={parentRef}
        className='editor-wrapper-image-selection'
      >
        {(!isEmpty(linkList)) && map(linkList, (link, index) => (
          <img
            id={`editor-wrapper-image-selection-image-${index}`}
            onClick={() => {
              handleNewImageSelection(index);
              setTimeout(() => {
                document.getElementById(`editor-wrapper-image-selection-image-${index}`).scrollIntoView(
                  { behavior: 'smooth', block: 'nearest', inline: 'center' });
              }, 250);
            }}
            key={index}
            className={classNames('editor-wrapper-image-selection-image', {
              selected: index === selectedImageIndex,
              oldSelected: index === oldSelectedImageIndex,
            })}
            src={link}
            alt="selection_image"
          />
        ))}
        {customImageUrl && (
        <img
          id="editor-wrapper-image-selection-image--1"
          onClick={() => {
            handleNewImageSelection(-2);
            setTimeout(() => {
              document.getElementById('editor-wrapper-image-selection-image--1').scrollIntoView(
                { behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 250);
          }}
          className={classNames('editor-wrapper-image-selection-image', {
            selected: selectedImageIndex === -2,
            oldSelected: oldSelectedImageIndex === -2,
          })}
          src={customImageUrl}
          alt="selection_image"
        />
        )}
      </div>
      <div className='editor-wrapper-image-selection-actions'>
        <input
          type="file"
          ref={customImageRef}
          onChange={uploadNewImage}
          style={{ display: 'none' }}
        />
        <div
          className={classNames('editor-wrapper-image-selection-actions-select')}
          onClick={() => {
            uploadCustomImage();
          }}
        >
          Select custom thumbnail image
        </div>
        {(!isEmpty(linkList)) && (
          <div
            className={classNames('editor-wrapper-image-selection-actions-select',
              { disabled: selectedImageIndex === oldSelectedImageIndex && selectedImageIndex !== -1 })}
            onClick={() => {
              if (selectedImageIndex !== -1) { props.onImageSelection(linkList[selectedImageIndex]); }
            }}
          >
            Select thumbnail image
          </div>
        )}

      </div>
    </div>
  );
}

export default ImageSelection;
