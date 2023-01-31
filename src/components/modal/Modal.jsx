import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './modal.module.css';

export const Modal = ({ currentImage = '', closeModal }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    window.addEventListener('keydown', this.handleKeyDown);
    return () => window.removeEventListener('keydown', this.handleKeyDown);
  }, []);

  const handleKeyDown = e => {
    if (e.code !== 'Escape') return;
    closeModal();
  };

  const handleOverlayClick = e => {
    const { current } = overlayRef;
    if (current && e.target !== current) {
      return;
    }
    closeModal();
  };

  return (
    <div
      className={css.Overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className={css.Modal}>
        <img src={currentImage} alt="" />
      </div>
    </div>
  );
};

Modal.propTypes = {
  currentImage: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};
