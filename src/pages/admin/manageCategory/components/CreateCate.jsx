import React from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { createCategory } from "../../../../service/api.category";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function CreateCate({ show, handleClose, getCategories }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    console.log("cate", data);
    try {
      await createCategory(data);
      handleClose();
      getCategories();
      reset();
      toast.success("Category has been created");
    } catch {
      toast.error("Somethings went wrong!");
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
                minLength: {
                  value: 3,
                  message: "This field must be at least 3 characters",
                },
              })}
            />
            <Form.Label>
              Description {""}
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
                maxLength: {
                  value: 1000,
                  message: "This field must be less than 1000 characters",
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

export default CreateCate;
