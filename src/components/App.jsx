import { useState, useEffect } from 'react';
import { fetchImages } from 'services/api';
import { Searchbar } from 'components/searchBar/Searchbar';
import { ImageGallery } from 'components/imageGallery/ImageGallery';
import { Button } from 'components/button/Button';
import { Preloader } from './loader/Preloader';
import { Modal } from 'components/modal/Modal';
import { Notification } from 'components/notification/Notification';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState(null);

  const timer = () => {
    setTimeout(() => setIsLoading(false), 1000);
  };

  const mapper = images => {
    return images.map(
      ({ webformatURL: smallImage, largeImageURL: largeImage, ...props }) => ({
        smallImage,
        largeImage,
        ...props,
      })
    );
  };

  useEffect(() => {
    setIsLoading(true);
    fetchImages()
      .then(({ data }) => setImages(mapper(data.hits)))
      .catch(error => setError({ error }))
      .finally(timer());
  }, []);

  const handleChange = e => setQuery(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    setImages([]);
    setIsLoading(true);
    fetchImages(query, 1)
      .then(({ data }) => setImages(mapper(data.hits)))
      .catch(() => setError({ error }))
      .finally(timer());
  };

  const scroll = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };
  const handleClick = () => {
    setIsLoading(true);
    fetchImages(query, page + 1)
      .then(({ data }) => {
        setImages(images => [...images, mapper(data.hits)]);
        setPage(page => page + 1);
        return data;
      })
      .then(() => scroll())
      .catch(() => setError({ error }))
      .finally(timer());
  };

  const openModal = e => {
    e.preventDefault();
    setIsOpen(true);
    setCurrentImage(e.target.getAttribute('data-large'));
    setIsLoading(true);
    timer();
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentImage('');
  };

  return (
    <section className="App">
      <Searchbar
        query={query}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {(images.length > 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )) || <Notification text="No results were found for your request!" />}

      {isLoading && <Preloader />}
      {error && <Notification text={error.message} />}
      {images.length > 0 && <Button handleClick={handleClick} />}
      {isOpen && <Modal closeModal={closeModal} currentImage={currentImage} />}
    </section>
  );
};
