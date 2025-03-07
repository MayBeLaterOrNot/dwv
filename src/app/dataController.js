import {ListenerHandler} from '../utils/listen';
import {mergeObjects} from '../utils/operator';

// doc imports
/* eslint-disable no-unused-vars */
import {Image} from '../image/image';
/* eslint-enable no-unused-vars */

/*
 * Data (list of {image, meta}) controller.
 */
export class DataController {

  /**
   * List of {image, meta}.
   *
   * @type {object}
   */
  #data = {};

  /**
   * Listener handler.
   *
   * @type {ListenerHandler}
   */
  #listenerHandler = new ListenerHandler();

  /**
   * Get the length of the data storage.
   *
   * @returns {number} The length.
   */
  length() {
    return Object.keys(this.#data).length;
  }

  /**
   * Reset the class: empty the data storage.
   */
  reset() {
    this.#data = [];
  }

  /**
   * Get a data at a given index.
   *
   * @param {number} index The index of the data.
   * @returns {object} The data.
   */
  get(index) {
    return this.#data[index];
  }

  /**
   * Set the image at a given index.
   *
   * @param {number} index The index of the data.
   * @param {Image} image The image to set.
   */
  setImage(index, image) {
    this.#data[index].image = image;
    // fire image set
    this.#fireEvent({
      type: 'imageset',
      value: [image],
      dataid: index
    });
    // listen to image change
    image.addEventListener('imagechange', this.#getFireEvent(index));
  }

  /**
   * Add a new data.
   *
   * @param {number} index The index of the data.
   * @param {Image} image The image.
   * @param {object} meta The image meta.
   */
  addNew(index, image, meta) {
    if (typeof this.#data[index] !== 'undefined') {
      throw new Error('Index already used in storage: ' + index);
    }
    // store the new image
    this.#data[index] = {
      image: image,
      meta: meta
    };
    // listen to image change
    image.addEventListener('imagechange', this.#getFireEvent(index));
  }

  /**
   * Update the current data.
   *
   * @param {number} index The index of the data.
   * @param {Image} image The image.
   * @param {object} meta The image meta.
   */
  update(index, image, meta) {
    const dataToUpdate = this.#data[index];

    // add slice to current image
    dataToUpdate.image.appendSlice(image);

    // update meta data
    // TODO add time support
    let idKey = '';
    if (typeof meta['00020010'] !== 'undefined') {
      // dicom case, use 'InstanceNumber'
      idKey = '00200013';
    } else {
      idKey = 'imageUid';
    }
    dataToUpdate.meta = mergeObjects(
      dataToUpdate.meta,
      meta,
      idKey,
      'value');
  }

  /**
   * Add an event listener to this class.
   *
   * @param {string} type The event type.
   * @param {object} callback The method associated with the provided
   *   event type, will be called with the fired event.
   */
  addEventListener(type, callback) {
    this.#listenerHandler.add(type, callback);
  }

  /**
   * Remove an event listener from this class.
   *
   * @param {string} type The event type.
   * @param {object} callback The method associated with the provided
   *   event type.
   */
  removeEventListener(type, callback) {
    this.#listenerHandler.remove(type, callback);
  }

  /**
   * Fire an event: call all associated listeners with the input event object.
   *
   * @param {object} event The event to fire.
   */
  #fireEvent = (event) => {
    this.#listenerHandler.fireEvent(event);
  };

  /**
   * Get a fireEvent function that adds the input index
   * to the event value.
   *
   * @param {number} index The data index.
   * @returns {Function} A fireEvent function.
   */
  #getFireEvent(index) {
    return (event) => {
      event.dataid = index;
      this.#fireEvent(event);
    };
  }

} // ImageController class
