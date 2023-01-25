/* eslint-disable no-console */ import React, {
  useEffect,
  useRef,
} from 'react';
import { isEmpty, map } from 'lodash';
import classNames from 'classnames';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  linkList: Array<string>,
  oldSelectedImageIndex: number,
  onImageSelection: (index: number) => void,
};

function ImageSelection (props: Props) {
  const [alternateLinkImage, setAlternateLinkImage] = React.useState('');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(-1);
  const ref = useRef(null);
  const selectedImageRef = useRef(null);

  console.log(selectedImageIndex);

  useEffect(() => {
    if (selectedImageRef.current) {
      console.log('selectedImageRef.current', selectedImageRef.current);
    }
  }, [selectedImageRef]);

  const handleNewImageSelection = (newIndex) => {
    if (selectedImageIndex === newIndex) {
      setSelectedImageIndex(-1);
    } else {
      setSelectedImageIndex(newIndex);
    }
  };

  const linkList = [
    ...props.linkList,
    ...(alternateLinkImage !== '') ? [alternateLinkImage] : [],
  ];

  return (
    <div className='editor-wrapper-image-selection-wrapper'>
      {!isEmpty(props.linkList) && (
      <>
        <div
          onClick={() => {
            ref.current.scrollTo({
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
            ref.current.scrollTo({
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
        ref={ref}
        className='editor-wrapper-image-selection'
      >
        {(!isEmpty(props.linkList) || alternateLinkImage) && map(linkList, (link, index) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
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
              oldSelected: index === props.oldSelectedImageIndex,
            })}
            src={link}
            alt="selection_image"
          />
        ))
      }
      </div>
      <div className='editor-wrapper-image-selection-actions'>
        {(!isEmpty(props.linkList) || alternateLinkImage) ? (
          <div
            className={classNames('editor-wrapper-image-selection-actions-select',
              { disabled: selectedImageIndex === props.oldSelectedImageIndex && selectedImageIndex !== -1 })}
            onClick={() => {
              if (selectedImageIndex !== -1) { props.onImageSelection(linkList[selectedImageIndex]); }
            }}
          >
            Select thumbnail image
          </div>
        )
          : (
            <div
              className='editor-wrapper-image-selection-actions-select'
              onClick={() => {
                setAlternateLinkImage('https://i.imgur.com/1Z5Q1Zm.png');
              }}
            >
              Upload thumbnail image
            </div>
          )}

      </div>
    </div>
  );
}

export default ImageSelection;
