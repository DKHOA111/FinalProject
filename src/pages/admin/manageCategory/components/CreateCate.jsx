import React from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import * as categoryApi from "../../../../service/api.category";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function CreateCate({ show, handleClose, getCategories }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      await categoryApi.createCategory(data);
      handleClose();
      getCategories();
      reset();
      toast.success("Category has been created");
    } catch {
      toast.error("Somethings went wrong!", {
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="create-cate-form" onSubmit={handleSubmit(onSubmit)}>
            {" "}
            <Form.Label>
              Name{" "}
              {errors.name && (
                <i
                  title={errors.name.message}
                  className="fa-solid fa-circle-exclamation"
                  style={{ color: "red" }}
                ></i>
              )}
            </Form.Label>
            <Form.Control
              type="text"
              {...register("name", {
                required: "This field is required",
                maxLength: {
                  value: 100,
                  message: "This field must be no more than 100 characters",
                },
              })}
            />
            <br />
            <Form.Label>
              Description{" "}
              {errors.description && (
                <i
                  title={errors.description.message}
                  className="fa-solid fa-circle-exclamation"
                  style={{ color: "red" }}
                ></i>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("description", {
                required: "This field is required",
                maxLength: {
                  value: 1000,
                  message: "This field must be no more than 1000 characters",
                },
              })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit" form="create-cate-form">
            Add New
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
