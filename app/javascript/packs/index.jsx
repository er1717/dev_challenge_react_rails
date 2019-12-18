// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Logo from '../../assets/images/name_logo.png';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class App extends React.Component {
  state = {
    showModal: false,
    length: '',
    width: '',
    height: '',
    weight: '',
    modalProductValue: '',
    pageProductValue: ''
  };

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  toggleModal = () =>
    this.setState(prevState => ({ showModal: !prevState.showModal }));

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleFormSubmit = e => {
    e.preventDefault();
    const { length, width, height, weight } = this.state;
    fetch(
      `/products?length=${length}&width=${width}&height=${height}&weight=${weight}`
    )
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ modalProductValue: res.error });
        } else {
          this.setState({ modalProductValue: `Use this ${res.name}` });
          setTimeout(() => {
            this.setState({ pageProductValue: res.name }, this.toggleModal);
          }, 5000);
        }
      })
      .catch(err => console.log('error occured', err));
  };
  render() {
    const { showModal, modalProductValue, pageProductValue } = this.state;
    return (
      <div className="container">
        <div>
          <div className="navbar navbar-dark bg-dark shadow-sm">
            <img src={Logo} />
          </div>
        </div>

        <div>
          <a
            href="https://github.com/er1717/dev_challenge_react_rails#api-documentation"
            target="_blank"
          >
            View API Docs
          </a>
        </div>

        <div
          className="mt-3 text-center text-success"
          style={{ marginTop: 60, marginBottom: 100 }}
        >
          <h1>{pageProductValue}</h1>
        </div>

        <div className="container text-center mb-3" style={{ marginTop: 60 }}>
          <h3 onClick={this.toggleModal}>Launch Calculator</h3>
        </div>
        {}
        <Modal
          isOpen={showModal}
          onRequestClose={this.toggleModal}
          style={customStyles}
        >
          <h5 className="modal-title container text-center">
            {modalProductValue}
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <form onSubmit={this.handleFormSubmit} method="post">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="input_length">Length</label>
                <input
                  min="0"
                  step="1"
                  required
                  type="number"
                  className="form-control"
                  id="input_length"
                  name="length"
                  placeholder="Length"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="input_width">Width</label>
                <input
                  min="0"
                  step="1"
                  required
                  type="number"
                  className="form-control"
                  id="input_width"
                  name="width"
                  placeholder="Width"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="input_height">Height</label>
                <input
                  required
                  min="0"
                  step="1"
                  type="number"
                  className="form-control"
                  id="input_height"
                  name="height"
                  placeholder="Height"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="input_wieght">Weight</label>
                <input
                  min="0"
                  step="1"
                  required
                  type="number"
                  className="form-control"
                  id="input_weight"
                  name="weight"
                  placeholder="Weight"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="container text-center">
              <button type="submit" className="btn btn-success">
                Calculate
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

App.defaultProps = {
  name: 'David'
};

App.propTypes = {
  name: PropTypes.string
};

document.addEventListener('DOMContentLoaded', () => {
  const divElement = document.createElement('div');
  divElement.id = 'app';
  ReactDOM.render(<App />, document.body.appendChild(divElement));
});
