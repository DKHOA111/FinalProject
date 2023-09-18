import { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as authorApi from "../../../../service/api.author";
import { toast } from "react-toastify";

export default function DeleteAuthor(props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (props.show) {
      setId(props.dataEdit.id || "");
      setName(props.dataEdit.name || "");
    }
  }, [props.dataEdit, props.show]);

  const onSubmit = async () => {
    try {
      await authorApi.deleteAuthor(id);
      toast.success("Author has been deleted", {
        theme: "dark",
      });
      props.getAuthors(props.search, props.page);
      props.handleClose();
    } catch (error) {
      toast.error("Failed to delete manga");
    }
  };

  return (
    <div>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Label>Original Title</Form.Label>
              <Form.Control type="text" value={name} disabled />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onSubmit}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
