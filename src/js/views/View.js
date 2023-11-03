import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  // JS docs (documentation for functions in JS)

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string insted of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Nikhil Kumar
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // instead of updating the whole view with new values, we only want to update parts that we want to change (this will make the page faster)
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   return this.renderError();
    // }

    this._data = data;
    const newMarkup = this._generateMarkup();

    // converts the newMarkup string into a real DOM node object, so we can then compare to the old DOM element and change what we only need to
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // console.log(newDOM);

    // select all elements
    const newElements = Array.from(newDOM.querySelectorAll('*')); // querySelectorAll returns a node list, we convert to array
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(curElements);
    // console.log(newElements);

    // we then want to compare this new DOM to the cur DOM elements and only change the things that are necessary
    // DO THIS:
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); // isEqualNode compares if the nodes are exactly equal

      // updates changed text
      if (
        // checking just !newEl.isEqualNode(curEl) actually won't work because the parent elements 'textcontent' is the rest of its child elements, so it will get rid of them and just make the entire parent element only contain this text. So, we have to make sure that we are only replacing text content in elements that only contain text, not other elements
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // this is saying that if the first child of the newEl (which would be just the text content in the ones we are looking for) is not empty, ... . nodeValue property gives whatever the elements value is, so it might return a tag, text, etc.
      ) {
        curEl.textContent = newEl.textContent;
      }
      // also need to change the attributes of some elements (we use this attribute for displaying things) (we just need to check if node is different, not text content)
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
    <div>
    <svg>
    <use href="${icons}#icon-alert-triangle"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
    <div>
    <svg>
    <use href="${icons}#icon-smile"></use>
    </svg>
    </div>
    <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
