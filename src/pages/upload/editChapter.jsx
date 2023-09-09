import { useState, useRef, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import * as groupApi from "../../service/api.group";
import * as chapterApi from "../../service/api.chapter";
import { LanguageContext } from "../../context/LanguageContext";
import "./styles.css";
import {
  convertToImage,
  buildFormData,
  handleSelectedImages,
  handleRemoveImage,
  handleDragOver,
} from "./chapterUtilities";
import { UserContext } from "../../context/UserContext";

export default function Edit() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const { languageOptions } = useContext(LanguageContext);
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [chapter, setChapter] = useState(null);
  const [imageInfos, setImageInfos] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [groups, setGroups] = useState([]);
  const groupOptions = groups?.map((group) => ({
    value: group.id,
    label: group.name,
  }));
  const fileInputRef = useRef(null);

  //submit the form
  const onSubmit = async (data) => {
    if (!imageInfos.length) {
      return toast.error("Please select at least one image.");
    }

    const images = await convertToImage(imageInfos);
    const formData = buildFormData(data, images);
    try {
      await chapterApi.updateChapter(chapterId, formData);
      toast.success("A Chapter has been updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  //
  async function urlToImageFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const setInitialPages = async () => {
    const imageFiles = await Promise.all(
      chapter.pageUrls.map((url) => urlToImageFile(url, url.split("/").pop()))
    );
    setImageInfos(
      imageFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
  };

  useEffect(() => {
    if (chapter) {
      setValue("id", chapter.id);
      setValue("name", chapter.name);
      setValue("number", chapter.number);
      setValue("language", {
        value: chapter.language,
        label: chapter.language,
      });
      setValue("uploadingGroupId", {
        value: chapter.uploadingGroup.id,
        label: chapter.uploadingGroup.name,
      });
      setInitialPages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, setValue]);

  useEffect(() => {
    getChapterDetail(chapterId);
    fetchGroupOptions(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, userId]);

  const fetchGroupOptions = async (id) => {
    try {
      let res = await groupApi.getUploadGroup(id);
      setGroups(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("404");
      }
    }
  };

  const getChapterDetail = async (id) => {
    try {
      const result = await chapterApi.getChapter(id);
      setChapter(result.data);
      document.title = `Edit - ${result.data.manga.originalTitle} -chap ${result.data.number} - 3K Manga`;
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/404");
      }
    }
  };

  const handleSelected = (e) => {
    handleSelectedImages(e, imageInfos, setImageInfos);
  };

  const handleRemove = (index) => {
    handleRemoveImage(index, imageInfos, setImageInfos);
  };

  const handleDrag = (index) => {
    handleDragOver(
      index,
      draggedIndex,
      setDraggedIndex,
      imageInfos,
      setImageInfos
    );
  };

  return (
    <>
      <ToastContainer />
      <div style={{ fontSize: "25px", fontWeight: "bold" }}>
        <Link to={`/upload/chapter`}>
          <button className="return-button">
            <span>
              <i className="fa-solid fa-arrow-left"></i>
            </span>
          </button>
        </Link>{" "}
        Edit Chapter
      </div>
      <Container fluid>
        <Card className="uploader-card">
          <Row>
            <Col xs={4} md={2} xl={1}>
              {chapter ? (
                <Card.Img
                  src={
                    chapter.manga.coverPath || "/img/error/coverNotFound.png"
                  }
                  alt="Manga Cover"
                  className="coverPath"
                />
              ) : (
                <p>Cover not found.</p>
              )}
            </Col>
            <Col xs={8} md={9} xl={10} style={{ padding: "15px" }}>
              {chapter ? (
                <>
                  <Card.Title className="text-limit-1">
                    <b>{chapter.manga.originalTitle}</b>
                  </Card.Title>
                  <Card.Text className="manga-category text-limit-2">
                    {chapter.manga.categories.map((c) => (
                      <Link
                        to={`/manga?included=${c.id.substring(0, 5)}`}
                        className="btn-pill clickable"
                        key={c.id}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </Card.Text>
                </>
              ) : (
                <p>Manga not found.</p>
              )}
            </Col>
          </Row>
        </Card>
        &nbsp;
        <Form id="update-form" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="mb-3">
              <Form.Label>
                Group{" "}
                {errors.uploadingGroupId && (
                  <i
                    title={errors.uploadingGroupId.message}
                    className="fa-solid fa-circle-exclamation"
                    style={{ color: "red" }}
                  ></i>
                )}
              </Form.Label>
              <Controller
                name="uploadingGroupId"
                defaultValue={null}
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select {...field} isClearable options={groupOptions} />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} lg={4} className="mb-3">
              <Form.Label>
                Chapter number{" "}
                {errors.number && (
                  <i
                    title={errors.number.message}
                    className="fa-solid fa-circle-exclamation"
                    style={{ color: "red" }}
                  ></i>
                )}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Number"
                aria-label="Chapter number"
                min={"0"}
                {...register("number", {
                  required: "Chapter number is required",
                })}
              />
            </Col>
            <Col md={4} lg={4} className="mb-3">
              <Form.Label>
                Chapter name{" "}
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
                placeholder="Name"
                aria-label="Chapter name"
                {...register("name", {
                  required: "Chapter number is required",
                })}
              />
            </Col>
            <Col md={4} lg={4} className="mb-3">
              <Form.Label>
                Choose language{" "}
                {errors.language && (
                  <i
                    title={errors.language.message}
                    className="fa-solid fa-circle-exclamation"
                    style={{ color: "red" }}
                  ></i>
                )}
              </Form.Label>
              <Controller
                defaultValue={null}
                name="language"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Select {...field} isClearable options={languageOptions} />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Form.Label>Pages</Form.Label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleSelected}
              style={{ display: "none" }}
              multiple
            />
            <div className="image-container justify-left flex-wrap mb-4">
              {imageInfos.map((imageInfo, index) => (
                <div
                  key={imageInfo.name}
                  className={`pages-upload-card flex-grow-0 ${
                    draggedIndex === index ? "dragging" : ""
                  }`}
                  draggable="true"
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={() => handleDrag(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                >
                  <img
                    className="image"
                    src={imageInfo.url}
                    alt="pages"
                    draggable="false"
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleRemove(index)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <button type="button" className="drag-button">
                    <i className="fa-solid fa-arrows-up-down-left-right"></i>
                  </button>
                  <div className="image-label">{imageInfo.name}</div>
                </div>
              ))}
              <div
                className="input-pages"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fa-solid fa-plus" />
              </div>
            </div>
            {imageInfos.length > 0 ? (
              <div>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setImageInfos([])}
                >
                  Remove all pages
                </button>
              </div>
            ) : (
              <></>
            )}
          </Row>
        </Form>
        <Row>
          <Col className="d-flex justify-content-end">
            <button
              type="submit"
              form="update-form"
              className="new-to-you"
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                padding: "6px 15px",
              }}
            >
              Update
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
