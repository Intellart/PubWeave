/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {
  useEffect,
  useRef,
} from 'react';
import {
  isEmpty, map, indexOf, filter, includes, size,
} from 'lodash';
import classNames from 'classnames';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from '@mui/material';

type Props = {
  linkList: Array<string>,
  currentImage: string,
  onImageSelection: (index: number) => void,
};

function ImageSelection (props: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(-1);

  const _linkList = filter(props.linkList, (link) => includes(link, 'http://res.cloudinary.com'));

  const hasNonCloudinaryLinks = size(props.linkList) !== size(_linkList);

  const oldSelectedImageIndex = indexOf(_linkList, props.currentImage);

  const parentRef = useRef(null);
  const selectedImageRef = useRef(null);

  // custom image
  // const customImageRef = useRef(null);
  const [customImageUrl, setCustomImageUrl] = React.useState(null);

  useEffect(() => {
    if (selectedImageRef.current) {
      // console.log('selectedImageRef.current', selectedImageRef.current);
    }
  }, [selectedImageRef]);

  // const uploadCustomImage = () => {
  //   customImageRef.current?.click();
  // };

  const handleNewImageSelection = (newIndex) => {
    if (selectedImageIndex === newIndex) {
      setSelectedImageIndex(-1);
    } else {
      setSelectedImageIndex(newIndex);
    }
  };

  const linkList = [
    ..._linkList,
  ];

  // eslint-disable-next-line no-unused-vars
  const addNewImage = (e) => {
    if (!e.target.files) {
      return;
    }

    setCustomImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  if (isEmpty(_linkList)) return null;

  return (
    <div className='editor-wrapper-image-selection-wrapper'>
      {hasNonCloudinaryLinks && (
      <Alert
        sx={{
          width: 'calc(100% - 150px)',
          marginTop: '20px',

        }}
        severity="warning"
      >
        For thumbnail, please use (local) image you have already used in your article.
      </Alert>
      )}
      {!isEmpty(_linkList) && (
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
        {/* <input
          type="file"
          ref={customImageRef}
          onChange={uploadNewImage}
          style={{ display: 'none' }}
        /> */}
        {/* <div
          className={classNames('editor-wrapper-image-selection-actions-select')}
          onClick={() => {
            uploadCustomImage();
          }}
        >
          Select custom thumbnail image
        </div> */}
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
