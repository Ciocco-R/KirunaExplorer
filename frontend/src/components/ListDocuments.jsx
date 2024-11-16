// ListDocuments.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
// import Document from "../model/Document";

import "../App.css";
import DocumentModal from "./DocumentModal";
import API from "../API";
import { Button } from "react-bootstrap";
import LinkModal from "./LinkModal";

function ListDocuments() {
  const [documents, setDocuments] = useState([]);
  const [show, setShow] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [linking, setLinking] = useState(false);
  const [selectedLinkDocuments, setSelectedLinkDocuments] = useState([]);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState(null);

  useEffect(() => {
    API.getAllDocumentSnippets()
      .then((response) => {
        console.log(response);
        setDocuments(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSelection = async (document) => {
    const newDoc = await API.getDocumentById(document.id);
    setSelectedDocument(newDoc);
    if (linking) {
      if(selectedDocumentToLink && document.id === selectedDocumentToLink?.id) {
        return;
      }
      const alreadySelected = selectedLinkDocuments.some(
        (doc) => doc.document.id === document.id
      );
      if(alreadySelected) {
        setSelectedLinkDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.document.id !== document.id)
        );
      } else {
        setShowLinkModal(true);
        setSelectedDocument(newDoc);
      }
    } else {
      setSelectedDocument(newDoc);
      setShow(true);
    }
  };

  const handleSave = (document) => {
    API.updateDocument(document.id, document);
    setShow(false);
  };

  const handleLinkToClick = () => {
    setSelectedDocumentToLink(selectedDocument);
    setLinking(true);
  };

  const handleAdd = (document) => {
    API.addDocument(document)
      .then(() => {
        API.getAllDocumentSnippets()
          .then((response) => {
            setDocuments(response);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    setShow(false);
  };

  const handleDelete = (documentId) => {
    API.deleteDocument(documentId);
    setShow(false);
  };

  const handleLinkConfirm = (linkedDocument) => {
    setSelectedLinkDocuments((prevDocuments) => [
      ...prevDocuments,
      linkedDocument,
    ]);
    setShowLinkModal(false);
  };

  const isLinkedDocument = (document) => {
    return (
      linking &&
      (selectedLinkDocuments.some((doc) => doc.document.id === document.id) ||
        selectedDocumentToLink?.id === document.id)
    );
  };

  const handleCompleteLink = async () => {
    try {
      await Promise.all(
        selectedLinkDocuments.map(async (linkedDocument) => {
          await API.createLink(selectedDocumentToLink, linkedDocument);
        })
      );
      alert("All the selected links have been confirmed!");
      setLinking(false);
      setSelectedLinkDocuments([]);
    } catch (error) {
      console.error("Error linking documents:", error);
      alert("There was an error linking the documents. Please try again.");
    }
  };

  const handleExitLinkMode = () => {
    setLinking(false);
    setSelectedLinkDocuments([]);
  }

  return (
    <Container fluid className="scrollable-list-documents">
      <Row>{linking ? <h1>Link a document</h1> : <h1>Documents</h1>}</Row>
      <Row className="d-flex justify-content-between align-items-center mb-3">
        <Col xs="auto">
          {linking ? (
            <p>Choose the document you want to link</p>
          ) : (
            <>
              <p>
                Here you can find all the documents about Kiruna&apos;s
                relocation process.
              </p>
              <p>Click on a document to see more details.</p>
            </>
          )}
        </Col>
        <Col xs="auto">
          {linking ? (
            <>
            <Button
              variant="primary"
              style={{ width: "90px", marginRight: "10px" }}
              onClick={() => {
                handleCompleteLink();
                //setSelectedDocument({ isEditable: true });
              }}
            >
              Link ({selectedLinkDocuments.length})
            </Button>
            <Button
              variant="secondary"
              style={{ width: "90px" }}
              onClick={() => {
                handleExitLinkMode();
              }}
            >
              Exit
            </Button>
            </>
          ) : (
            <Button
              variant="primary"
              style={{ width: "170px" }}
              onClick={() => {
                setSelectedDocument({ isEditable: true });
                setShow(true);
              }}
            >
              Add new document
            </Button>
          )}
        </Col>
      </Row>
      <div
        className="mx-auto"
        style={{
          paddingBottom: "5rem",
        }}
      >
        <Row
          xs={1}
          sm={2}
          md={3}
          lg={4}
          className="g-4 mx-auto"
          style={{ width: "100%" }}
        >
          {documents.map((document) => (
            <Col key={document.id}>
              <Card
                className="document-card h-100"
                style={{
                  backgroundColor: isLinkedDocument(document) ? "#b1b0aa" : "",
                }}
                onClick={() => {
                  handleSelection(document); 
                }}
              >
                <Card.Body>
                  <Card.Title className="document-card-title">
                    {document.title}
                  </Card.Title>
                  <div className="divider" />
                  <Card.Text className="document-card-text">
                    <strong>Scale:</strong> {document.scale}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Issuance Date:</strong> {document.issuanceDate}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Type:</strong> {document.type}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {selectedDocument && (
          <DocumentModal
            onLinkToClick={handleLinkToClick}
            show={show}
            onHide={() => {
              setSelectedDocument(null);
              setShow(false);
            }}
            document={selectedDocument}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
          />
        )}
        {selectedDocumentToLink && showLinkModal && (
          <LinkModal
            showModal={showLinkModal}
            handleClose={() => {
              setSelectedDocument(null);
              setShowLinkModal(false);
            }}
            setSelectedLinkDocuments={setSelectedLinkDocuments}
            selectedLinkDocuments={selectedLinkDocuments}
            document={selectedDocument}
            onLinkConfirm={handleLinkConfirm}
          />
        )}
      </div>
    </Container>
  );
}

export default ListDocuments;
