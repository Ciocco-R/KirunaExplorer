import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Document } from "../model/Document.mjs";
// import dayjs from "dayjs";
import "../App.css";

function DocumentModal(props) {
  const [isEditable, setIsEditable] = useState(false);

  const [title, setTitle] = useState("");
  const [stakeholders, setStakeholders] = useState([]);
  const [scale, setScale] = useState("");
  const [issuanceDate, setIssuanceDate] = useState("");
  const [type, setType] = useState("");
  const [nrConnections, setNrConnections] = useState(0);
  const [language, setLanguage] = useState("");
  const [nrPages, setNrPages] = useState(0);
  const [geolocation, setGeolocation] = useState({
    latitude: null,
    longitude: null,
    municipality: "",
  });
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Update the state when the document prop changes
  useEffect(() => {
    if (props.document) {
      setIsEditable(props.document.isEditable || false);
      setTitle(props.document.title || "");
      setStakeholders(props.document.stakeholders || []);
      setScale(props.document.scale || "");
      setIssuanceDate(props.document.issuanceDate || "");
      setType(props.document.type || "");
      setNrConnections(props.document.nrConnections || 0);
      setLanguage(props.document.language || "");
      setNrPages(props.document.nrPages || 0);
      setGeolocation(
        props.document.geolocation || {
          latitude: "",
          longitude: "",
          municipality: "",
        }
      );
      setDescription(props.document.description || "");
    }
    setErrors({});
  }, [props.document]);

  // const validateForm = () => {
  //   const validationErrors = {};

  //   if (title.trim() === "" || title === null) {
  //     validationErrors.title = "This field cannot be empty.";
  //   } else if (title.length < 2) {
  //     validationErrors.title = "Title must be at least 2 characters long.";
  //   } else if (title.length > 64) {
  //     validationErrors.title = "Title must be at most 64 characters long.";
  //   }

  //   if (scale.trim() === "" || scale === null) {
  //     validationErrors.scale = "This field cannot be empty.";
  //   } else if (
  //     scale !== "text" &&
  //     scale !== "blueprint/material effects" &&
  //     !scale.match("^1:[1-9][0-9]*$")
  //   ) {
  //     validationErrors.scale =
  //       "Please enter a valid scale. (ex. text, blueprint/material effects, 1:100)";
  //   }

  //   if (issuanceDate.trim() === "" || issuanceDate === null) {
  //     validationErrors.issuanceDate = "This field cannot be empty.";
  //   } else if (!dayjs(issuanceDate, "YYYY-MM-DD").isValid()) {
  //     validationErrors.issuanceDate =
  //       "Please enter a valid date. (ex. 01/01/2021)";
  //   }

  //   if (type.trim() === "" || type === null) {
  //     validationErrors.type = "This field cannot be empty.";
  //   }

  //   if (description.trim() === "" || description === null) {
  //     validationErrors.description = "This field cannot be empty.";
  //   } else if (description.length < 2) {
  //     validationErrors.description =
  //       "Description must be at least 2 characters long.";
  //   } else if (description.length > 1000) {
  //     validationErrors.description =
  //       "Description must be at most 1000 characters long.";
  //   }

  //   if (stakeholders.length === 0) {
  //     validationErrors.stakeholders = "This field cannot be empty.";
  //   } else {
  //     for (let s of stakeholders) {
  //       if (s.trim() === "" || s === null) {
  //         validationErrors.stakeholders = "This field cannot be empty.";
  //       }
  //     }
  //   }

  //   if (language.trim() !== "" && language !== null && language.length > 64) {
  //     validationErrors.language =
  //       "Language must be at most 64 characters long.";
  //   }

  //   if (!isNaN(nrPages)) {
  //     validationErrors.nrPages = "Please enter a valid number of pages.";
  //   }

  //   if (
  //     geolocation &&
  //     (isNaN(geolocation.latitude) || isNaN(geolocation.longitude))
  //   ) {
  //     validationErrors.geolocation =
  //       "Please enter valid numeric values for latitude and longitude.";
  //   } else if (
  //     geolocation === "Whole municipality" &&
  //     geolocation.length > 64
  //   ) {
  //     validationErrors.geolocation =
  //       "Geolocation must be at most 64 characters long.";
  //   }

  //   return validationErrors;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    /*const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }*/

    if (props.document.id === undefined) {
      props.handleAdd(
        new Document(
          null, // id
          title, // title
          stakeholders, // stakeholders
          scale, // scale
          issuanceDate, // issuanceDate
          type, // type
          0, // nrConnections (default 0)
          language, // language
          nrPages, // nrPages
          geolocation, // geolocation
          description // description
        )
      );
    } else {
      props.handleSave(
        new Document(
          props.document.id,
          title,
          stakeholders,
          scale,
          issuanceDate,
          type,
          nrConnections,
          language,
          nrPages,
          {
            latitude: parseFloat(geolocation.latitude),
            longitude: parseFloat(geolocation.longitude),
          },
          description
        )
      );
    }
    props.onHide();
  };

  // const handleModifyClick = () => {
  //   setIsEditable(true);
  // };

  const handleLinkToClick = () => {
    props.onHide();
    props.onLinkToClick();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
      className="document-modal"
      size="lg"
      // fullscreen={isEditable}
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          {isEditable ? "Enter the values in the following fields" : title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {isEditable ? (
          <DocumentFormComponent
            title={title}
            stakeholders={stakeholders}
            scale={scale}
            issuanceDate={issuanceDate}
            type={type}
            nrConnections={nrConnections}
            language={language}
            nrPages={nrPages}
            geolocation={geolocation}
            description={description}
            setTitle={setTitle}
            setStakeholders={setStakeholders}
            setScale={setScale}
            setIssuanceDate={setIssuanceDate}
            setType={setType}
            setNrConnections={setNrConnections}
            setLanguage={setLanguage}
            setNrPages={setNrPages}
            setGeolocation={setGeolocation}
            setDescription={setDescription}
            errors={errors}
            setErrors={setErrors}
            handleSubmit={handleSubmit}
          />
        ) : (
          <ModalBodyComponent
            title={title}
            stakeholders={stakeholders}
            scale={scale}
            issuanceDate={issuanceDate}
            type={type}
            nrConnections={nrConnections}
            language={language}
            nrPages={nrPages}
            geolocation={geolocation}
            description={description}
          />
        )}
      </Modal.Body>
      <Modal.Footer className="mt-3">
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        {isEditable ? (
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        ) : (
          <div className="d-flex align-items-center">
            <Button
              variant="primary"
              onClick={handleLinkToClick}
              className="me-2"
            >
              Link to
            </Button>
            {/* <Button
              variant="primary"
              onClick={handleModifyClick}
              className="me-2"
            >
              Modify
            </Button> */}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

DocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  onLinkToClick: PropTypes.func.isRequired,
};

function ModalBodyComponent(props) {
  return (
    <div className="document-info">
      <div className="info-section">
        <div className="info-item">
          <label>Stakeholders:</label>
          <span>{props.stakeholders}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Scale:</label>
          <span>{props.scale}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Issuance Date:</label>
          <span>{props.issuanceDate}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Type:</label>
          <span>{props.type}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Connections:</label>
          <span>
            {props.nrConnections === 0 ? (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    This document has no links yet. Remember to add them.
                  </Tooltip>
                }
              >
                <i className="bi bi-exclamation-triangle"></i>
              </OverlayTrigger>
            ) : (
              props.nrConnections
            )}
          </span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Language:</label>
          <span>{props.language ? `${props.language}` : "-"}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Pages:</label>
          <span>{props.nrPages > 0 ? `${props.nrPages}` : "-"}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Location:</label>
          <span>
            {props.geolocation.latitude && props.geolocation.longitude ? (
              `${props.geolocation.latitude}, ${props.geolocation.longitude}`
            ) : props.geolocation.municipality ? (
              `${props.geolocation.municipality}`
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    This document hasn&apos;t been geolocated yet. Remember to
                    add it.
                  </Tooltip>
                }
              >
                <i className="bi bi-exclamation-triangle"></i>
              </OverlayTrigger>
            )}
          </span>
        </div>
      </div>
      <div className="divider-vertical"></div>
      <div className="description-area">
        <label>Description:</label>
        <p>{props.description}</p>
      </div>
    </div>
  );
}

ModalBodyComponent.propTypes = {
  title: PropTypes.string,
  stakeholders: PropTypes.array,
  scale: PropTypes.string,
  issuanceDate: PropTypes.string,
  type: PropTypes.string,
  nrConnections: PropTypes.number,
  language: PropTypes.string,
  nrPages: PropTypes.number,
  geolocation: PropTypes.object,
  description: PropTypes.string,
};

ModalBodyComponent.defaultProps = {
  stakeholders: [],
};

function DocumentFormComponent(props) {
  const handleAddStakeholder = () => {
    props.setStakeholders([...props.stakeholders, ""]);
  };

  const handleDeleteStakeholder = (index) => {
    const newStakeholders = props.stakeholders.filter((_, i) => i !== index);
    props.setStakeholders(newStakeholders);
  };

  const handleStakeholderChange = (index, value) => {
    const newStakeholders = [...props.stakeholders];
    newStakeholders[index] = value;
    props.setStakeholders(newStakeholders);
  };

  return (
    <Form style={{ width: "100%" }} className="mx-auto">
      {/* TITLE */}
      <Form.Group className="mb-3" controlId="formDocumentTitle">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          type="text"
          value={props.title}
          onChange={(e) => props.setTitle(e.target.value)}
          isInvalid={!!props.errors.title}
          minLength={2}
          maxLength={64}
          required
        />
        {props.errors.title && (
          <Form.Control.Feedback type="invalid">
            {props.errors.title}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <div className="divider"></div>

      {/* STAKEHOLDERS */}
      <Form.Group className="mb-3" controlId="formDocumentStakeholders">
        <Form.Label>Stakeholders *</Form.Label>
        {props.stakeholders.map((stakeholder, index) => (
          <div key={index} className="d-flex mb-2">
            <Form.Control
              type="text"
              value={stakeholder}
              onChange={(e) => handleStakeholderChange(index, e.target.value)}
              isInvalid={!!props.errors.stakeholders}
              required
            />
            <Button
              variant="danger"
              onClick={() => handleDeleteStakeholder(index)}
              className="ms-2"
            >
              <i className="bi bi-trash"></i>
            </Button>
          </div>
        ))}
        {props.errors.stakeholders && (
          <Form.Control.Feedback type="invalid">
            {props.errors.stakeholders}
          </Form.Control.Feedback>
        )}
        <Button variant="primary" onClick={handleAddStakeholder}>
          Add Stakeholder
        </Button>
      </Form.Group>
      <div className="divider"></div>

      {/* SCALE */}
      <Form.Group className="mb-3" controlId="formDocumentScale">
        <Form.Label>Scale *</Form.Label>
        <Form.Control
          type="text"
          value={props.scale}
          onChange={(e) => props.setScale(e.target.value)}
          isInvalid={!!props.errors.scale}
          required
        />
        {props.errors.scale && (
          <Form.Control.Feedback type="invalid">
            {props.errors.scale}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <div className="divider"></div>

      {/* ISSUANCE DATE */}
      <Form.Group className="mb-3" controlId="formDocumentIssuanceDate">
        <Form.Label>Issuance Date *</Form.Label>
        <Form.Control
          type="date"
          value={props.issuanceDate}
          onChange={(e) => props.setIssuanceDate(e.target.value)}
          isInvalid={!!props.errors.issuanceDate}
          required
        />
        {props.errors.issuanceDate && (
          <Form.Control.Feedback type="invalid">
            {props.errors.issuanceDate}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <div className="divider"></div>

      {/* TYPE */}
      <Form.Group className="mb-3" controlId="formDocumentType">
        <Form.Label>Type *</Form.Label>
        <Form.Control
          as="select"
          value={props.type}
          onChange={(e) => props.setType(e.target.value)}
          isInvalid={!!props.errors.type}
          required
        >
          <option value="">Select type</option>
          <option value="Design document">Design document</option>
          <option value="Material effect">Material effect</option>
          <option value="Technical document">Technical document</option>
          <option value="Prescriptive document">Prescriptive document</option>
          <option value="Informative document">Informative document</option>
        </Form.Control>
        {props.errors.type && (
          <Form.Control.Feedback type="invalid">
            {props.errors.type}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <div className="divider"></div>

      {/* LANGUAGE */}
      <Form.Group className="mb-3" controlId="formDocumentLanguage">
        <Form.Label>Language</Form.Label>
        <Form.Control
          type="text"
          value={props.language}
          onChange={(e) => props.setLanguage(e.target.value)}
        />
      </Form.Group>
      <div className="divider"></div>

      {/* NR CONNECTIONS */}
      <Form.Group className="mb-3" controlId="formDocumentNrPages">
        <Form.Label>Pages</Form.Label>
        <Form.Control
          type="number"
          value={props.nrPages}
          onChange={(e) => props.setNrPages(Number(e.target.value))}
        />
      </Form.Group>
      <div className="divider"></div>

      <Form.Group className="mb-3" controlId="formDocumentGeolocationLatitude">
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          type="number"
          value={props.geolocation.latitude}
          onChange={(e) =>
            props.setGeolocation({
              ...props.geolocation,
              latitude: e.target.value,
              municipality: null,
            })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDocumentGeolocationLongitude">
        <Form.Label>Longitude</Form.Label>
        <Form.Control
          type="number"
          value={props.geolocation.longitude}
          onChange={(e) =>
            props.setGeolocation({
              ...props.geolocation,
              longitude: e.target.value,
              municipality: null,
            })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formDocumentWholeMunicipality">
        <Form.Check
          type="checkbox"
          label="Whole municipality"
          onChange={(e) => {
            if (e.target.checked) {
              props.setGeolocation({
                latitude: null,
                longitude: null,
                municipality: "",
              });
            }
            document.getElementById(
              "formDocumentGeolocationLatitude"
            ).disabled = e.target.checked;
            document.getElementById(
              "formDocumentGeolocationLongitude"
            ).disabled = e.target.checked;
          }}
          className="mt-2"
        />
      </Form.Group>
      {props.errors.geolocation && (
        <Form.Control.Feedback type="invalid">
          {props.errors.geolocation}
        </Form.Control.Feedback>
      )}
      <div className="divider"></div>

      {/* DESCRIPTION */}
      <Form.Group className="mb-3" controlId="formDocumentDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={props.description}
          onChange={(e) => props.setDescription(e.target.value)}
          isInvalid={!!props.errors.description}
          required
        />
        {props.errors.description && (
          <Form.Control.Feedback type="invalid">
            {props.errors.description}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </Form>
  );
}

DocumentFormComponent.propTypes = {
  title: PropTypes.string.isRequired,
  stakeholders: PropTypes.array.isRequired,
  scale: PropTypes.string.isRequired,
  issuanceDate: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  nrConnections: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  nrPages: PropTypes.number.isRequired,
  geolocation: PropTypes.shape({
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    municipality: PropTypes.string,
  }),
  description: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  setStakeholders: PropTypes.func.isRequired,
  setScale: PropTypes.func.isRequired,
  setIssuanceDate: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  setNrConnections: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  setNrPages: PropTypes.func.isRequired,
  setGeolocation: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
};

export default DocumentModal;
